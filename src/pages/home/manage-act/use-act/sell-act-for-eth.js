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

type SellActForEthT = ({
  AccessToken: ?AbstractContractT,
  FeeManager: ?AbstractContractT,
  address: ?string,
  amount: ?string,
  dispatch: ActionsT => void,
}) => void

export const sellActForEth: SellActForEthT = ({
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
            type: 'sell-act-for-eth/error',
            payload: `Insufficient ACT balance. The maximum amount you can sell is ${
              // $FlowIgnore because we're checking that actBalance is not undefined above
              formatWeiValue(actBalance).value
            } ACT, because that's all that is available in this account.`,
          })
        }

        if (error.message === 'UNKNOWN_BALANCE') {
          dispatch({
            type: 'sell-act-for-eth/error',
            payload: "Couldn't determine current ACT balance",
          })
        }

        return
      }

      /*
       * Sell ACT for ETH by calling claimFee() on the FeeManager contract
       */
      try {
        await FeeManager.claimFee
          .sendTransaction(amountInWei, {
            from: address,
            gas: config.DEFAULT_GAS,
          })
          .on('transactionHash', (hash: string) => {
            dispatch({ type: 'sell-act-for-eth/pending', payload: hash })
          })
          .on('receipt', (receipt: TransactionReceiptT) => {
            dispatch({ type: 'sell-act-for-eth/success', payload: receipt })
          })
      } catch (error) {
        if (
          error.message.includes(
            'MetaMask Tx Signature: User denied transaction signature'
          )
        ) {
          dispatch({
            type: 'sell-act-for-eth/error',
            payload: 'Transaction signature was denied in MetaMask',
          })
        } else {
          dispatch({
            type: 'sell-act-for-eth/error',
            payload:
              "Couldn't sell ACT for ETH. An unexpected error occurred 😕",
          })
        }

        return
      }
    }
  })()
}

export default sellActForEth
