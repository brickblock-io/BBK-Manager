// @flow
import * as Sentry from '@sentry/browser'
import getEnvVar from './get-env-var'

type ReportErrorT = (error: Error, message: ?string) => void
export const reportError: ReportErrorT = (error, message = '') => {
  /* eslint-disable no-console */
  message && typeof message === 'string'
    ? console.error(`❌ ${message}\n`, error)
    : console.error(error)
  /* eslint-enable no-console */

  const BBK_ENV = getEnvVar('REACT_APP_BBK_ENV')

  if (BBK_ENV === 'staging' || BBK_ENV === 'production') {
    Sentry.captureException(error)
  }
}

export default reportError
