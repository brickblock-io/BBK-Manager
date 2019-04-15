// @flow
import { useContext, useEffect, useState } from 'react'

// Data
import { ConfigContext } from '@brickblock/strong-config-browser'
import { Web3Context } from 'app'

// Utils
import axios from 'axios'
import abiDecoder from 'abi-decoder'

// Types
import type { AbstractContractT } from 'truffle-contract'
import type { ERC20TransferTransactionT } from 'types'

type UseBbkTransactionsT = ({
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
}) => {
  error: ?string,
  transactions: ?$ReadOnlyArray<ERC20TransferTransactionT>,
}
export const useBbkTransactions: UseBbkTransactionsT = ({
  AccessToken,
  BrickblockToken,
}) => {
  const { currentAccount, networkName } = useContext(Web3Context)
  const { config } = useContext(ConfigContext)
  const [transactions, setTransactions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const _useBbkTransactions = async () => {
      if (
        AccessToken &&
        BrickblockToken &&
        currentAccount &&
        currentAccount !== 'loading'
      ) {
        abiDecoder.addABI(BrickblockToken.abi)
        abiDecoder.addABI(AccessToken.abi)

        let etherscanBaseUrl

        switch (networkName) {
          case 'mainnet':
            etherscanBaseUrl = 'https://api.etherscan.io'
            break
          case 'ropsten':
            etherscanBaseUrl = 'https://api-ropsten.etherscan.io'
            break
          default:
            etherscanBaseUrl = 'https://api.etherscan.io'
        }

        const etherscanApiResponse = await axios.get(
          `${etherscanBaseUrl}/api?module=account&action=tokentx&address=${currentAccount}&startblock=0&endblock=999999999&sort=desc&apikey=${
            config.etherscan.apiKey
          }`
        )

        const allErc20Transactions = etherscanApiResponse.data.result

        const bbkTransfers = Array.isArray(allErc20Transactions)
          ? allErc20Transactions.filter(
              tx =>
                tx.contractAddress.toLowerCase() ===
                BrickblockToken.address.toLowerCase()
            )
          : null

        if (!bbkTransfers) {
          setError("Couldn't load transaction data from EtherScan")
        } else {
          const bbkTransfersForCurrentAccount = bbkTransfers.filter(
            tx =>
              tx.to.toLowerCase() === currentAccount.toLowerCase() ||
              tx.from.toLowerCase() === currentAccount.toLowerCase()
          )

          const bbkTransfersForCurrentAccountDecoded = bbkTransfersForCurrentAccount.map(
            tx => ({
              type: abiDecoder.decodeMethod(tx.input),
              ...tx,
            })
          )

          setError(null)
          setTransactions(bbkTransfersForCurrentAccountDecoded)
        }
      }
    }

    _useBbkTransactions()
  }, [
    AccessToken,
    BrickblockToken,
    config.etherscan.apiKey,
    currentAccount,
    networkName,
  ])

  return { error, transactions }
}

export default useBbkTransactions
