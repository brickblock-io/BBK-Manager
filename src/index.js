// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { version } from '../package.json'

// Components
import App from './app'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: version,
})

const render = async NextApp => {
  // $FlowIgnore because we know by convention that #root exists
  ReactDOM.render(<NextApp />, document.getElementById('root'))
}

render(App)

// $FlowIgnore because 'hot' is a webpack-specific property that isn't typed in the core types
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default
    render(NextApp)
  })
}
