// @flow
import React from 'react'
import NumberFormat from 'react-number-format'

// Types
import type { Node } from 'react'

type PropsT = {|
  inputRef: Node,
  onChange: ({ target: { value: string } }) => void,
|}

export const NumberFieldWithDecimals = (props: PropsT) => {
  /* eslint-disable unicorn/prevent-abbreviations */
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      decimalScale={9}
      getInputRef={inputRef}
      onValueChange={({ value }: { value: string }) => {
        onChange({ target: { value } })
      }}
      thousandSeparator
    />
  )
}

NumberFieldWithDecimals.displayName = 'NumberFieldWithDecimals'

export default NumberFieldWithDecimals
