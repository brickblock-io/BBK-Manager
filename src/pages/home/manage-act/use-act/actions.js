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

type SellActForEthT = {|
  payload: string,
  type: 'sell-act-for-eth',
|}

type SellActForEthPendingT = {|
  payload: string,
  type: 'sell-act-for-eth/pending',
|}

type SellActForEthSuccessT = {|
  payload: TransactionReceiptT,
  type: 'sell-act-for-eth/success',
|}

type SellActForEthErrorT = {|
  payload: string,
  type: 'sell-act-for-eth/error',
|}

type SellActForEthCleanupT = {|
  type: 'sell-act-for-eth/cleanup',
|}

export type ActionsT =
  | SetBalanceT
  | SetBalanceErrorT
  | ResetBalanceT
  | SellActForEthT
  | SellActForEthPendingT
  | SellActForEthSuccessT
  | SellActForEthErrorT
  | SellActForEthCleanupT
