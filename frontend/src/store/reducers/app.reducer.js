import { actionTypes } from "../actions/app.action";

const initialState = {
  app: {},
  success: false,
  error: {},
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.INDEX:
      return { ...state, ...payload };

    case actionTypes.CHANGE:
      return { 
        ...state, 
        app: {
          ...state.app,
          ...payload
        }
      };

    case actionTypes.SUCCESS:
      return { 
        ...state, 
        success: payload
      };
      
    case actionTypes.ERROR:
      return { 
        ...state, 
        error: payload 
      };
      
    default:
      return state;
  }
};

export default appReducer;
