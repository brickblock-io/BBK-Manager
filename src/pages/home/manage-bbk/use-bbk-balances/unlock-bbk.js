// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { TransactionReceiptT } from 'types'

// Utils
import { isBN, toBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'

// Config
import config from 'app.config.js'

type UnlockBbkT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const unlockBbk: UnlockBbkT = ({
  AccessToken,
  amount,
  address,
  dispatch,
}) => {
  const _unlockBbk = async () => {
    if (AccessToken && amount) {
      const amountInWei = toBN(amount).mul(toBN(1e18))

      /*
       * Get currently locked BBK balance and check that it's sufficient
       */
      let lockedBbkBalance

      try {
        lockedBbkBalance = await AccessToken.lockedBbkOf.call(address)

        if (!lockedBbkBalance || !isBN(lockedBbkBalance)) {
          throw new Error('UNKNOWN_BALANCE')
        }

        if (amountInWei.gt(lockedBbkBalance)) {
          throw new Error('INSUFFICIENT_BBK_BALANCE')
        }
      } catch (error) {
        if (error.message === 'INSUFFICIENT_BBK_BALANCE') {
          dispatch({
            type: 'unlock-tokens/error',
            payload: `Insufficient locked BBK balance. The maximum amount you can unlock is ${
              // $FlowIgnore because we're checking that unlockedBbkBalance is not undefined above
              formatWeiValue(lockedBbkBalance).value
            } BBK, because that's all you have locked with this account.`,
          })
        }

        if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'unlock-tokens/error',
            payload: "Couldn't determine current locked BBK balance",
          })
        }

        return
      }

      /*
       * Unlock the entered amount of BBK tokens
       */
      try {
        await AccessToken.unlockBBK
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'unlock-tokens/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'unlock-tokens/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('User denied transaction signature')
        ) {
          dispatch({
            type: 'unlock-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'unlock-tokens/error',
            payload:
              "Couldn't unlock BBK tokens. An unexpected error occurred 😕",
          })
        }

        return
      }
    }
  }

  _unlockBbk()
}

export default unlockBbk
