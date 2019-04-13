// @flow
import { useEffect, useState } from 'react'

type UseInputFieldT = (
  initialValue?: string,
  options: {
    validate?: (value: string) => boolean,
  }
) => {|
  handleChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  value: string,
|}
export const useInputField: UseInputFieldT = (
  initialValue = '',
  options = { validate: null }
) => {
  const [value, setValue] = useState(initialValue)
  const { validate } = options

  const handleChange = event => {
    if (event && event.target && event.target.value) {
      setValue(event.target.value)

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
