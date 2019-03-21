// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from '../../../../../utils/format-wei-value'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type BN from 'bn.js'

type GetUnlockedBbkBalanceT = ({
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
}) => void
export const getUnlockedBbkBalance: GetUnlockedBbkBalanceT = ({
  BrickblockToken,
  address,
  dispatch,
}) => {
  // eslint-disable-next-line no-extra-semi
  const _getLockedBbkBalance = async () => {
    if (!BrickblockToken || !BrickblockToken.balanceOf || address == null) {
      dispatch({ type: 'reset-balances' })
    } else {
      try {
        const rawBalance: BN = await BrickblockToken.balanceOf.call(address)

        if (!isBN(rawBalance)) {
          dispatch({
            type: 'set-unlocked-balance/error',
            payload: `BrickblockToken.balanceOf(${address}) didn't return value of type 'BN'.\nActual value was: ${String(
              rawBalance
            )}.\nActual type was ${typeof rawBalance}`,
          })

          return
        }

        const formattedBalance = formatWeiValue(rawBalance)

        dispatch({
          type: 'set-unlocked-balance',
          payload: formattedBalance,
        })
      } catch (error) {
        dispatch({
          type: 'set-unlocked-balance/error',
          payload: `Couldn't determine unlocked BBK balance for address ${address}\n\n${error}`,
        })
      }
    }
  }

  _getLockedBbkBalance()
}

export default getUnlockedBbkBalance
