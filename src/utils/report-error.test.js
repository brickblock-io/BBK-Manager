// @flow
import * as Sentry from '@sentry/browser'
import getEnvVar from './get-env-var'
import reportError from './report-error'

// Mocks
jest.mock('./get-env-var')
jest.mock('@sentry/browser')

const setMockedEnvironment = environment =>
  getEnvVar.mockImplementation(() => environment)

const consoleSpy = jest.spyOn(console, 'error')
const sentrySpy = jest.spyOn(Sentry, 'captureException')

describe('reportError', () => {
  afterAll(() => {
    jest.restoreAllMocks() // clean .spyOn mocks
    jest.resetAllMocks() // clean .mock
  })

  beforeEach(() => {
    consoleSpy.mockReset()
    sentrySpy.mockReset()
  })

  describe('in staging and production environment', () => {
    it('should send the error to sentry', () => {
      setMockedEnvironment('staging')
      reportError(new Error('use-raven-in-staging'))
      expect(sentrySpy).toHaveBeenCalled()
      sentrySpy.mockReset()

      setMockedEnvironment('production')
      reportError(new Error('use-raven-in-prod'))
      expect(sentrySpy).toHaveBeenCalled()
    })
  })

  describe('in development, test, review and all other environments', () => {
    it('should log the error with console.error', () => {
      setMockedEnvironment('development')

      const error = new Error('use-console')
      const message = 'Sexy error'
      reportError(error, message)

      expect(consoleSpy).toHaveBeenCalledWith(`❌ ${message}\n`, error)
    })

    it('should NOT send the error to sentry', () => {
      const errorMessage = 'Sexy error'

      setMockedEnvironment('development')
      reportError(new Error('use-console'), errorMessage)
      expect(sentrySpy).not.toHaveBeenCalled()

      sentrySpy.mockReset()

      setMockedEnvironment('review')
      reportError(new Error('use-console'), errorMessage)
      expect(sentrySpy).not.toHaveBeenCalled()
    })
  })
})
