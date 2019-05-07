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
  activateTx: ?TransactionT,
  approveTx: ?TransactionT,
  networkName: ?string,
|}

type InjectedPropsT = {|
  classes: { [string]: string },
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const InProgress = (props: PropsT) => {
  const { classes, approveTx, activateTx, networkName } = props

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
          <>
            <CircularProgress className={classes.spinner} size={15} />
            <br />
            <br />
            {
              "This can take between 15 seconds and a few minutes, please don't close this window."
            }
            <br />
            <br />
          </>
        )}
        {approveTx && approveTx.status === 'success' && (
          <CheckIcon className={classes.checkIcon} />
        )}
        {approveTx && approveTx.status === 'error' && (
          <ErrorIcon className={classes.errorIcon} />
        )}
      </li>
      <li>
        Activate Transaction:{' '}
        {activateTx && (
          <a
            href={etherscanTxLink(activateTx.hash, networkName)}
            rel="noopener noreferrer"
            target="_blank"
            title="View transaction on EtherScan"
          >
            {truncateHash(activateTx.hash)}
          </a>
        )}
        {/*
         * When the approval transaction has succeeded, but the activate transaction
         * hasn't been signed in MetaMask yet, we still want to show a spinner
         * behind the activate transaction to indicate that something is about to happen
         * here
         */
        ((!activateTx && approveTx && approveTx.status === 'success') ||
          (activateTx && activateTx.status === 'pending')) && (
          <>
            <CircularProgress className={classes.spinner} size={15} />
            <br />
            <br />
            {
              "This can take between 15 seconds and a few minutes, please don't close this window."
            }
            <br />
          </>
        )}
        {activateTx && activateTx.status === 'success' && (
          <CheckIcon className={classes.checkIcon} />
        )}
        {activateTx && activateTx.status === 'error' && (
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
