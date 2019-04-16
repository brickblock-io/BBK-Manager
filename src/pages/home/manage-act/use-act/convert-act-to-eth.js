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

type ConvertActToEthT = ({
  AccessToken: ?AbstractContractT,
  FeeManager: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const convertActToEth: ConvertActToEthT = ({
  AccessToken,
  FeeManager,
  amount,
  address,
  dispatch,
}) => {
  // eslint-disable-next-line no-extra-semi
  ;(async () => {
    if (AccessToken && FeeManager && amount) {
      const amountInWei = toBN(amount).mul(toBN(1e18))

      /*
       * Get current ACT balance and check that it's sufficient
       */
      let actBalance

      try {
        actBalance = await AccessToken.balanceOf.call(address)

        if (!actBalance || !isBN(actBalance)) {
          throw new Error('UNKNOWN_BALANCE')
        }

        if (amountInWei.gt(actBalance)) {
          throw new Error('INSUFFICIENT_ACT')
        }
      } catch (error) {
        if (error.message === 'INSUFFICIENT_ACT_BALANCE') {
          dispatch({
            type: 'convert-act-to-eth/error',
            payload: `Insufficient ACT balance. The maximum amount you can convert is ${
              // $FlowIgnore because we're checking that actBalance is not undefined above
              formatWeiValue(actBalance).value
            } ACT, because that's all that is available in this account.`,
          })
        }

        if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'convert-act-to-eth/error',
            payload: "Couldn't determine current ACT balance",
          })
        }

        return
      }

      /*
       * Convert ACT to ETH by calling claimFee() on the FeeManager contract
       */
      try {
        await FeeManager.claimFee
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'convert-act-to-eth/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'convert-act-to-eth/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message.includes(
            'MetaMask Tx Signature: User denied transaction signature'
          )
        ) {
          dispatch({
            type: 'convert-act-to-eth/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'convert-act-to-eth/error',
            payload:
              "Couldn't convert ACT to ETH. An unexpected error occurred 😕",
          })
        }

        return
      }
    }
  })()
}

export default convertActToEth
