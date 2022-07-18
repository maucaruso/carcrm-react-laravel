import { actionTypes } from '../actions/transactions.action';

const initialState = {
  transactions: {
    data: []
  },
  transaction: {}
}

const transactionsReducers = (state = initialState, { type, payload, isLoadMore }) => {
  switch (type) {

  case actionTypes.INDEX:
    if (isLoadMore) {
      payload.transactions.data = state.transactions.data.concat(
        payload.transactions.data
      );
    }
    return { ...state, ...payload }

  default:
    return state
  }
}

export default transactionsReducers;