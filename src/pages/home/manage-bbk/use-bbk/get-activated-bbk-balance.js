// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type BN from 'bn.js'

// Utils
import { isBN } from 'web3-utils'
import formatWeiToEth from 'utils/format-wei-to-eth'
import reportError from 'utils/report-error'

type GetActivatedBbkBalanceT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  state: StateT,
}) => void
export const getActivatedBbkBalance: GetActivatedBbkBalanceT = ({
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
            type: 'set-activated-balance/error',
            payload: "Couldn't fetch activated BBK balance",
          })
          reportError(
            new Error(
              `AccessToken.lockedBbkOf() didn't return value of type 'BN'. Actual value was: ${typeof rawBalance}`
            )
          )

          return
        }

        const newBalance = formatWeiToEth(rawBalance)

        // First execution of this effect, just set the initial balance directly
        if (!state.activated) {
          dispatch({
            type: 'set-activated-balance',
            payload: newBalance,
          })
        } else {
          // If there is a pre-existing balance, only dispatch 'set-balance' if the balance actually changed
          if (newBalance.valueAsNumber !== state.activated.valueAsNumber) {
            dispatch({
              type: 'set-activated-balance',
              payload: newBalance,
            })
          }
        }
      } catch (error) {
        dispatch({
          type: 'set-activated-balance/error',
          payload: error,
        })
        reportError(error)
      }
    }
  })()
}

export default getActivatedBbkBalance
