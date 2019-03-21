// @flow
import React, { Fragment } from 'react'

// Hooks
import useBbkBalancesOf from './use-bbk-balances-of'

// Utils
import { withSnackbar } from 'notistack'
import compose from '@ramda/compose'
import reportError from '../../../../utils/report-error'

// Components
import LockedBbk from './components/locked-bbk'
import UnlockedBbk from './components/unlocked-bbk'
import BbkTransactions from './components/bbk-transactions'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { AbstractContractT } from 'truffle-contract'
import type { EnqueueSnackbarT } from 'notistack'

type InjectedPropsT = {|
  classes: { [string]: string },
  enqueueSnackbar: EnqueueSnackbarT,
|}

type OwnPropsT = {|
  contractRegistry: ?AbstractContractT,
  currentAccount: ?string,
  web3Provider: ?mixed,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const ManageBbk = (props: PropsT) => {
  const {
    classes,
    contractRegistry,
    currentAccount,
    enqueueSnackbar,
    web3Provider,
  } = props

  const {
    AccessToken,
    BrickblockToken,
    balances,
    handleLockTokens,
    handleUnlockTokens,
    lockTokensError,
    lockTokensLoading,
    unlockTokensLoading,
  } = useBbkBalancesOf({
    address: currentAccount,
    contractRegistry,
    web3Provider,
  })

  if (!contractRegistry || !currentAccount || !web3Provider) {
    return 'Loading...'
  }

  if (lockTokensError) {
    enqueueSnackbar(lockTokensError, { variant: 'error' })
  }

  if (balances && balances.locked && balances.locked.error) {
    enqueueSnackbar(balances.locked.error, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't fetch locked BBK balance for '${currentAccount}': ${String(
          // $FlowIgnore because we're checking for existence of balances.locked.error in the above if-statement
          balances.locked.error
        )}`
      )
    )
  }

  if (balances && balances.unlocked && balances.unlocked.error) {
    enqueueSnackbar(balances.unlocked.error, {
      variant: 'error',
    })
    reportError(
      new Error(
        `Couldn't fetch unlocked BBK balance for '${currentAccount}': ${String(
          // $FlowIgnore because we're checking for existence of balances.locked.error in the above if-statement
          balances.unlocked.error
        )}`
      )
    )
  }

  return (
    <Fragment>
      <UnlockedBbk
        classes={classes}
        handleLock={handleLockTokens}
        lockTokensLoading={lockTokensLoading}
        unlockedBalance={balances.unlocked}
      />
      <LockedBbk
        classes={classes}
        handleUnlock={handleUnlockTokens}
        lockedBalance={balances.locked}
        unlockTokensLoading={unlockTokensLoading}
      />
      <BbkTransactions
        AccessToken={AccessToken}
        BrickblockToken={BrickblockToken}
      />
    </Fragment>
  )
}

ManageBbk.displayName = 'ManageBbk'

const exportedComponent: ComponentType<OwnPropsT> = compose(
  withStyles(styles),
  withSnackbar
)(ManageBbk)

export default exportedComponent
