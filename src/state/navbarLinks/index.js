/* eslint-disable no-console*/
/* eslint-disable no-unused-vars*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  RESET_NAVBAR_LINKS: "RESET_NAVBAR_LINKS",
  FETCH_NAVBAR_LINKS_REQUEST: "FETCH_NAVBAR_LINKS_REQUEST",
  FETCH_NAVBAR_LINKS_SUCCESS: "FETCH_NAVBAR_LINKS_SUCCESS",
  FETCH_NAVBAR_LINKS_FAILURE: "FETCH_NAVBAR_LINKS_FAILURE"
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
  [types.RESET_NAVBAR_LINKS]: () => {
    return { ...initialState };
  },
  [types.FETCH_NAVBAR_LINKS_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_NAVBAR_LINKS_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_NAVBAR_LINKS_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const reset = () => ({ type: types.RESET_NAVBAR_LINKS });
const fetchRequest = () => ({ type: types.FETCH_NAVBAR_LINKS_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_NAVBAR_LINKS_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_NAVBAR_LINKS_FAILURE, error });

const fetchNavbarLinksActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

//Fetch navbar links api call
const fetchNavbarLinksApi = requestGenerator(fetchNavbarLinksActionCreators);

const fetch = url => dispatch => dispatch(fetchNavbarLinksApi.request({ method: "get", url }));

const cancel = () => dispatch => dispatch(fetchNavbarLinksApi.cancelRequest());

//actions
export const actions = {
  reset,
  fetchRequest,
  fetchSuccess,
  fetchFailure,
  fetch,
  cancel
};
