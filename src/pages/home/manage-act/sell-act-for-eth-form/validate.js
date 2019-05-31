// @flow
import type { BalanceT } from 'types'

export function validate(value: string): boolean {
  const ctx: {|
    hasBalance: boolean,
    maxValue: BalanceT,
    setError: (?string) => void,
  |} = this

  if (!ctx.hasBalance) {
    ctx.setError("You don't have any ACT tokens in your current account")

    return false
  }

  if (!value || value === '0') {
    ctx.setError(
      `Please enter a valid amount. You can sell up to ${
        ctx.maxValue.value
      } ACT.`
    )

    return false
  }

  if (parseFloat(value) > ctx.maxValue.valueAsNumber) {
    ctx.setError(
      `You can't sell more than the ${
        ctx.maxValue.value
      } ACT available in your current account`
    )

    return false
  }

  ctx.setError(null)

  return true
}

export default validate
