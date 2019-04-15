// @flow
import { isBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'
import { truncateHash } from '@brickblock/web3-utils'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type BN from 'bn.js'
import type { BalanceT } from 'types'

type GetUnlockedBbkBalanceT = ({
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  dispatch: ActionsT => void,
  previousBalance?: ?BalanceT,
}) => void
export const getUnlockedBbkBalance: GetUnlockedBbkBalanceT = ({
  BrickblockToken,
  address,
  dispatch,
  previousBalance = null,
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
            payload: `BrickblockToken.balanceOf(${truncateHash(
              address
            )}) didn't return value of type 'BN'.\nActual value was: ${String(
              rawBalance
            )}.\nActual type was ${typeof rawBalance}`,
          })

          return
        }

        const newBalance = formatWeiValue(rawBalance)

        if (!previousBalance || previousBalance.value !== newBalance.value) {
          dispatch({
            type: 'set-unlocked-balance',
            payload: newBalance,
          })
        }
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
