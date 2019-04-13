// @flow
import React from 'react'
import ReactDOM from 'react-dom'

// Config
import { ConfigContext, loadConfig } from '@brickblock/strong-config-browser'
import getEnvVar from './utils/get-env-var'

// Error Reporting
import * as Sentry from '@sentry/browser'
import { version } from '../package.json'

// Components
import App from './app'

const setupSentry = async () => {
  const config = await loadConfig()

  if (
    config.runtimeEnvironment === 'staging' ||
    config.runtimeEnvironment === 'production'
  ) {
    let release: string

    // On staging, we use the latest git commit sha as the release name in sentry
    if (config.runtimeEnvironment === 'staging') {
      const gitShaShort = getEnvVar('REACT_APP_COMMIT_SHA')
      release = gitShaShort
    }

    // On production, we use the latest tag as the release name in sentry
    if (config.runtimeEnvironment === 'production') {
      release = version
    }

    Sentry.init({
      dsn: config.sentry.dsn,
      // NOTE: Using the 'release' param is essential for getting sourcemaps support in Sentry
      release: release,
    })
  }
}

const render = async NextApp => {
  const config = await loadConfig()

  ReactDOM.render(
    <ConfigContext.Provider value={{ config }}>
      <NextApp />
    </ConfigContext.Provider>,
    // $FlowIgnore because we know by convention that #root exists
    document.getElementById('root')
  )
}

setupSentry()
render(App)

// $FlowIgnore because 'hot' is a webpack-specific property that isn't typed in the core types
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default
    render(NextApp)
  })
}
