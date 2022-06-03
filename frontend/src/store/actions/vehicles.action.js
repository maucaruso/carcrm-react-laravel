import { HttpAuth } from "../../config/Http";
import { changeLoading } from "./loading.action";

export const actionTypes = {
  INDEX: "VEHICLE_INDEX",
  STORE: "VEHICLE_STORE",
  SHOW: "VEHICLE_SHOW",
  UPDATE: "VEHICLE_UPDATE",
  DESTROY: "VEHICLE_DESTROY",
  CHANGE: "VEHICLE_CHANGE",
  SUCCESS: "VEHICLE_SUCCESS",
  ERROR: "VEHICLE_ERROR",
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
export const indexResponse = (payload, isLoadMore) => ({
  type: actionTypes.INDEX,
  payload,
  isLoadMore,
});

export const index = (query, isLoadMore) => (dispatch) => {
  return HttpAuth.get("/vehicles?" + new URLSearchParams(query)).then((res) => {
    if (typeof res !== "undefined") {
      dispatch(indexResponse(res.data, isLoadMore));
    }
  });
};

// STORE

export const store = () => (dispatch) => {
  return HttpAuth.post("/vehicles").then((res) => {
    if (typeof res !== "undefined") {
      dispatch(indexResponse(res.data));
    }
  });
};

// SHOW
export const show = (id) => (dispatch) => {
  return HttpAuth.get("/vehicles/" + id).then((res) => {
    if (typeof res !== "undefined") {
      dispatch(indexResponse(res.data));
    }
  });
};

// UPDATE
export const updateResponse = (payload) => ({
  type: actionTypes.UPDATE,
  payload,
});

export const update = (data) => (dispatch) => {
  dispatch(
    changeLoading({
      open: true,
    })
  );

  return HttpAuth.put("/vehicles/" + data.id, data).then((res) => {
    dispatch(
      changeLoading({
        open: false,
      })
    );

    if (typeof res !== "undefined") {
      if (res.data.error) {
        dispatch(success(false));
        dispatch(error(res.data.error));
      }

      if (res.data.status === 200) {
        dispatch(success(true));
      }
    }
  });
};

// DETROY

export const destroyResponse = (payload) => ({
  type: actionTypes.DESTROY,
  payload
})

export const destroy = (id) => dispatch => {
  return HttpAuth.delete('/vehicles/', + id).then(res => {
    if (typeof res !== 'undefined') {
      if (res.data.status === 200) {
        dispatch(destroyResponse(id));
      }
    }
  });
}