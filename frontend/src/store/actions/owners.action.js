import { HttpAuth } from "../../config/Http";
import { changeLoading } from "./loading.action";
import { changeNotify } from "./notify.action";

export const actionTypes = {
  INDEX: "OWNER_INDEX",
  STORE: "OWNER_STORE",
  SHOW: "OWNER_UPDATE",
  UPDATE: "OWNER_UPDATE",
  DESTROY: "OWNER_DESTROY",
  VEHICLES: "OWNER_VEHICLES",
  CHANGE: "OWNER_CHANGE",
  SUCCESS: "OWNER_SUCCESS",
  ERROR: "OWNER_ERROR",
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
  return HttpAuth.get("/owners?" + new URLSearchParams(query)).then(
    (res) =>
      typeof res !== "undefined" &&
      dispatch(indexResponse(res.data, isLoadMore))
  );
};

// STORE

export const storeResponse = (payload) => ({
  type: actionTypes.STORE,
  payload,
});

export const store = (data) => (dispatch) => {
  dispatch(changeLoading({ open: true }));

  return HttpAuth.post("/owners", data).then((res) => {
    dispatch(changeLoading({ open: false }));

    if (typeof res !== "undefined") {
      if (res.data.error) {
        dispatch(error(res.data.error));
      }

      if (res.data.id) {
        dispatch(storeResponse(res.data));
        dispatch(success(true));
        dispatch(
          changeNotify({
            open: true,
            msg: "Proprietário cadastrado com sucesso",
            class: "success",
          })
        );
      }
    }
  });
};

// SHOW

export const show = (id) => (dispatch) => {
  return HttpAuth.get("/owners/" + id).then(
    (res) => typeof res !== "undefined" && dispatch(indexResponse(res.data))
  );
};

// UPDATE

export const updateResponse = (payload) => ({
  type: actionTypes.UPDATE,
  payload,
});

export const update = (data) => (dispatch) => {
  dispatch(changeLoading({ open: true }));

  return HttpAuth.put("/owners/" + data.id, data).then((res) => {
    dispatch(changeLoading({ open: false }));

    if (res.data.error) {
      dispatch(error(res.data.error));
    }

    if (res.data.status === 200) {
      dispatch(updateResponse(data));
      dispatch(success(true));
      dispatch(
        changeNotify({
          open: true,
          msg: res.data.success,
          class: "success",
        })
      );
    }
  });
};

export const destroyResponse = (payload) => ({
  type: actionTypes.DESTROY,
  payload,
});

export const destroy = (id) => (dispatch) => {
  return HttpAuth.delete("/owners/" + id).then(
    (res) => typeof res !== "undefined" && dispatch(destroyResponse(id))
  );
};

// VEHICLES

export const vehiclesResponse = (payload) => ({
  type: actionTypes.VEHICLES,
  payload,
});

export const vehicles = (query, isLoadMore) => (dispatch) => {
  return HttpAuth.get("/vehicles?" + new URLSearchParams(query)).then(
    (res) =>
      typeof res !== "undefined" &&
      dispatch(vehiclesResponse(res.data, isLoadMore))
  );
};

// CEP

export const cep = (zipCode) => (dispatch) => {
  if (zipCode.length > 8) {
    return HttpAuth.post("/webservice/cep", {
      cep: zipCode,
    }).then((res) => {
      if (typeof res !== "undefined") {
        return res.data.error
          ? dispatch(error(res.data.error))
          : dispatch(change(res.data));
      }
    });
  }
};
