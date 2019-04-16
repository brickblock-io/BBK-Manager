// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import { truncateHash } from '@brickblock/web3-utils'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type BN from 'bn.js'

type GetLockedBbkBalanceT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  state: StateT,
}) => void
export const getLockedBbkBalance: GetLockedBbkBalanceT = ({
  AccessToken,
  address,
  dispatch,
  state,
}) => {
  // eslint-disable-next-line no-extra-semi
  ;(async () => {
    if (!AccessToken || !AccessToken.lockedBbkOf || address == null) {
      dispatch({ type: 'reset-balances' })
    } else {
      try {
        const rawBalance: BN = await AccessToken.lockedBbkOf.call(address)

        if (!isBN(rawBalance)) {
          dispatch({
            type: 'set-locked-balance/error',
            payload: `AccessToken.lockedBbkOf(${truncateHash(
              address
            )}) didn't return value of type 'BN'. Actual value was: ${String(
              rawBalance
            )}.\nActual type was ${typeof rawBalance}`,
          })

          return
        }

        const newBalance = formatWeiValue(rawBalance)

        // First execution of this effect, just set the initial balance directly
        if (!state.locked) {
          dispatch({
            type: 'set-locked-balance',
            payload: newBalance,
          })
        } else {
          // If there is a pre-existing balance, only dispatch 'set-balance' if the balance actually changed
          if (newBalance.valueAsNumber !== state.locked.valueAsNumber) {
            dispatch({
              type: 'set-locked-balance',
              payload: newBalance,
            })
          }
        }
      } catch (error) {
        dispatch({
          type: 'set-locked-balance/error',
          payload: error,
        })
      }
    }
  })()
}

export default getLockedBbkBalance
