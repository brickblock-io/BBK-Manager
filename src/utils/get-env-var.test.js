// @flow
import getEnvVar from './get-env-var'

describe('getEnvVar :: browser context', () => {
  it('should return a value from a set environment variable', () => {
    expect(getEnvVar('NODE_ENV')).toBe('test')
  })

  it('should throw an error when there is no value for an environment variable', () => {
    const varName = 'never-gonna-find-me'
    const error = new Error(`environment variable is missing: '${varName}'`)
    expect(() => getEnvVar(varName)).toThrow(error)
  })
})
