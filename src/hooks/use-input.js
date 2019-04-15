// @flow
import { useEffect, useState } from 'react'

type UseInputFieldT = (
  initialValue?: string,
  options: {
    maxLength?: number,
    validate?: (value: string) => boolean,
  }
) => {|
  handleChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  value: string,
|}
export const useInputField: UseInputFieldT = (
  initialValue = '',
  options = { maxLength: null, validate: null }
) => {
  const [value, setValue] = useState(initialValue)
  const { maxLength, validate } = options

  const handleChange = event => {
    if (event && event.target && event.target.value) {
      if (!maxLength || event.target.value.length <= maxLength) {
        setValue(event.target.value)
      }

      if (validate && typeof validate === 'function') {
        validate(event.target.value)
      }
    } else {
      setValue(initialValue)
    }
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return { handleChange, value }
}

export default useInputField
