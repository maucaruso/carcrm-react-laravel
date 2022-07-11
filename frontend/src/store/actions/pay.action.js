import { HttpAuth } from "../../config/Http";
import { changeLoading } from "./loading.action";

export const actionTypes = {
  CHANGE: "PAY_CHANGE",
  SUCCESS: "PAY_SUCCESS",
  ERROR: "PAY_ERROR",
};

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload,
});

export const success = (payload) => ({
  type: actionTypes.SUCCESS,
  payload,
});

export const error = (payload) => ({
  type: actionTypes.ERROR,
  payload,
});

export const plans = () => dispatch => {
  return HttpAuth.get('/pay/plans').then(res => typeof res !== 'undefined' && dispatch(change(res.data)));
}