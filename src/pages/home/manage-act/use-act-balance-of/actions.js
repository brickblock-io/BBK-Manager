// @flow
type SetBalanceT = {|
  payload: {|
    value: string,
    valueAsNumber: number,
    valueInWords: string,
  |},
  type: 'set-balance',
|}

type SetBalanceErrorT = {|
  payload: string,
  type: 'set-balance/error',
|}

type ResetBalanceT = {|
  type: 'reset-balance',
|}

export type ActionsT = SetBalanceT | SetBalanceErrorT | ResetBalanceT
