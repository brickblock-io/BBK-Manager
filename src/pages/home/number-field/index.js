// @flow
import React from 'react'
import NumberFormat from 'react-number-format'

// Types
import type { Node } from 'react'

type PropsT = {|
  inputRef: Node,
  onChange: ({ target: { value: string } }) => void,
|}

export const NumberField = (props: PropsT) => {
  /* eslint-disable unicorn/prevent-abbreviations */
  const { inputRef, onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      allowNegative={false}
      decimalScale={0}
      getInputRef={inputRef}
      onValueChange={({ value }: { value: string }) => {
        onChange({ target: { value } })
      }}
      thousandSeparator
    />
  )
}

NumberField.displayName = 'NumberField'

export default NumberField
