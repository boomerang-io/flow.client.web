/* eslint-disable no-console*/
/* eslint-disable no-unused-vars*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  RESET_USER: "RESET_USER",
  FETCH_USER_REQUEST: "FETCH_USER_REQUEST",
  FETCH_USER_SUCCESS: "FETCH_USER_SUCCESS",
  FETCH_USER_FAILURE: "FETCH_USER_FAILURE"
};

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: {}
};

//action handlers
const actionHandlers = {
  [types.USER_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_USER_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_USER_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_USER_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const reset = () => ({ type: types.USER_RESET });
const fetchRequest = () => ({ type: types.FETCH_USER_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_USER_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_WORKFLOW_FAILURE, error });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancel = () => dispatch => dispatch(fetchApi.cancelRequest());

//actions
export const actions = {
  reset: () => ({ type: types.RESET_USER }),
  fetchRequest: () => ({ type: types.fetchRequest }),
  fetchSuccess: data => ({ type: types.FETCH_USER_SUCCESS, data }),
  fetchFailure: error => ({ type: types.FETCH_USER_FAILURE, error }),
  fetch,
  cancel
};
