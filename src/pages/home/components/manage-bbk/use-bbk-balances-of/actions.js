// @flow
type SetUnlockedBalanceT = {|
  payload: {|
    value: string,
    valueInWords: string,
  |},
  type: 'set-unlocked-balance',
|}

type SetUnlockedBalanceErrorT = {|
  payload: string,
  type: 'set-unlocked-balance/error',
|}

type SetLockedBalanceT = {|
  payload: {|
    value: string,
    valueInWords: string,
  |},
  type: 'set-locked-balance',
|}

type SetLockedBalanceErrorT = {|
  payload: string,
  type: 'set-locked-balance/error',
|}

type LockTokensT = {|
  payload: string,
  type: 'lock-tokens',
|}

type LockTokensSuccessT = {|
  type: 'lock-tokens/success',
|}

type LockTokensErrorT = {|
  payload: string,
  type: 'lock-tokens/error',
|}

type UnlockTokensT = {|
  payload: string,
  type: 'unlock-tokens',
|}

type UnlockTokensSuccessT = {|
  type: 'unlock-tokens/success',
|}

type UnlockTokensErrorT = {|
  payload: string,
  type: 'unlock-tokens/error',
|}

type ResetBalancesT = {|
  type: 'reset-balances',
|}

export type ActionsT =
  | SetUnlockedBalanceT
  | SetUnlockedBalanceErrorT
  | SetLockedBalanceT
  | SetLockedBalanceErrorT
  | LockTokensT
  | LockTokensSuccessT
  | LockTokensErrorT
  | UnlockTokensT
  | UnlockTokensSuccessT
  | UnlockTokensErrorT
  | ResetBalancesT
