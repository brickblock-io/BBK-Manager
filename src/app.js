// @flow
import React from 'react'

// Providers
import { SnackbarProvider } from 'notistack'

// Components
import ErrorBoundary from './layout/components/error-boundary'
import Layout from './layout'
import Home from './pages/home'

// Theme & Styles & Assets
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { theme } from '@brickblock/styleguide'
import { withStyles } from '@material-ui/core'
import styles from './global-styles'

// Types
import type { ComponentType } from 'react'

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={7000}
      maxSnack={3}
    >
      <Layout>
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      </Layout>
    </SnackbarProvider>
  </MuiThemeProvider>
)

App.displayName = 'App'

const exportedComponent: ComponentType<{}> = withStyles(styles)(App)

exportedComponent.displayName = 'AppHOC'

export default exportedComponent
