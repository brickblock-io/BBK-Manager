// @flow
import React from 'react'

// Components
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
    <Layout>
      <Home />
    </Layout>
  </MuiThemeProvider>
)

App.displayName = 'App'

const exportedComponent: ComponentType<{}> = withStyles(styles)(App)

exportedComponent.displayName = 'AppHOC'

export default exportedComponent
