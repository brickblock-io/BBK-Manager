// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract, truncateHash } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import convertActToEth from './convert-act-to-eth'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type { CurrentProviderT } from 'types'

export type ACTContextT = {|
  handleCleanup: () => void,
  handleConvertActToEth: (amount: string) => void,
  state: StateT,
|}

type UseActBalanceOfT = ({
  address: ?string,
  contractRegistry: ?AbstractContractT,
  currentProvider: ?CurrentProviderT,
}) => ACTContextT
export const useAct: UseActBalanceOfT = ({
  address,
  contractRegistry,
  currentProvider,
}) => {
  const [state, dispatch] = useReducer<StateT, ActionsT>(reducer, initialState)

  const { contractInstance: AccessToken } = useContract({
    contractName: 'AccessToken',
    contractRegistry,
    currentProvider,
  })

  const { contractInstance: FeeManager } = useContract({
    contractName: 'FeeManager',
    contractRegistry,
    currentProvider,
  })

  /*
   * Handlers
   */
  const handleConvertActToEth = amount => {
    dispatch({ type: 'convert-act-to-eth', payload: amount })
  }

  const handleCleanup = () => {
    dispatch({ type: 'convert-act-to-eth/cleanup' })
  }

  useEffect(
    function getActBalanceEffect() {
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

            const newBalance = formatWeiValue(rawBalance)

            // First execution of this effect, just set the initial balance directly
            if (!state.balance) {
              dispatch({
                type: 'set-balance',
                payload: newBalance,
              })
            } else {
              // If there is a pre-existing balance, only dispatch 'set-balance' if the balance actually changed
              if (newBalance.valueAsNumber !== state.balance.valueAsNumber) {
                dispatch({
                  type: 'set-balance',
                  payload: newBalance,
                })
              }
            }
          } catch (error) {
            dispatch({
              type: 'set-balance/error',
              payload: error,
            })
          }
        }
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [AccessToken, address, state.convertActToEth.transactions]
  )

  useEffect(
    function convertActToEthEffect() {
      // eslint-disable-next-line no-extra-semi
      ;(async () => {
        convertActToEth({
          AccessToken,
          FeeManager,
          address,
          amount: state.convertActToEth.amount,
          dispatch,
        })
      })()
    },
    [AccessToken, FeeManager, address, state.convertActToEth.amount]
  )

  return { state, handleConvertActToEth, handleCleanup }
}

export default useAct
