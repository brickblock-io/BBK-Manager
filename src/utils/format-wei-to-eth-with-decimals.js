// @flow
import type BN from 'bn.js'

function formatWeiToEthWithDecimals(
  value: BN
): {| value: string, valueAsNumber: number |} {
  const valueAsStringInWei = value.toString()
  // NOTE: The + prefix is to keep the variable type as "number" (because toFixed() returns a string)
  const valueAsNumber = +(parseInt(valueAsStringInWei) / 1e18).toFixed(6)
  const valueAsStringInEth = valueAsNumber.toString()

  return { value: valueAsStringInEth, valueAsNumber }
}

export default formatWeiToEthWithDecimals
