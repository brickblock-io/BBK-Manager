// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import { truncateHash } from '@brickblock/web3-utils'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type BN from 'bn.js'
import type { BalanceT } from 'types'

type GetActivatedBbkBalanceT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  previousBalance?: ?BalanceT,
}) => void
export const getActivatedBbkBalance: GetActivatedBbkBalanceT = ({
  AccessToken,
  address,
  dispatch,
  previousBalance = null,
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
            payload: `AccessToken.lockedBbkOf(${truncateHash(
              address
            )}) didn't return value of type 'BN'. Actual value was: ${String(
              rawBalance
            )}`,
          })

          return
        }

        const newBalance = formatWeiValue(rawBalance)

        if (!previousBalance || previousBalance.value !== newBalance.value) {
          dispatch({
            type: 'set-activated-balance',
            payload: newBalance,
          })
        }
      } catch (error) {
        dispatch({
          type: 'set-activated-balance/error',
          payload: error,
        })
      }
    }
  })()
}

export default getActivatedBbkBalance
