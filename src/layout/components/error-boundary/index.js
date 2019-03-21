// @flow
import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'

// Components
import { Button } from '@brickblock/styleguide'

// Types
import type { Node } from 'react'

type PropsT = {|
  children: Node,
|}

type StateT = {|
  hasError: boolean,
|}

class ErrorBoundary extends Component<PropsT, StateT> {
  state = {
    hasError: false,
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({ hasError: true })

    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  handleErrorReport() {
    Sentry.showReportDialog()
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return <Button onClick={this.handleErrorReport}>Report feedback</Button>
    } else {
      return children
    }
  }
}

export default ErrorBoundary
