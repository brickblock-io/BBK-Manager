// @flow
import { toBN } from 'web3-utils'
import { toWords } from 'number-to-words'

// types
import type BN from 'bn.js'

function formatWeiToEth(
  value: BN
): {| value: string, valueAsNumber: number, valueInWords: string |} {
  const valueInEth = value.div(toBN(1e18))
  const valueAsNumber = valueInEth.toNumber()
  const valueInWords = toWords(valueAsNumber)
  const valueAsLocalizedString = valueAsNumber.toLocaleString()

  return { value: valueAsLocalizedString, valueAsNumber, valueInWords }
}

export function formatWeiToEthWithDecimals(
  value: BN
): {| value: string, valueAsNumber: number, valueInWords: string |} {
  const valueAsString = value.toString()
  const valueAsNumber = parseInt(valueAsString) / 1e18
  const valueInWords = toWords(valueAsNumber)
  const valueAsLocalizedString = valueAsNumber.toLocaleString()

  return { value: valueAsLocalizedString, valueAsNumber, valueInWords }
}

export default formatWeiToEth
