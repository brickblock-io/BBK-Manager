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

type ActivateBbkT = ({
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const activateBbk: ActivateBbkT = ({
  AccessToken,
  BrickblockToken,
  amount,
  address,
  dispatch,
}) => {
  const _activateBbk = async () => {
    if (AccessToken && BrickblockToken && amount) {
      const amountInWei = toBN(amount).mul(toBN(1e18))

      /*
       * Get current deactivated BBK balance and check that it's sufficient
       */
      let deactivatedBbkBalance

      try {
        deactivatedBbkBalance = await BrickblockToken.balanceOf.call(address)

        if (!deactivatedBbkBalance || !isBN(deactivatedBbkBalance)) {
          throw new Error('UNKNOWN_BALANCE')
        }

        if (amountInWei.gt(deactivatedBbkBalance)) {
          throw new Error('INSUFFICIENT_BBK_BALANCE')
        }
      } catch (error) {
        if (error.message === 'INSUFFICIENT_BBK_BALANCE') {
          dispatch({
            type: 'activate-tokens/error',
            payload: `Insufficient BBK balance. The maximum amount you activate activate is ${
              // $FlowIgnore because we're checking that deactivatedBbkBalance is not undefined above
              formatWeiValue(deactivatedBbkBalance).value
            } BBK, because that's all that is available in this account.`,
          })
        }

        if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'activate-tokens/error',
            payload: "Couldn't determine current deactivated BBK balance",
          })
        }

        return
      }

      /*
       * Approve AccessToken contract to activate BBK on behalf of the user
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
            type: 'activate-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'activate-tokens/error',
            payload:
              "Couldn't approve AccessToken contract to activate BBK on your behalf. An unexpected error occurred 😕",
          })
        }

        return
      }

      /*
       * Finally, activate the entered amount of BBK tokens
       */
      try {
        await AccessToken.lockBBK
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'activate-tokens/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'activate-tokens/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message.includes(
            'MetaMask Tx Signature: User denied transaction signature'
          )
        ) {
          dispatch({
            type: 'activate-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'activate-tokens/error',
            payload:
              "Couldn't activate BBK tokens. An unexpected error occurred 😕",
          })
        }

        return
      }
    }
  }

  _activateBbk()
}

export default activateBbk
