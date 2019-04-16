// @flow
import type { TransactionReceiptT } from 'types'

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

type ConvertActToEthT = {|
  payload: string,
  type: 'convert-act-to-eth',
|}

type ConvertActToEthPendingT = {|
  payload: string,
  type: 'convert-act-to-eth/pending',
|}

type ConvertActToEthSuccessT = {|
  payload: TransactionReceiptT,
  type: 'convert-act-to-eth/success',
|}

type ConvertActToEthErrorT = {|
  payload: string,
  type: 'convert-act-to-eth/error',
|}

type ConvertActToEthCleanupT = {|
  type: 'convert-act-to-eth/cleanup',
|}

export type ActionsT =
  | SetBalanceT
  | SetBalanceErrorT
  | ResetBalanceT
  | ConvertActToEthT
  | ConvertActToEthPendingT
  | ConvertActToEthSuccessT
  | ConvertActToEthErrorT
  | ConvertActToEthCleanupT
