// @flow
import type { ActionsT } from './actions'

export type StateT = ?{|
  error: ?string,
  value: string,
  valueInWords: string,
|}

export const initialState: StateT = null

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  switch (action.type) {
    case 'reset-balance':
      return initialState
    case 'set-balance':
      return { error: null, ...action.payload }
    case 'set-balance/error':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default reducer
