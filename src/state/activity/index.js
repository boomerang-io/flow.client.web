/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  FETCH_ACTIVITY_RESET: "FETCH_ACTIVITY_RESET",
  FETCH_ACTIVITY_REQUEST: "FETCH_ACTIVITY_REQUEST",
  FETCH_ACTIVITY_SUCCESS: "FETCH_ACTIVITY_SUCCESS",
  FETCH_ACTIVITY_FAILURE: "FETCH_ACTIVITY_FAILURE",
  UPDATE_ACTIVITY_REQUEST: "UPDATE_ACTIVITY_REQUEST",
  UPDATE_ACTIVITY_SUCCESS: "UPDATE_ACTIVITY_SUCCESS",
  UPDATE_ACTIVITY_FAILURE: "UPDATE_ACTIVITY_FAILURE"
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
  tableData: []
};

//action handlers
const actionHandlers = {
  [types.FETCH_ACTIVITY_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_ACTIVITY_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_ACTIVITY_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      status: "success",
      updateStatus: "success",
      data: action.data,
      tableData: action.data
    };
  },
  [types.FETCH_ACTIVITY_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },
  [types.UPDATE_ACTIVITY_REQUEST]: state => {
    return { ...state, isUpdating: true };
  },
  [types.UPDATE_ACTIVITY_SUCCESS]: (state, action) => {
    return {
      ...state,
      isUpdating: false,
      updateStatus: "success",
      tableData: action.data
    };
  },
  [types.UPDATE_ACTIVITY_FAILURE]: (state, action) => {
    return { ...state, isUpdating: false, updateStatus: "failure", updateError: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchRequest = () => ({ type: types.FETCH_ACTIVITY_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_ACTIVITY_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_ACTIVITY_FAILURE, error });
const reset = () => ({ type: types.FETCH_ACTIVITY_RESET });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancel = () => dispatch => dispatch(fetchApi.cancelRequest());

const updateRequest = () => ({ type: types.UPDATE_ACTIVITY_REQUEST });
const updateSuccess = data => ({ type: types.UPDATE_ACTIVITY_SUCCESS, data });
const updateFailure = error => ({ type: types.UPDATE_ACTIVITY_FAILURE, error });

const updateActionCreators = {
  reset: reset,
  request: updateRequest,
  success: updateSuccess,
  failure: updateFailure
};

const updateApi = requestGenerator(updateActionCreators);
const update = url => dispatch => dispatch(updateApi.request({ method: "get", url }));
const cancelMore = () => dispatch => dispatch(updateApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetch,
  fetchRequest,
  fetchFailure,
  fetchSuccess,
  cancel,
  update,
  cancelMore,
  reset
};
