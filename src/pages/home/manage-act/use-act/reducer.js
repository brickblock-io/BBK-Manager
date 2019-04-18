// @flow
import { assoc, assocPath, dissoc, map, propEq, when } from 'ramda'

import type { ActionsT } from './actions'
import type { BalanceT, TransactionsT } from 'types'

export type StateT = {|
  balance: ?BalanceT,
  sellActForEth: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
|}

export const initialState: StateT = {
  balance: null,
  sellActForEth: {
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
     * Sell ACT for ETH
     */
    case 'sell-act-for-eth':
      return {
        ...state,
        sellActForEth: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.sellActForEth.transactions],
        },
      }

    case 'sell-act-for-eth/pending':
      return assocPath(
        ['sellActForEth', 'transactions'],
        [
          ...state.sellActForEth.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'sell-act-for-eth/success':
      return {
        ...state,
        sellActForEth: {
          amount: null,
          error: null,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.sellActForEth.transactions),
        },
      }

    case 'sell-act-for-eth/error':
      return {
        ...state,
        sellActForEth: {
          amount: null,
          error: action.payload,
          loading: false,

          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.sellActForEth.transactions),
        },
      }

    case 'sell-act-for-eth/cleanup':
      return assocPath(
        ['sellActForEth', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.sellActForEth.transactions
        ),
        state
      )

    default:
      return state
  }
}

export default reducer
