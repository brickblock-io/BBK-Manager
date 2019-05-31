// @flow
import type BN from 'bn.js'

function formatWeiToEthWithDecimals(
  value: BN
): {| value: string, valueAsNumber: number |} {
  const valueAsString = value.toString()
  const valueAsNumber = parseInt(valueAsString) / 1e18
  const valueAsLocalizedString = valueAsNumber.toLocaleString()

  return { value: valueAsLocalizedString, valueAsNumber }
}

export default formatWeiToEthWithDecimals
