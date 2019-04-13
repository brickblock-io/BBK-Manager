// @flow
import React from 'react'

// Utils
import {
  etherscanTxLink,
  etherscanAddressLink,
  truncateHash,
  weiToEth,
} from '@brickblock/web3'

// Types
import type { ERC20TransferTransactionT } from 'types'

type PropsT = {|
  currentAccount: string,
  networkName: string,
  tx: ERC20TransferTransactionT,
|}

export const TransactionRow = (props: PropsT) => {
  const { currentAccount, networkName, tx } = props

  const isIncomingTransfer = tx.to === currentAccount
  const counterparty = isIncomingTransfer ? tx.from : tx.to

  return (
    <tr>
      <td>
        <a
          href={etherscanTxLink(tx.hash, networkName)}
          rel="noopener noreferrer"
          target="_blank"
          title={`View Transaction ${truncateHash(tx.hash)} on EtherScan`}
        >
          {new Date(parseInt(tx.timeStamp, 10) * 1000).toLocaleDateString()}
        </a>
      </td>
      <td>{tx.type && tx.type.name}</td>
      <td>
        <a
          href={`${etherscanAddressLink(counterparty, networkName)}#tokentxns`}
          rel="noopener noreferrer"
          target="_blank"
          title={`View Address ${truncateHash(counterparty)} on EtherScan`}
        >
          {truncateHash(counterparty)}
        </a>
      </td>
      <td>
        {isIncomingTransfer
          ? `+${weiToEth(tx.value)} BBK`
          : `-${weiToEth(tx.value)} BBK`}
      </td>
    </tr>
  )
}

TransactionRow.displayName = 'TransactionRow'

export default TransactionRow
