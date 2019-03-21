// @flow
import { useEffect, useState } from 'react'

type UseInputFieldT = (
  initialValue?: string
) => {|
  handleChange: (event: SyntheticInputEvent<HTMLInputElement>) => void,
  value: string,
|}
export const useInputField: UseInputFieldT = (initialValue = '') => {
  const [value, setValue] = useState(initialValue)

  const handleChange = event => {
    if (event && event.target && event.target.value) {
      setValue(event.target.value)
    } else {
      throw new Error(
        "useInputField::handleChange - 'event.target.value' was undefined"
      )
    }
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return { handleChange, value }
}

export default useInputField
