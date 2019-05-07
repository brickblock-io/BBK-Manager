// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { StateT } from './reducer'
import type BN from 'bn.js'

// Utils
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import reportError from 'utils/report-error'

type GetDeactivatedBbkBalanceT = ({
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  state: StateT,
}) => void
export const getDeactivatedBbkBalance: GetDeactivatedBbkBalanceT = ({
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
            type: 'set-deactivated-balance/error',
            payload: "Couldn't fetch deactivated BBK balance",
          })
          reportError(
            new Error(
              `BrickblockToken.balanceOf() didn't return value of type 'BN'. Actual type was ${typeof rawBalance}`
            )
          )

          return
        }

        const newBalance = formatWeiValue(rawBalance)

        // First execution of this effect, just set the initial balance directly
        if (!state.deactivated) {
          dispatch({
            type: 'set-deactivated-balance',
            payload: newBalance,
          })
        } else {
          // If there is a pre-existing balance, only dispatch 'set-balance' if the balance actually changed
          if (newBalance.valueAsNumber !== state.deactivated.valueAsNumber) {
            dispatch({
              type: 'set-deactivated-balance',
              payload: newBalance,
            })
          }
        }
      } catch (error) {
        dispatch({
          type: 'set-deactivated-balance/error',
          payload: error,
        })
        reportError(error)
      }
    }
  })()
}

export default getDeactivatedBbkBalance
