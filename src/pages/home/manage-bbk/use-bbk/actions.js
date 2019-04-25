// @flow
import type { TransactionReceiptT } from 'types'

type SetDeactivatedBalanceT = {|
  payload: {|
    value: string,
    valueAsNumber: number,
    valueInWords: string,
  |},
  type: 'set-deactivated-balance',
|}

type SetDeactivatedBalanceErrorT = {|
  payload: string,
  type: 'set-deactivated-balance/error',
|}

type SetActivatedBalanceT = {|
  payload: {|
    value: string,
    valueAsNumber: number,
    valueInWords: string,
  |},
  type: 'set-activated-balance',
|}

type SetActivatedBalanceErrorT = {|
  payload: string,
  type: 'set-activated-balance/error',
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

type ActivateTokensT = {|
  payload: string,
  type: 'activate-tokens',
|}

type ActivateTokensPendingT = {|
  payload: string,
  type: 'activate-tokens/pending',
|}

type ActivateTokensSuccessT = {|
  payload: TransactionReceiptT,
  type: 'activate-tokens/success',
|}

type ActivateTokensCleanupT = {|
  type: 'activate-tokens/cleanup',
|}

type ActivateTokensErrorT = {|
  payload: string,
  type: 'activate-tokens/error',
|}

type DeactivateTokensT = {|
  payload: string,
  type: 'deactivate-tokens',
|}

type DeactivateTokensPendingT = {|
  payload: string,
  type: 'deactivate-tokens/pending',
|}

type DeactivateTokensSuccessT = {|
  payload: TransactionReceiptT,
  type: 'deactivate-tokens/success',
|}

type DeactivateTokensErrorT = {|
  payload: string,
  type: 'deactivate-tokens/error',
|}

type DeactivateTokensCleanupT = {|
  type: 'deactivate-tokens/cleanup',
|}

type ResetBalancesT = {|
  type: 'reset-balances',
|}

export type ActionsT =
  | SetDeactivatedBalanceT
  | SetDeactivatedBalanceErrorT
  | SetActivatedBalanceT
  | SetActivatedBalanceErrorT
  | ApproveTokensT
  | ApproveTokensPendingT
  | ApproveTokensSuccessT
  | ApproveTokensErrorT
  | ApproveTokensCleanupT
  | ActivateTokensT
  | ActivateTokensPendingT
  | ActivateTokensSuccessT
  | ActivateTokensCleanupT
  | ActivateTokensErrorT
  | DeactivateTokensT
  | DeactivateTokensPendingT
  | DeactivateTokensSuccessT
  | DeactivateTokensErrorT
  | DeactivateTokensCleanupT
  | ResetBalancesT
