// @flow
import { useEffect, useReducer } from 'react'

// Hooks
import { useContract, truncateHash } from '@brickblock/web3-utils'

// Data
import reducer, { initialState } from './reducer'

// Utils
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import sellActForEth from './sell-act-for-eth'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type { CurrentProviderT } from 'types'

export type ACTContextT = {|
  handleCleanup: () => void,
  handleSellActForEth: (amount: string) => void,
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
  const handleSellActForEth = amount => {
    dispatch({ type: 'sell-act-for-eth', payload: amount })
  }

  const handleCleanup = () => {
    dispatch({ type: 'sell-act-for-eth/cleanup' })
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
    [AccessToken, address, state.sellActForEth.transactions]
  )

  useEffect(
    function sellActForEthEffect() {
      // eslint-disable-next-line no-extra-semi
      ;(async () => {
        sellActForEth({
          AccessToken,
          FeeManager,
          address,
          amount: state.sellActForEth.amount,
          dispatch,
        })
      })()
    },
    [AccessToken, FeeManager, address, state.sellActForEth.amount]
  )

  return { state, handleSellActForEth, handleCleanup }
}

export default useAct
