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
  unlockTx: ?TransactionT,
|}

type InjectedPropsT = {|
  classes: { [string]: string },
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const InProgress = (props: PropsT) => {
  const { classes, unlockTx, networkName } = props

  if (!networkName) {
    throw new Error('InProgress :: networkName prop was undefined')
  }

  return (
    <>
      Unlock Transaction:{' '}
      {unlockTx && (
        <a
          href={etherscanTxLink(unlockTx.hash, networkName)}
          rel="noopener noreferrer"
          target="_blank"
          title="View transaction on EtherScan"
        >
          {truncateHash(unlockTx.hash)}
        </a>
      )}
      {(!unlockTx || (unlockTx && unlockTx.status === 'pending')) && (
        <CircularProgress className={classes.spinner} size={15} />
      )}
      {unlockTx && unlockTx.status === 'success' && (
        <CheckIcon className={classes.checkIcon} />
      )}
      {unlockTx && unlockTx.status === 'error' && (
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
