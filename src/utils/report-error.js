// @flow
/* eslint-disable no-console */

import { captureException } from '@sentry/browser'
import getEnvVar from './get-env-var'

type ReportErrorT = (error: Error, message: ?string) => void
export const reportError: ReportErrorT = (error, message = '') => {
  message && typeof message === 'string'
    ? console.error(`❌ ${message}\n`, error)
    : console.error(error)

  const BBK_RUNTIME_ENVIRONMENT = getEnvVar('REACT_APP_BBK_ENV')

  if (
    BBK_RUNTIME_ENVIRONMENT !== 'development' &&
    BBK_RUNTIME_ENVIRONMENT !== 'review'
  ) {
    captureException(error)
  }
}

export default reportError
