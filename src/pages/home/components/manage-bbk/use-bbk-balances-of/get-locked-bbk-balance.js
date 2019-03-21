// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from '../../../../../utils/format-wei-value'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type BN from 'bn.js'

type GetLockedBbkBalanceT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
}) => void
export const getLockedBbkBalance: GetLockedBbkBalanceT = ({
  AccessToken,
  address,
  dispatch,
}) => {
  // eslint-disable-next-line no-extra-semi
  const _getLockedBbkBalance = async () => {
    if (!AccessToken || !AccessToken.lockedBbkOf || address == null) {
      dispatch({ type: 'reset-balances' })
    } else {
      try {
        const rawBalance: BN = await AccessToken.lockedBbkOf.call(address)

        if (!isBN(rawBalance)) {
          dispatch({
            type: 'set-locked-balance/error',
            payload: `AccessToken.lockedBbkOf(${address}) didn't return value of type 'BN'. Actual value was: ${String(
              rawBalance
            )}`,
          })

          return
        }

        const formattedBalance = formatWeiValue(rawBalance)

        dispatch({
          type: 'set-locked-balance',
          payload: formattedBalance,
        })
      } catch (error) {
        dispatch({
          type: 'set-locked-balance/error',
          payload: `Couldn't determine locked BBK balance for address ${address}\n\n${error}`,
        })
      }
    }
  }

  _getLockedBbkBalance()
}

export default getLockedBbkBalance
