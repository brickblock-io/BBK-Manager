// @flow
import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'

// Components
import { Button } from '@brickblock/styleguide'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

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
      return (
        <Grid container justify="center">
          <Grid item style={{ textAlign: 'center' }} xs={6}>
            <br />
            <Typography align="center" gutterBottom variant="h1">
              Something went wrong&nbsp;{' '}
              <span aria-label="Thinking face emoji" role="img">
                🤔
              </span>
            </Typography>
            <br />
            <Typography align="center" gutterBottom variant="body1">
              {
                "We're sorry. This should not have happened. Our tech team has been notified about this issue. If you want to help, we'd appreciate it if you could briefly describe in 1 or 2 sentences what you did before you saw this error."
              }
            </Typography>
            <br />
            <Button onClick={this.handleErrorReport}>Report Error</Button>
          </Grid>
        </Grid>
      )
    } else {
      return children
    }
  }
}

export default ErrorBoundary
