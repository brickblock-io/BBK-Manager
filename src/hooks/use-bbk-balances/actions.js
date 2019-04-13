// @flow
import type { TransactionReceiptT } from 'types'

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

type ApproveTokensT = {|
  payload: string,
  type: 'approve-tokens',
|}

type ApproveTokensPendingT = {|
  payload: string,
  type: 'approve-tokens/pending',
|}

type ApproveTokensSuccessT = {|
  payload: TransactionReceiptT,
  type: 'approve-tokens/success',
|}

type ApproveTokensErrorT = {|
  payload: string,
  type: 'approve-tokens/error',
|}

type ApproveTokensCleanupT = {|
  type: 'approve-tokens/cleanup',
|}

type LockTokensT = {|
  payload: string,
  type: 'lock-tokens',
|}

type LockTokensPendingT = {|
  payload: string,
  type: 'lock-tokens/pending',
|}

type LockTokensSuccessT = {|
  payload: TransactionReceiptT,
  type: 'lock-tokens/success',
|}

type LockTokensCleanupT = {|
  type: 'lock-tokens/cleanup',
|}

type LockTokensErrorT = {|
  payload: string,
  type: 'lock-tokens/error',
|}

type UnlockTokensT = {|
  payload: string,
  type: 'unlock-tokens',
|}

type UnlockTokensPendingT = {|
  payload: string,
  type: 'unlock-tokens/pending',
|}

type UnlockTokensSuccessT = {|
  payload: TransactionReceiptT,
  type: 'unlock-tokens/success',
|}

type UnlockTokensErrorT = {|
  payload: string,
  type: 'unlock-tokens/error',
|}

type UnlockTokensCleanupT = {|
  type: 'unlock-tokens/cleanup',
|}

type ResetBalancesT = {|
  type: 'reset-balances',
|}

export type ActionsT =
  | SetUnlockedBalanceT
  | SetUnlockedBalanceErrorT
  | SetLockedBalanceT
  | SetLockedBalanceErrorT
  | ApproveTokensT
  | ApproveTokensPendingT
  | ApproveTokensSuccessT
  | ApproveTokensErrorT
  | ApproveTokensCleanupT
  | LockTokensT
  | LockTokensPendingT
  | LockTokensSuccessT
  | LockTokensCleanupT
  | LockTokensErrorT
  | UnlockTokensT
  | UnlockTokensPendingT
  | UnlockTokensSuccessT
  | UnlockTokensErrorT
  | UnlockTokensCleanupT
  | ResetBalancesT
