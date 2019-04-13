// @flow
import React from 'react'

// Utils
import { etherscanTxLink, truncateHash } from '@brickblock/web3'

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
  approveTx: ?TransactionT,
  lockTx: ?TransactionT,
  networkName: ?string,
|}

type InjectedPropsT = {|
  classes: { [string]: string },
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const InProgress = (props: PropsT) => {
  const { classes, approveTx, lockTx, networkName } = props

  if (!networkName) {
    throw new Error('InProgress :: networkName prop was undefined')
  }

  return (
    <ol className={classes.list}>
      <li>
        Approval Transaction:{' '}
        {approveTx && (
          <a
            href={etherscanTxLink(approveTx.hash, networkName)}
            rel="noopener noreferrer"
            target="_blank"
            title="View transaction on EtherScan"
          >
            {truncateHash(approveTx.hash)}
          </a>
        )}
        {(!approveTx || (approveTx && approveTx.status === 'pending')) && (
          <CircularProgress className={classes.spinner} size={15} />
        )}
        {approveTx && approveTx.status === 'success' && (
          <CheckIcon className={classes.checkIcon} />
        )}
        {approveTx && approveTx.status === 'error' && (
          <ErrorIcon className={classes.errorIcon} />
        )}
      </li>
      <li>
        Lock Transaction:{' '}
        {lockTx && (
          <a
            href={etherscanTxLink(lockTx.hash, networkName)}
            rel="noopener noreferrer"
            target="_blank"
            title="View transaction on EtherScan"
          >
            {truncateHash(lockTx.hash)}
          </a>
        )}
        {/*
         * When the approval transaction has succeeded, but the lock transaction
         * hasn't been signed in MetaMask yet, we still want to show a spinner
         * behind the lock transaction to indicate that something is about to happen
         * here
         */
        ((!lockTx && approveTx && approveTx.status === 'success') ||
          (lockTx && lockTx.status === 'pending')) && (
          <CircularProgress className={classes.spinner} size={15} />
        )}
        {lockTx && lockTx.status === 'success' && (
          <CheckIcon className={classes.checkIcon} />
        )}
        {lockTx && lockTx.status === 'error' && (
          <ErrorIcon className={classes.errorIcon} />
        )}
      </li>
    </ol>
  )
}

InProgress.displayName = 'InProgress'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  InProgress
)

exportedComponent.displayName = 'InProgressHOC'

export default exportedComponent
