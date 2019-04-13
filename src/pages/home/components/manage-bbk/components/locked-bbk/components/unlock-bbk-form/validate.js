// @flow
export function validate(value: string): boolean {
  const ctx: {|
    hasBalance: boolean,
    maxValue: string,
    setError: (?string) => void,
  |} = this

  if (!ctx.hasBalance) {
    ctx.setError("You don't have any locked BBK tokens in your current account")

    return false
  }

  if (!value || value === '0') {
    ctx.setError(`Please enter a valid amount between 1 and ${ctx.maxValue}`)

    return false
  }

  if (parseInt(value) > parseInt(ctx.maxValue)) {
    ctx.setError(
      `You can't unlock more than the ${
        ctx.maxValue
      } locked BBK available in your current account`
    )

    return false
  }

  ctx.setError(null)

  return true
}

export default validate
