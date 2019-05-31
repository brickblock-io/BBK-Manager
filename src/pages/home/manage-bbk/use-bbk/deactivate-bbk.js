// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'
import type { TransactionReceiptT } from 'types'

// Utils
import { isBN, toBN } from 'web3-utils'
import formatWeiToEth from 'utils/format-wei-to-eth'
import reportError from 'utils/report-error'

// Config
import config from 'app.config.js'
// TODO: replace values with proper error messages
const errors = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  UNKNOWN_BALANCE: 'UNKNOWN_BALANCE',
}

type DeactivateBbkT = ({
  AccessToken: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const deactivateBbk: DeactivateBbkT = ({
  AccessToken,
  amount,
  address,
  dispatch,
}) => {
  const _deactivateBbk = async () => {
    if (AccessToken && amount) {
      const amountInWei = toBN(amount).mul(toBN(1e18))

      let activatedBbkBalance

      /*
       * Get currently activated BBK balance and check that it's sufficient
       */
      try {
        activatedBbkBalance = await AccessToken.lockedBbkOf.call(address)

        if (!activatedBbkBalance || !isBN(activatedBbkBalance)) {
          throw new Error(errors.UNKNOWN_BALANCE)
        }

        if (amountInWei.gt(activatedBbkBalance)) {
          throw new Error(errors.INSUFFICIENT_BALANCE)
        }
      } catch (error) {
        if (error.message === errors.INSUFFICIENT_BALANCE) {
          dispatch({
            type: 'deactivate-tokens/error',
            payload: `Insufficient activated BBK balance. The maximum amount you can deactivate is ${
              // $FlowIgnore because we're checking that deactivatedBbkBalance is not undefined above
              formatWeiToEth(activatedBbkBalance).value
            } BBK, because that's all you have activated with this account.`,
          })
        } else if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'deactivate-tokens/error',
            payload: "Couldn't determine current activated BBK balance",
          })
        } else {
          reportError(error)
        }

        return
      }

      /*
       * Deactivate the entered amount of BBK tokens
       */
      try {
        await AccessToken.unlockBBK
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'deactivate-tokens/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'deactivate-tokens/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('User denied transaction signature')
        ) {
          dispatch({
            type: 'deactivate-tokens/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'deactivate-tokens/error',
            payload:
              "Couldn't deactivate BBK tokens. An unexpected error occurred 😕",
          })
          reportError(error)
        }

        return
      }
    }
  }

  _deactivateBbk()
}

export default deactivateBbk
