// @flow
import React, { Fragment } from 'react'

// Hooks
import useBbkBalances from 'hooks/use-bbk-balances'

// Utils
import { withSnackbar } from 'notistack'
import compose from '@ramda/compose'
import reportError from 'utils/report-error'

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
  networkName: ?string,
  web3Provider: ?mixed,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const ManageBbk = (props: PropsT) => {
  const {
    classes,
    contractRegistry,
    currentAccount,
    enqueueSnackbar,
    networkName,
    web3Provider,
  } = props

  const {
    AccessToken,
    BrickblockToken,
    balances,
    handleLockTokens,
    handleLockTokensCleanup,
    handleUnlockTokens,
    handleUnlockTokensCleanup,
    approveTokensError,
    approveTokensLoading,
    approveTokensTransactions,
    lockTokensError,
    lockTokensLoading,
    lockTokensTransactions,
    unlockTokensError,
    unlockTokensLoading,
    unlockTokensTransactions,
  } = useBbkBalances({
    address: currentAccount,
    contractRegistry,
    web3Provider,
  })

  if (!contractRegistry || !currentAccount || !networkName || !web3Provider) {
    return 'Loading...'
  }

  if (approveTokensError) {
    enqueueSnackbar(approveTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't approve AccessToken contract to lock BBK tokens for '${currentAccount}': ${approveTokensError}`
      )
    )
  }

  if (lockTokensError) {
    enqueueSnackbar(lockTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't lock BBK tokens for '${currentAccount}': ${lockTokensError}`
      )
    )
  }

  if (unlockTokensError) {
    enqueueSnackbar(unlockTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't unlock BBK tokens for '${currentAccount}': ${unlockTokensError}`
      )
    )
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
        approveTransactions={approveTokensTransactions}
        classes={classes}
        handleCleanup={handleLockTokensCleanup}
        handleLock={handleLockTokens}
        loading={approveTokensLoading || lockTokensLoading}
        lockTransactions={lockTokensTransactions}
        unlockedBalance={balances.unlocked}
      />
      <LockedBbk
        classes={classes}
        handleCleanup={handleUnlockTokensCleanup}
        handleUnlock={handleUnlockTokens}
        loading={unlockTokensLoading}
        lockedBalance={balances.locked}
        unlockTransactions={unlockTokensTransactions}
      />
      <BbkTransactions
        AccessToken={AccessToken}
        BrickblockToken={BrickblockToken}
        currentAccount={currentAccount}
        networkName={networkName}
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
