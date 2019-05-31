// @flow
import type BN from 'bn.js'

function formatWeiToEthWithDecimals(
  value: BN
): {| value: string, valueAsNumber: number |} {
  const valueAsStringInWei = value.toString()
  const valueAsNumber = parseInt(valueAsStringInWei) / 1e18
  const valueAsStringInEth = valueAsNumber.toString()

  return { value: valueAsStringInEth, valueAsNumber }
}

export default formatWeiToEthWithDecimals
