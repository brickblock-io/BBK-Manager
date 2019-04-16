// @flow
import { assoc, assocPath, dissoc, map, propEq, when } from 'ramda'

import type { ActionsT } from './actions'
import type { BalanceT, TransactionsT } from 'types'

export type StateT = {|
  balance: ?BalanceT,
  convertActToEth: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
|}

export const initialState: StateT = {
  balance: null,
  convertActToEth: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
}

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('ACT Reducer', action) // eslint-disable-line no-console
  }

  switch (action.type) {
    case 'reset-balance':
      return { ...state, balance: initialState.balance }

    case 'set-balance':
      return { ...state, balance: { error: null, ...action.payload } }

    case 'set-balance/error':
      return { ...state, balance: { ...state.balance, error: action.payload } }

    /*
     * Convert ACT to ETH
     */
    case 'convert-act-to-eth':
      return {
        ...state,
        convertActToEth: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.convertActToEth.transactions],
        },
      }

    case 'convert-act-to-eth/pending':
      return assocPath(
        ['convertActToEth', 'transactions'],
        [
          ...state.convertActToEth.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'convert-act-to-eth/success':
      return {
        ...state,
        convertActToEth: {
          amount: null,
          error: null,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.convertActToEth.transactions),
        },
      }

    case 'convert-act-to-eth/error':
      return {
        ...state,
        convertActToEth: {
          amount: null,
          error: action.payload,
          loading: false,

          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.convertActToEth.transactions),
        },
      }

    case 'convert-act-to-eth/cleanup':
      return assocPath(
        ['convertActToEth', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.convertActToEth.transactions
        ),
        state
      )

    default:
      return state
  }
}

export default reducer
