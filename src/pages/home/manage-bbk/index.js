// @flow
import React, { Fragment } from 'react'

// Hooks
import useBbkBalances from './use-bbk-balances'

// Utils
import { useSnackbar } from 'notistack'
import { truncateHash } from '@brickblock/web3-utils'
import reportError from 'utils/report-error'

// Components
import LockedBbk from './locked-bbk'
import UnlockedBbk from './unlocked-bbk'
import BbkTransactions from './bbk-transactions'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { BBKContextT } from './use-bbk-balances'
import type { AbstractContractT } from 'truffle-contract'
import type { CurrentProviderT } from 'types'

type InjectedPropsT = {|
  classes: { [string]: string },
|}

type OwnPropsT = {|
  contractRegistry: ?AbstractContractT,
  currentAccount: ?string,
  currentProvider: ?CurrentProviderT,
  networkName: ?string,
|}

type PropsT = {| ...InjectedPropsT, ...OwnPropsT |}

export const BBKContext = React.createContext<BBKContextT>({
  AccessToken: null,
  BrickblockToken: null,
  balances: {
    locked: null,
    unlocked: null,
  },
  handleLockTokens: () => {},
  handleLockTokensCleanup: () => {},
  handleUnlockTokens: () => {},
  handleUnlockTokensCleanup: () => {},
  approveTokensError: null,
  approveTokensLoading: false,
  approveTokensTransactions: [],
  lockTokensError: null,
  lockTokensLoading: false,
  lockTokensTransactions: [],
  unlockTokensError: null,
  unlockTokensLoading: false,
  unlockTokensTransactions: [],
})

export const ManageBbk = (props: PropsT) => {
  const {
    classes,
    contractRegistry,
    currentAccount,
    currentProvider,
    networkName,
  } = props

  const bbkContext = useBbkBalances({
    address: currentAccount,
    currentProvider,
    contractRegistry,
  })

  const { enqueueSnackbar } = useSnackbar()

  const {
    AccessToken,
    BrickblockToken,
    approveTokensError,
    balances,
    lockTokensError,
    unlockTokensError,
  } = bbkContext

  if (
    !contractRegistry ||
    !currentAccount ||
    !networkName ||
    !currentProvider
  ) {
    return 'Loading...'
  }

  if (approveTokensError) {
    enqueueSnackbar(approveTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't approve AccessToken contract to lock BBK tokens for '${truncateHash(
          currentAccount
        )}': ${approveTokensError}`
      )
    )
  }

  if (lockTokensError) {
    enqueueSnackbar(lockTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't lock BBK tokens for '${truncateHash(
          currentAccount
        )}': ${lockTokensError}`
      )
    )
  }

  if (unlockTokensError) {
    enqueueSnackbar(unlockTokensError, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't unlock BBK tokens for '${truncateHash(
          currentAccount
        )}': ${unlockTokensError}`
      )
    )
  }

  if (balances && balances.locked && balances.locked.error) {
    enqueueSnackbar(balances.locked.error, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't fetch locked BBK balance for '${truncateHash(
          currentAccount
        )}': ${String(
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
        `Couldn't fetch unlocked BBK balance for '${truncateHash(
          currentAccount
        )}': ${String(
          // $FlowIgnore because we're checking for existence of balances.locked.error in the above if-statement
          balances.unlocked.error
        )}`
      )
    )
  }

  return (
    <Fragment>
      <BBKContext.Provider value={bbkContext}>
        <UnlockedBbk classes={classes} />
        <LockedBbk classes={classes} />
        <BbkTransactions
          AccessToken={AccessToken}
          BrickblockToken={BrickblockToken}
          currentAccount={currentAccount}
          networkName={networkName}
        />
      </BBKContext.Provider>
    </Fragment>
  )
}

ManageBbk.displayName = 'ManageBbk'

const exportedComponent: ComponentType<OwnPropsT> = withStyles(styles)(
  ManageBbk
)

export default exportedComponent
