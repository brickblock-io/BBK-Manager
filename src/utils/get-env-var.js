// @flow
type GetEnvironmentVariableT = (key: string) => string
const getEnvironmentVariable: GetEnvironmentVariableT = key => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`environment variable is missing: '${key}'`)
  }

  return value
}

export default getEnvironmentVariable
