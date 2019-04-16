// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import { truncateHash } from '@brickblock/web3-utils'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type BN from 'bn.js'

type GetUnlockedBbkBalanceT = ({
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  state: StateT,
}) => void
export const getUnlockedBbkBalance: GetUnlockedBbkBalanceT = ({
  BrickblockToken,
  address,
  dispatch,
  state,
}) => {
  // eslint-disable-next-line no-extra-semi
  ;(async () => {
    if (!BrickblockToken || !BrickblockToken.balanceOf || address == null) {
      dispatch({ type: 'reset-balances' })
    } else {
      try {
        const rawBalance: BN = await BrickblockToken.balanceOf.call(address)

        if (!isBN(rawBalance)) {
          dispatch({
            type: 'set-unlocked-balance/error',
            payload: `BrickblockToken.balanceOf(${truncateHash(
              address
            )}) didn't return value of type 'BN'.\nActual value was: ${String(
              rawBalance
            )}.\nActual type was ${typeof rawBalance}`,
          })

          return
        }

        const newBalance = formatWeiValue(rawBalance)

        // First execution of this effect, just set the initial balance directly
        if (!state.unlocked) {
          dispatch({
            type: 'set-unlocked-balance',
            payload: newBalance,
          })
        } else {
          // If there is a pre-existing balance, only dispatch 'set-balance' if the balance actually changed
          if (newBalance.valueAsNumber !== state.unlocked.valueAsNumber) {
            dispatch({
              type: 'set-unlocked-balance',
              payload: newBalance,
            })
          }
        }
      } catch (error) {
        dispatch({
          type: 'set-unlocked-balance/error',
          payload: error,
        })
      }
    }
  })()
}

export default getUnlockedBbkBalance
