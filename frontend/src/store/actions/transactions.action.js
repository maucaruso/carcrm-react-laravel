import { HttpAuth } from "../../config/Http";

export const actionTypes = {
  INDEX: "TRANSACTIONS_INDEX",
};

// INDEX

export const indexResponse = (payload, isLoadMore) => ({
  type: actionTypes.INDEX,
  payload,
  isLoadMore,
});

export const index = (query, isLoadMore) => (dispatch) => {
  return HttpAuth.get("/transactions?" + new URLSearchParams(query)).then(
    (res) =>
      typeof res !== "undefined" &&
      dispatch(indexResponse(res.dada, isLoadMore))
  );
};

// SHOW

export const show = (id) => (dispatch) => {
  return HttpAuth.get("/transactions/" + id).then(
    (res) => typeof res !== "undefined" && dispatch(indexResponse(res.data))
  );
};
