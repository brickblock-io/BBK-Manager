// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type { CurrentProviderT } from 'types'

// Hooks
import { useEffect, useReducer } from 'react'
import { useContract } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import reportError from 'utils/report-error'

type UseActBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  currentProvider: ?CurrentProviderT,
}) => {
  balance: StateT,
}
export const useActBalanceOf: UseActBalanceOfT = ({
  address,
  contractRegistry,
  currentProvider,
}) => {
  const [balance, dispatch] = useReducer<StateT, ActionsT>(
    reducer,
    initialState
  )

  const { contractInstance: AccessToken } = useContract({
    contractName: 'AccessToken',
    contractRegistry,
    currentProvider,
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
                payload: "Couldn't fetch ACT balance",
              })
              reportError(
                new Error(
                  `AccessToken.balanceOf() didn't return value of type 'BN'. Actual type was: ${typeof rawBalance}`
                )
              )

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
            reportError(error)
          }
        }
      })()
    },
    [AccessToken, address]
  )

  return { balance }
}

export default useActBalanceOf
