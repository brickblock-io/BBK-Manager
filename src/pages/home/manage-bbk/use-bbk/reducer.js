// @flow
import { assoc, assocPath, dissoc, map, propEq, when } from 'ramda'

// Types
import type { ActionsT } from './actions'
import type { BalanceT, TransactionsT } from 'types'

export type StateT = {|
  activateTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  activated: ?BalanceT,
  approveTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  deactivateTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  deactivated: ?BalanceT,
|}

export const initialState: StateT = {
  activated: null,
  deactivated: null,
  approveTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
  activateTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
  deactivateTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
}

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('BBK Reducer', action) // eslint-disable-line no-console
  }

  switch (action.type) {
    /*
     * Balances
     */
    case 'reset-balances':
      return initialState

    case 'set-activated-balance':
      return { ...state, activated: { error: null, ...action.payload } }

    case 'set-activated-balance/error':
      return {
        ...state,
        activated: { ...state.activated, error: action.payload },
      }

    case 'set-deactivated-balance':
      return { ...state, deactivated: { error: null, ...action.payload } }

    case 'set-deactivated-balance/error':
      return {
        ...state,
        deactivated: { ...state.deactivated, error: action.payload },
      }

    /*
     * Approve tokens
     */
    case 'approve-tokens':
      return {
        ...state,
        approveTokens: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.approveTokens.transactions],
        },
      }

    case 'approve-tokens/pending':
      return assocPath(
        ['approveTokens', 'transactions'],
        [
          ...state.approveTokens.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'approve-tokens/success':
      return {
        ...state,
        approveTokens: {
          amount: null,
          error: null,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.approveTokens.transactions),
        },
      }

    case 'approve-tokens/error':
      return {
        ...state,
        approveTokens: {
          amount: null,
          error: action.payload,
          loading: false,

          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.approveTokens.transactions),
        },
      }

    case 'approve-tokens/cleanup':
      return assocPath(
        ['approveTokens', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.approveTokens.transactions
        ),
        state
      )

    /*
     * Activate tokens
     */
    case 'activate-tokens':
      return {
        ...state,
        activateTokens: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.activateTokens.transactions],
        },
      }

    case 'activate-tokens/pending':
      return assocPath(
        ['activateTokens', 'transactions'],
        [
          ...state.activateTokens.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'activate-tokens/success':
      return {
        ...state,
        activateTokens: {
          amount: null,
          error: null,
          loading: false,

          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.activateTokens.transactions),
        },
      }

    case 'activate-tokens/cleanup':
      return assocPath(
        ['activateTokens', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.activateTokens.transactions
        ),
        state
      )

    case 'activate-tokens/error':
      return {
        ...state,
        activateTokens: {
          amount: null,
          error: action.payload,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.activateTokens.transactions),
        },
      }

    /*
     * Deactivate tokens
     */
    case 'deactivate-tokens':
      return {
        ...state,
        deactivateTokens: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.activateTokens.transactions],
        },
      }

    case 'deactivate-tokens/pending':
      return assocPath(
        ['deactivateTokens', 'transactions'],
        [
          ...state.deactivateTokens.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'deactivate-tokens/success':
      return {
        ...state,
        deactivateTokens: {
          amount: null,
          error: null,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.deactivateTokens.transactions),
        },
      }

    case 'deactivate-tokens/error':
      return {
        ...state,
        deactivateTokens: {
          amount: null,
          error: action.payload,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.deactivateTokens.transactions),
        },
      }

    case 'deactivate-tokens/cleanup':
      return assocPath(
        ['deactivateTokens', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.deactivateTokens.transactions
        ),
        state
      )

    default:
      return state
  }
}

export default reducer
