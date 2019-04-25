// @flow
import React, { Fragment } from 'react'

// Hooks
import useBbk from './use-bbk'

// Utils
import { useSnackbar } from 'notistack'
import { truncateHash } from '@brickblock/web3-utils'
import reportError from 'utils/report-error'

// Components
import ActivatedBbk from './activated-bbk'
import DeactivatedBbk from './deactivated-bbk'
import BbkTransactions from './bbk-transactions'

// Styles
import { withStyles } from '@material-ui/core'
import styles from './styles'

// Types
import type { ComponentType } from 'react'
import type { BBKContextT } from './use-bbk'
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
    activated: null,
    deactivated: null,
  },
  handleActivateTokens: () => {},
  handleActivateTokensCleanup: () => {},
  handleDeactivateTokens: () => {},
  handleDeactivateTokensCleanup: () => {},
  approveTokensError: null,
  approveTokensLoading: false,
  approveTokensTransactions: [],
  activateTokensError: null,
  activateTokensLoading: false,
  activateTokensTransactions: [],
  deactivateTokensError: null,
  deactivateTokensLoading: false,
  deactivateTokensTransactions: [],
})

export const ManageBbk = (props: PropsT) => {
  const {
    classes,
    contractRegistry,
    currentAccount,
    currentProvider,
    networkName,
  } = props

  const bbkContext = useBbk({
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
    activateTokensError,
    deactivateTokensError,
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

    // We don't need to log when users reject the transaction
    if (!approveTokensError.includes('signature was denied')) {
      reportError(
        new Error(
          `Couldn't approve AccessToken contract to activate BBK tokens for '${truncateHash(
            currentAccount
          )}': ${approveTokensError}`
        )
      )
    }
  }

  if (activateTokensError) {
    enqueueSnackbar(activateTokensError, { variant: 'error' })

    // We don't need to log when users reject the transaction
    if (!activateTokensError.includes('signature was denied')) {
      reportError(
        new Error(
          `Couldn't activate BBK tokens for '${truncateHash(
            currentAccount
          )}': ${activateTokensError}`
        )
      )
    }
  }

  if (deactivateTokensError) {
    enqueueSnackbar(deactivateTokensError, { variant: 'error' })

    // We don't need to log when users reject the transaction
    if (!deactivateTokensError.includes('signature was denied')) {
      reportError(
        new Error(
          `Couldn't deactivate BBK tokens for '${truncateHash(
            currentAccount
          )}': ${deactivateTokensError}`
        )
      )
    }
  }

  if (balances && balances.activated && balances.activated.error) {
    enqueueSnackbar(balances.activated.error, { variant: 'error' })
    reportError(
      new Error(
        `Couldn't fetch activated BBK balance for '${truncateHash(
          currentAccount
        )}': ${String(
          // $FlowIgnore because we're checking for existence of balances.activated.error in the above if-statement
          balances.activated.error
        )}`
      )
    )
  }

  if (balances && balances.deactivated && balances.deactivated.error) {
    enqueueSnackbar(balances.deactivated.error, {
      variant: 'error',
    })
    reportError(
      new Error(
        `Couldn't fetch deactivated BBK balance for '${truncateHash(
          currentAccount
        )}': ${String(
          // $FlowIgnore because we're checking for existence of balances.activated.error in the above if-statement
          balances.deactivated.error
        )}`
      )
    )
  }

  return (
    <Fragment>
      <BBKContext.Provider value={bbkContext}>
        <DeactivatedBbk classes={classes} />
        <ActivatedBbk classes={classes} />
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
