/* eslint-disable no-console*/
/* eslint-disable no-unused-vars*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";
import SERVICE_REQUEST_STATUSES from "Constants/serviceRequestStatuses";

//action types
export const types = {
  RESET_NAVIGATION: "RESET_NAVIGATION",
  FETCH_NAVIGATION_REQUEST: "FETCH_NAVIGATION_REQUEST",
  FETCH_NAVIGATION_SUCCESS: "FETCH_NAVIGATION_SUCCESS",
  FETCH_NAVIGATION_FAILURE: "FETCH_NAVIGATION_FAILURE"
};

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

//reducer action handlers
const actionHandlers = {
  [types.RESET_NAVIGATION]: () => {
    return { ...initialState };
  },
  [types.FETCH_NAVIGATION_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_NAVIGATION_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: SERVICE_REQUEST_STATUSES.SUCCESS, data: action.data };
  },
  [types.FETCH_NAVIGATION_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: SERVICE_REQUEST_STATUSES.FAILURE, error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const resetNavigation = () => ({ type: types.RESET_NAVIGATION });
const fetchNavigationRequest = () => ({ type: types.FETCH_NAVIGATION_REQUEST });
const fetchNavigationSuccess = data => ({ type: types.FETCH_NAVIGATION_SUCCESS, data });
const fetchNavigationFailure = error => ({ type: types.FETCH_NAVIGATION_FAILURE, error });

const fetchNavigationActionCreators = {
  reset: resetNavigation,
  request: fetchNavigationRequest,
  success: fetchNavigationSuccess,
  failure: fetchNavigationFailure
};

//Fetch navbar links api call
const fetchNavigationApi = requestGenerator(fetchNavigationActionCreators);

const fetchNavigation = url => dispatch => dispatch(fetchNavigationApi.request({ method: "get", url }));

const cancelFetchNavigation = () => dispatch => dispatch(fetchNavigationApi.cancelRequest());

//actions
export const actions = {
  resetNavigation,
  fetchNavigationRequest,
  fetchNavigationSuccess,
  fetchNavigationFailure,
  fetchNavigation,
  cancelFetchNavigation
};
