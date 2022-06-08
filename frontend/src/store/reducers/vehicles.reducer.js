import { actionTypes } from "../actions/vehicles.action";

const initialState = {
  vehicles: {
    data: [],
  },
  vehicle: {},
  vehicle_brand: [],
  vehicle_model: [],
  vehicle_version: [],
  success: false,
  error: {},
};

const vehiclesReducer = (
  state = initialState,
  { type, payload, isLoadMore }
) => {
  switch (type) {
    case actionTypes.INDEX:
      if (isLoadMore) {
        payload.vehicles.data = state.vehicles.data.concat(
          payload.vehicles.data
        );
      }
      return { ...state, ...payload };

    default:
      return state;

    case actionTypes.DESTROY:
      return {
        ...state,
        vehicles: {
          ...state.vehicles,
          data: state.vehicles.data.filter((item) => item.id !== payload),
        },
      };

    case actionTypes.CHANGE:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          ...payload,
        },
      };

    case actionTypes.SUCCESS:
      return {
        ...state,
        success: payload,
      };

    case actionTypes.ERROR:
      return {
        ...state,
        error: payload,
      };
  }
};

export default vehiclesReducer;
