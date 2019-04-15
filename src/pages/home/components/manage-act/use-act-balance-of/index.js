// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract, truncateHash } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'

type UseActBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  web3Provider: ?mixed,
}) => {
  balance: StateT,
}
export const useActBalanceOf: UseActBalanceOfT = ({
  address,
  contractRegistry,
  web3Provider,
}) => {
  const [balance, dispatch] = useReducer<StateT, ActionsT>(
    reducer,
    initialState
  )

  const { contractInstance: AccessToken } = useContract({
    contractName: 'AccessToken',
    contractRegistry,
    web3Provider,
  })

  useEffect(
    function getActBalance() {
      // eslint-disable-next-line no-extra-semi
      ;(async () => {
        if (!AccessToken || !AccessToken.balanceOf || address == null) {
          dispatch({ type: 'reset-balance' })
        } else {
          try {
            const rawBalance = await AccessToken.balanceOf.call(address)

            if (!isBN(rawBalance)) {
              dispatch({
                type: 'set-balance/error',
                payload: `AccessToken.balanceOf(${truncateHash(
                  address
                )}) didn't return value of type 'BN'. Actual value was: ${rawBalance}`,
              })

              return
            }

            const formattedBalance = formatWeiValue(rawBalance)

            dispatch({
              type: 'set-balance',
              payload: formattedBalance,
            })
          } catch (error) {
            dispatch({
              type: 'set-balance/error',
              payload: error,
            })
          }
        }
      })()
    },
    [AccessToken, address]
  )

  return { balance }
}

export default useActBalanceOf
