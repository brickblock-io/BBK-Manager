// @flow
import type { ActionsT } from './actions'

export type StateT = ?{|
  error: ?string,
  value: string,
  valueAsNumber: number,
  valueInWords: string,
|}

export const initialState: StateT = null

type ReducerT = (state: StateT, action: ActionsT) => StateT
export const reducer: ReducerT = (state = initialState, action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('ACT Reducer', action) // eslint-disable-line no-console
  }

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
