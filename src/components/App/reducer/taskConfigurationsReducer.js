/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  RESET_TASK_CONFIGURATION: "RESET_TASK_CONFIGURATION",
  FETCH_TASK_CONFIGURATION_REQUEST: "FETCH_TASK_CONFIGURATION_REQUEST",
  FETCH_TASK_CONFIGURATION_SUCCESS: "FETCH_TASK_CONFIGURATION_SUCCESS",
  FETCH_TASK_CONFIGURATION_FAILURE: "FETCH_TASK_CONFIGURATION_FAILURE",

  UPDATE_TASK_CONFIGURATION_SUCCESS: "UPDATE_TASK_CONFIGURATION_SUCCESS",
  UPDATE_TASK_CONFIGURATION_FAILURE: "UPDATE_TASK_CONFIGURATION_FAILURE",
  UPDATE_TASK_CONFIGURATION_REQUEST: "UPDATE_TASK_CONFIGURATION_REQUEST",
  UPDATE_TASK_CONFIGURATION_RESET: "UPDATE_TASK_CONFIGURATION_RESET"
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
  [types.RESET_TASK_CONFIGURATION]: () => {
    return { ...initialState };
  },
  [types.FETCH_TASK_CONFIGURATION_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_TASK_CONFIGURATION_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_TASK_CONFIGURATION_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },

  [types.UPDATE_TASK_CONFIGURATION_SUCCESS]: (state, action) => ({
    ...state,
    updateStatus: "success",
    isUpdating: false,
    data: action.response
  }),
  [types.UPDATE_TASK_CONFIGURATION_FAILURE]: (state, action) => ({
    ...state,
    isUpdating: false,
    updateStatus: "failure",
    updateData: [],
    updateError: action.error
  }),
  [types.UPDATE_TASK_CONFIGURATION_REQUEST]: state => ({ ...state, isUpdating: true, updateStatus: "" }),
  [types.UPDATE_TASK_CONFIGURATION_RESET]: () => ({ ...initialState })
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchTASK_CONFIGURATIONRequest = () => ({ type: types.FETCH_TASK_CONFIGURATION_REQUEST });
const fetchTASK_CONFIGURATIONSuccess = data => ({ type: types.FETCH_TASK_CONFIGURATION_SUCCESS, response: data });
const fetchTASK_CONFIGURATIONFailure = error => ({ type: types.FETCH_TASK_CONFIGURATION_FAILURE, error });
const TASK_CONFIGURATIONReset = () => ({ type: types.RESET_TASK_CONFIGURATION });

const updateTASK_CONFIGURATIONRequest = () => ({ type: types.UPDATE_TASK_CONFIGURATION_REQUEST });
const updateTASK_CONFIGURATIONSuccess = data => ({ type: types.UPDATE_TASK_CONFIGURATION_SUCCESS, response: data });
const updateTASK_CONFIGURATIONFailure = error => ({ type: types.UPDATE_TASK_CONFIGURATION_FAILURE, error });
const updateTASK_CONFIGURATIONReset = () => ({ type: types.UPDATE_TASK_CONFIGURATION_RESET });

const fetchTASK_CONFIGURATIONActionCreators = {
  reset: TASK_CONFIGURATIONReset,
  request: fetchTASK_CONFIGURATIONRequest,
  success: fetchTASK_CONFIGURATIONSuccess,
  failure: fetchTASK_CONFIGURATIONFailure
};

const updateTASK_CONFIGURATIONActionCreators = {
  reset: updateTASK_CONFIGURATIONReset,
  request: updateTASK_CONFIGURATIONRequest,
  success: updateTASK_CONFIGURATIONSuccess,
  failure: updateTASK_CONFIGURATIONFailure
};

const fetchTASK_CONFIGURATIONApi = requestGenerator(fetchTASK_CONFIGURATIONActionCreators);
const fetchTASK_CONFIGURATION = url => dispatch => dispatch(fetchTASK_CONFIGURATIONApi.request({ method: "get", url }));
const cancelTASK_CONFIGURATION = () => dispatch => dispatch(fetchTASK_CONFIGURATIONApi.cancelRequest());

const updateTASK_CONFIGURATIONApi = requestGenerator(updateTASK_CONFIGURATIONActionCreators);
const updateTASK_CONFIGURATION = (url, data) => dispatch =>
  dispatch(updateTASK_CONFIGURATIONApi.request({ method: "put", url, data }));
const cancelUpdateTASK_CONFIGURATION = () => dispatch => dispatch(updateTASK_CONFIGURATIONApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetchTASK_CONFIGURATION,
  fetchTASK_CONFIGURATIONRequest,
  fetchTASK_CONFIGURATIONFailure,
  fetchTASK_CONFIGURATIONSuccess,
  cancelTASK_CONFIGURATION,
  TASK_CONFIGURATIONReset,

  updateTASK_CONFIGURATION,
  updateTASK_CONFIGURATIONRequest,
  updateTASK_CONFIGURATIONFailure,
  updateTASK_CONFIGURATIONSuccess,
  cancelUpdateTASK_CONFIGURATION,
  updateTASK_CONFIGURATIONReset
};
