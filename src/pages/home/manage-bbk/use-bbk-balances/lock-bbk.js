// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'

// Utils
import { isBN, toBN } from 'web3-utils'
import formatWeiValue from 'utils/format-wei-value'

// Config
import config from 'app.config.js'

// Types
import type { TransactionReceiptT } from 'types'

type LockBbkT = ({
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const lockBbk: LockBbkT = ({
  AccessToken,
  BrickblockToken,
  amount,
  address,
  dispatch,
}) => {
  const _lockBbk = async () => {
    if (AccessToken && BrickblockToken && amount) {
      const amountInWei = toBN(amount).mul(toBN(1e18))

      /*
       * Get current unlocked BBK balance and check that it's sufficient
       */
      let unlockedBbkBalance

      try {
        unlockedBbkBalance = await BrickblockToken.balanceOf.call(address)

        if (!unlockedBbkBalance || !isBN(unlockedBbkBalance)) {
          throw new Error('UNKNOWN_BALANCE')
        }

        if (amountInWei.gt(unlockedBbkBalance)) {
          throw new Error('INSUFFICIENT_BBK_BALANCE')
        }
      } catch (error) {
        if (error.message === 'INSUFFICIENT_BBK_BALANCE') {
          dispatch({
            type: 'lock-tokens/error',
            payload: `Insufficient BBK balance. The maximum amount you can lock is ${
              // $FlowIgnore because we're checking that unlockedBbkBalance is not undefined above
              formatWeiValue(unlockedBbkBalance).value
            } BBK, because that's all that is available in this account.`,
          })
        }

        if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'lock-tokens/error',
            payload: "Couldn't determine current unlocked BBK balance",
          })
        }

        return
      }

      /*
       * Approve AccessToken contract to lock BBK on behalf of the user
       */
      try {
        await BrickblockToken.approve
          .sendTransaction(AccessToken.address, amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'approve-tokens/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'approve-tokens/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message.includes(
            'MetaMask Tx Signature: User denied transaction signature'
          )
        ) {
          dispatch({
            type: 'lock-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'lock-tokens/error',
            payload:
              "Couldn't approve AccessToken contract to lock BBK on your behalf. An unexpected error occurred 😕",
          })
        }

        return
      }

      /*
       * Finally, lock the entered amount of BBK tokens
       */
      try {
        await AccessToken.lockBBK
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'lock-tokens/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'lock-tokens/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message.includes(
            'MetaMask Tx Signature: User denied transaction signature'
          )
        ) {
          dispatch({
            type: 'lock-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'lock-tokens/error',
            payload:
              "Couldn't lock BBK tokens. An unexpected error occurred 😕",
          })
        }

        return
      }
    }
  }

  _lockBbk()
}

export default lockBbk
