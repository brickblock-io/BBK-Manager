// @flow
import React from 'react'

// Components
import TransactionRow from '../table-row'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { ERC20TransferTransactionT } from 'types'

type OwnPropsT = {|
  currentAccount: string,
  networkName: string,
  transactions: $ReadOnlyArray<ERC20TransferTransactionT>,
|}

type InjectedPropsT = {| classes: { [string]: string } |}

type PropsT = {| ...OwnPropsT, ...InjectedPropsT |}

export const TransactionTable = (props: PropsT) => {
  const { classes, currentAccount, networkName, transactions } = props

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Type</th>
          <th>From/To</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <TransactionRow
            currentAccount={currentAccount}
            key={tx.hash}
            networkName={networkName}
            tx={tx}
          />
        ))}
      </tbody>
    </table>
  )
}

TransactionTable.displayName = 'TransactionTable'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  TransactionTable
)

exportedComponent.displayName = 'TransactionTableHOC'

export default exportedComponent
