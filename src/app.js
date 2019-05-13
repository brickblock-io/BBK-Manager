// @flow
import React from 'react'

// Providers
import { SnackbarProvider } from 'notistack'
import { useWeb3 } from '@brickblock/web3-utils'

// Components
import { theme } from '@brickblock/styleguide'
import ErrorBoundary from './layout/components/error-boundary'
import Layout from './layout'
import Home from './pages/home'
import DismissSnackbarButton from './components/dismiss-snackbar-button'

// Theme & Styles & Assets
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core'
import styles from './global-styles'

// Types
import type { ComponentType } from 'react'

type Web3ContextT = $Call<typeof useWeb3>

export const Web3Context = React.createContext<Web3ContextT>({
  currentAccount: 'loading',
  currentProvider: 'loading',
  isUnlocked: 'loading',
  networkId: 'loading',
  networkName: 'loading',
  providerName: 'loading',
  error: null,
})

const App = () => {
  const {
    currentAccount,
    currentProvider,
    isUnlocked,
    networkId,
    networkName,
    providerName,
    error,
  } = useWeb3()

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        action={key => <DismissSnackbarButton id={key} />}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={7000}
        maxSnack={3}
      >
        <Web3Context.Provider
          value={{
            currentAccount,
            currentProvider,
            isUnlocked,
            networkId,
            networkName,
            providerName,
            error,
          }}
        >
          <Layout>
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          </Layout>
        </Web3Context.Provider>
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}

App.displayName = 'App'

const exportedComponent: ComponentType<{}> = withStyles(styles)(App)

exportedComponent.displayName = 'AppHOC'

export default exportedComponent
