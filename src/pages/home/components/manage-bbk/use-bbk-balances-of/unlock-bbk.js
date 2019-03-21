// @flow
import type { AbstractContractT } from 'truffle-contract'
import type { ActionsT } from './actions'

// Utils
import { toBN } from 'web3-utils'

// Config
import config from '../../../../../app.config.js'

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
      const amountInWei = toBN(amount)

      try {
        await AccessToken.unlockBBK.sendTransaction(amountInWei, {
          from: address,
          gas: config.DEFAULT_GAS,
        })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('User denied transaction signature')
        ) {
          dispatch({
            type: 'unlock-tokens/error',
            payload: 'TX_SIGNATURE_DENIED',
          })
        }
      }
    }
  }

  _unlockBbk()
}

export default unlockBbk
