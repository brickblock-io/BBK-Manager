// @flow
import type { ActionsT } from './actions'

export type BalanceT = {|
  error: ?string,
  value: string,
  valueInWords: string,
|}

export type StateT = {|
  lockTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
  },
  locked: ?BalanceT,
  unlockTokens: {
    amount: ?string,
    error: ?string,
    loading: boolean,
  },
  unlocked: ?BalanceT,
|}

export const initialState: StateT = {
  locked: null,
  unlocked: null,
  lockTokens: {
    amount: null,
    error: null,
    loading: false,
  },
  unlockTokens: {
    amount: null,
    error: null,
    loading: false,
  },
}

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  switch (action.type) {
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

    case 'lock-tokens':
      return {
        ...state,
        lockTokens: { amount: action.payload, error: null, loading: true },
      }

    case 'lock-tokens/success':
      return {
        ...state,
        lockTokens: { amount: null, error: null, loading: false },
      }

    case 'lock-tokens/error':
      return {
        ...state,
        lockTokens: { amount: null, error: action.payload, loading: false },
      }

    case 'unlock-tokens':
      return {
        ...state,
        unlockTokens: { amount: action.payload, error: null, loading: true },
      }

    case 'unlock-tokens/success':
      return {
        ...state,
        unlockTokens: { amount: null, error: null, loading: false },
      }

    case 'unlock-tokens/error':
      return {
        ...state,
        unlockTokens: { amount: null, error: action.payload, loading: false },
      }

    default:
      return state
  }
}

export default reducer
