import { HttpAuth } from "../../config/Http";
import { changeLoading } from "./loading.action";
import { changeNotify } from "./notify.action";
import { changeAlert } from "./alert.action";

export const actionTypes = {
  INDEX: "APP_INDEX",
  UPDATE: "APP_UPDATE",
  CHANGE: "APP_CHANGE",
  SUCCESS: "APP_SUCCESS",
  ERROR: "APP_ERROR",
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

// INDEX

export const indexResponse = (payload) => ({
  type: actionTypes.INDEX,
  payload,
});

export const index = () => (dispatch) => {
  return HttpAuth.get("/app").then(
    (res) => typeof res !== "undefined" && dispatch(indexResponse(res.data))
  );
};

// UPDATE

export const update = (data) => (dispatch) => {
  dispatch(changeLoading({ open: true }));

  return HttpAuth.put("/app/" + data.id, data).then((res) => {
    dispatch(changeLoading({ open: false }));

    if (typeof res !== "undefined") {
      if (res.data.error) {
        dispatch(error(res.data.error));
      }

      if (res.data.status === 200) {
        dispatch(
          changeNotify({
            open: true,
            msg: res.data.success,
            class: "success",
          })
        );

        dispatch(success(true));
      }
    }
  });
};
