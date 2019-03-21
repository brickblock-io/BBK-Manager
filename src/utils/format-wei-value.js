// @flow
import { toBN } from 'web3-utils'
import { toWords } from 'number-to-words'

// types
import type BN from 'bn.js'

function formatWeiValue(value: BN): {| value: string, valueInWords: string |} {
  const valueInEth = value.div(toBN(1e18))
  const valueAsNumber = valueInEth.toNumber()
  const valueInWords = toWords(valueAsNumber)
  const valueAsLocalizedString = valueAsNumber.toLocaleString()

  return { value: valueAsLocalizedString, valueInWords }
}

export default formatWeiValue
