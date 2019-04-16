// @flow
import React from 'react'

// Utils
import { etherscanTxLink, truncateHash } from '@brickblock/web3-utils'

// Styles && Assets
import { withStyles } from '@material-ui/core'
import styles from './styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckIcon from '@material-ui/icons/CheckCircleOutlined'
import ErrorIcon from '@material-ui/icons/ErrorOutlined'

// Types
import type { ComponentType } from 'react'
import type { TransactionT } from 'types'

type OwnPropsT = {|
  networkName: ?string,
  transaction: ?TransactionT,
  transactionTitle: string,
|}

type InjectedPropsT = {|
  classes: { [string]: string },
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const InProgress = (props: PropsT) => {
  const { classes, transaction, transactionTitle, networkName } = props

  if (!networkName) {
    throw new Error('InProgress :: networkName prop was undefined')
  }

  return (
    <>
      {transactionTitle} Transaction:&nbsp;
      {transaction && (
        <a
          href={etherscanTxLink(transaction.hash, networkName)}
          rel="noopener noreferrer"
          target="_blank"
          title="View transaction on EtherScan"
        >
          {truncateHash(transaction.hash)}
        </a>
      )}
      {(!transaction || (transaction && transaction.status === 'pending')) && (
        <>
          <CircularProgress className={classes.spinner} size={15} />
          <br />
          <br />
          {
            "This can take between 15 seconds and a few minutes, please don't close this window."
          }
        </>
      )}
      {transaction && transaction.status === 'success' && (
        <CheckIcon className={classes.checkIcon} />
      )}
      {transaction && transaction.status === 'error' && (
        <ErrorIcon className={classes.errorIcon} />
      )}
    </>
  )
}

InProgress.displayName = 'InProgress'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  InProgress
)

exportedComponent.displayName = 'InProgressHOC'

export default exportedComponent
