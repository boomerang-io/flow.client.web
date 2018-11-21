/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  FETCH_WEBHOOK_RESET: "FETCH_WEBHOOK_RESET",
  FETCH_WEBHOOK_REQUEST: "FETCH_WEBHOOK_REQUEST",
  FETCH_WEBHOOK_SUCCESS: "FETCH_WEBHOOK_SUCCESS",
  FETCH_WEBHOOK_FAILURE: "FETCH_WEBHOOK_FAILURE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.FETCH_WEBHOOK_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_WEBHOOK_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_WEBHOOK_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_WEBHOOK_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

const reset = () => ({ type: types.FETCH_WEBHOOK_RESET });
const fetchRequest = () => ({ type: types.FETCH_WEBHOOK_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_WEBHOOK_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_WEBHOOK_FAILURE, error });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancel = () => dispatch => dispatch(fetchApi.cancelRequest());

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
  reset
};
