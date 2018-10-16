/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  RESET_SERIALIZATION: "RESET_SERIALIZATION",
  FETCH_SERIALIZATION_REQUEST: "FETCH_SERIALIZATION_REQUEST",
  FETCH_SERIALIZATION_SUCCESS: "FETCH_SERIALIZATION_SUCCESS",
  FETCH_SERIALIZATION_FAILURE: "FETCH_SERIALIZATION_FAILURE",

  UPDATE_SERIALIZATION_SUCCESS: "UPDATE_SERIALIZATION_SUCCESS",
  UPDATE_SERIALIZATION_FAILURE: "UPDATE_SERIALIZATION_FAILURE",
  UPDATE_SERIALIZATION_REQUEST: "UPDATE_SERIALIZATION_REQUEST",
  UPDATE_SERIALIZATION_RESET: "UPDATE_SERIALIZATION_RESET"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: [],
  isUpdating: false,
  updateStatus: "",
  updateError: "",
  updateData: []
};

//action handlers
const actionHandlers = {
  [types.RESET_SERIALIZATION]: () => {
    return { ...initialState };
  },
  [types.FETCH_SERIALIZATION_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_SERIALIZATION_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_SERIALIZATION_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },

  [types.UPDATE_SERIALIZATION_SUCCESS]: (state, action) => ({
    ...state,
    updateStatus: "success",
    isUpdating: false,
    data: action.response
  }),
  [types.UPDATE_SERIALIZATION_FAILURE]: (state, action) => ({
    ...state,
    isUpdating: false,
    updateStatus: "failure",
    updateData: [],
    updateError: action.error
  }),
  [types.UPDATE_SERIALIZATION_REQUEST]: state => ({ ...state, isUpdating: true, updateStatus: "" }),
  [types.UPDATE_SERIALIZATION_RESET]: () => ({ ...initialState })
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchSerializationRequest = () => ({ type: types.FETCH_SERIALIZATION_REQUEST });
const fetchSerializationSuccess = data => ({ type: types.FETCH_SERIALIZATION_SUCCESS, response: data });
const fetchSerializationFailure = error => ({ type: types.FETCH_SERIALIZATION_FAILURE, error });
const SerializationReset = () => ({ type: types.RESET_SERIALIZATION });

const updateSerializationRequest = () => ({ type: types.UPDATE_SERIALIZATION_REQUEST });
const updateSerializationSuccess = data => ({ type: types.UPDATE_SERIALIZATION_SUCCESS, response: data });
const updateSerializationFailure = error => ({ type: types.UPDATE_SERIALIZATION_FAILURE, error });
const updateSerializationReset = () => ({ type: types.UPDATE_SERIALIZATION_RESET });

const fetchSerializationActionCreators = {
  reset: SerializationReset,
  request: fetchSerializationRequest,
  success: fetchSerializationSuccess,
  failure: fetchSerializationFailure
};

const updateSerializationActionCreators = {
  reset: updateSerializationReset,
  request: updateSerializationRequest,
  success: updateSerializationSuccess,
  failure: updateSerializationFailure
};

const fetchSerializationApi = requestGenerator(fetchSerializationActionCreators);
const fetchSerialization = url => dispatch => dispatch(fetchSerializationApi.request({ method: "get", url }));
const cancelSerialization = () => dispatch => dispatch(fetchSerializationApi.cancelRequest());

const updateSerializationApi = requestGenerator(updateSerializationActionCreators);
const updateSerialization = (url, data) => dispatch =>
  dispatch(updateSerializationApi.request({ method: "put", url, data }));
const cancelUpdateSerialization = () => dispatch => dispatch(updateSerializationApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetchSerialization,
  fetchSerializationRequest,
  fetchSerializationFailure,
  fetchSerializationSuccess,
  cancelSerialization,
  SerializationReset,

  updateSerialization,
  updateSerializationRequest,
  updateSerializationFailure,
  updateSerializationSuccess,
  cancelUpdateSerialization,
  updateSerializationReset
};
