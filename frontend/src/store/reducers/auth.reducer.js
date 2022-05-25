import { actionTypes } from '../actions/auth.action';

const initialState = {
  credentials: {},
  success: false
}

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return {
      ...state, 
      credentials: {
        ...state.credentials,
        ...payload
      }
    }

    case actionTypes.SUCCESS:
      return {
        ...state,
        success: payload
      }

  default:
    return state
  }
}

export default authReducer;