// @flow
import React, { Fragment } from 'react'

// Hooks
import useBbk from './use-bbk'

// Utils
import * as Sentry from '@sentry/browser'
import { useSnackbar } from 'notistack'
import { truncateHash } from '@brickblock/web3-utils'

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

  Sentry.configureScope(scope => {
    scope.setUser({ id: truncateHash(currentAccount) })
  })

  if (approveTokensError) {
    enqueueSnackbar(approveTokensError, { variant: 'error' })
  }

  if (activateTokensError) {
    enqueueSnackbar(activateTokensError, { variant: 'error' })
  }

  if (deactivateTokensError) {
    enqueueSnackbar(deactivateTokensError, { variant: 'error' })
  }

  if (balances && balances.activated && balances.activated.error) {
    enqueueSnackbar(balances.activated.error, { variant: 'error' })
  }

  if (balances && balances.deactivated && balances.deactivated.error) {
    enqueueSnackbar(balances.deactivated.error, {
      variant: 'error',
    })
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
