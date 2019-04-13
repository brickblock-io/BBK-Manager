// @flow
import { assoc, assocPath, dissoc, map, propEq, when } from 'ramda'

// Types
import type { ActionsT } from './actions'
import type { TransactionsT } from 'types'

export type BalanceT = {|
  error: ?string,
  value: string,
  valueInWords: string,
|}

export type StateT = {|
  approveTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  lockTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  locked: ?BalanceT,
  unlockTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
    transactions: TransactionsT,
  },
  unlocked: ?BalanceT,
|}

export const initialState: StateT = {
  locked: null,
  unlocked: null,
  approveTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
  lockTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
  unlockTokens: {
    amount: null,
    error: null,
    loading: false,
    transactions: [],
  },
}

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(action) // eslint-disable-line no-console
  }

  switch (action.type) {
    /*
     * Balances
     */
    case 'reset-balances':
      return initialState

    case 'set-locked-balance':
      return { ...state, locked: { error: null, ...action.payload } }

    case 'set-locked-balance/error':
      return { ...state, locked: { ...state.locked, error: action.payload } }

    case 'set-unlocked-balance':
      return { ...state, unlocked: { error: null, ...action.payload } }

    case 'set-unlocked-balance/error':
      return {
        ...state,
        unlocked: { ...state.unlocked, error: action.payload },
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
     * Lock tokens
     */
    case 'lock-tokens':
      return {
        ...state,
        lockTokens: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.lockTokens.transactions],
        },
      }

    case 'lock-tokens/pending':
      return assocPath(
        ['lockTokens', 'transactions'],
        [
          ...state.lockTokens.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'lock-tokens/success':
      return {
        ...state,
        lockTokens: {
          amount: null,
          error: null,
          loading: false,

          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.lockTokens.transactions),
        },
      }

    case 'lock-tokens/cleanup':
      return assocPath(
        ['lockTokens', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.lockTokens.transactions
        ),
        state
      )

    case 'lock-tokens/error':
      return {
        ...state,
        lockTokens: {
          amount: null,
          error: action.payload,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.lockTokens.transactions),
        },
      }

    /*
     * Unlock tokens
     */
    case 'unlock-tokens':
      return {
        ...state,
        unlockTokens: {
          amount: action.payload,
          error: null,
          loading: true,
          transactions: [...state.lockTokens.transactions],
        },
      }

    case 'unlock-tokens/pending':
      return assocPath(
        ['unlockTokens', 'transactions'],
        [
          ...state.unlockTokens.transactions,
          { hash: action.payload, current: true, status: 'pending' },
        ],
        state
      )

    case 'unlock-tokens/success':
      return {
        ...state,
        unlockTokens: {
          amount: null,
          error: null,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'success'))
          )(state.unlockTokens.transactions),
        },
      }

    case 'unlock-tokens/error':
      return {
        ...state,
        unlockTokens: {
          amount: null,
          error: action.payload,
          loading: false,
          transactions: map(
            when(propEq('current', true), assoc('status', 'error'))
          )(state.unlockTokens.transactions),
        },
      }

    case 'unlock-tokens/cleanup':
      return assocPath(
        ['unlockTokens', 'transactions'],
        map(
          when(propEq('current', true), dissoc('current')),
          state.unlockTokens.transactions
        ),
        state
      )

    default:
      return state
  }
}

export default reducer
