// @flow
/**
 * @jest-environment jsdom
 */

import getEnvironmentVariable from './get-env-var'

describe('getEnvironmentVariable :: browser context', () => {
  it('should return a value from a set environment variable', () => {
    expect(getEnvironmentVariable('NODE_ENV')).toBe('test')
  })

  it('should throw an error when there is no value for an environment variable', () => {
    const varName = 'never-gonna-find-me'
    const error = new Error(`environment variable is missing ${varName}`)
    expect(() => getEnvironmentVariable(varName)).toThrow(error)
  })
})
