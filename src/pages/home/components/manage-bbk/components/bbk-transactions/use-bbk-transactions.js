// @flow
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import useWeb3 from '../../../../../../hooks/use-web3'

// Utils
import axios from 'axios'
import abiDecoder from 'abi-decoder'
import getEnvVar from '../../../../../../utils/get-env-var'

// Types
import type { AbstractContractT } from 'truffle-contract'

type UseBbkTransactionsT = ({
  AccessToken: ?AbstractContractT,
  BrickblockToken: ?AbstractContractT,
}) => $ReadOnlyArray<{ hash: string }>
export const useBbkTransactions: UseBbkTransactionsT = ({
  AccessToken,
  BrickblockToken,
}) => {
  const { currentAccount } = useWeb3(Web3)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const _useBbkTransactions = async () => {
      if (
        AccessToken &&
        BrickblockToken &&
        currentAccount &&
        currentAccount !== 'loading'
      ) {
        abiDecoder.addABI(BrickblockToken.abi)
        const response = await axios.get(
          `http://api.etherscan.io/api?module=account&action=txlist&address=${currentAccount}&startblock=0&endblock=99999999&sort=asc&apikey=${getEnvVar(
            'REACT_APP_ETHERSCAN_API_KEY'
          )}`
        )

        const allTransactions = response.data.result

        const rawBbkTransactions = allTransactions.filter(
          tx =>
            tx.from.toLowerCase() === currentAccount.toLowerCase() &&
            tx.to.toLowerCase() === BrickblockToken.address.toLowerCase()
        )

        const decodedBbkTransactions = rawBbkTransactions.map(tx => ({
          type: abiDecoder.decodeMethod(tx.input),
          ...tx,
        }))

        setTransactions(decodedBbkTransactions)
      }
    }

    _useBbkTransactions()
  }, [AccessToken, BrickblockToken, currentAccount])

  return transactions
}

export default useBbkTransactions
