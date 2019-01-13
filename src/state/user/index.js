/* eslint-disable no-console*/
/* eslint-disable no-unused-vars*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

//action types
export const types = {
  USER_RESET: "USER_RESET",
  FETCH_USER_REQUEST: "FETCH_USER_REQUEST",
  FETCH_USER_SUCCESS: "FETCH_USER_SUCCESS",
  FETCH_USER_FAILURE: "FETCH_USER_FAILURE",
  UPDATE_USER_REQUEST: "UPDATE_USER_REQUEST",
  UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",
  UPDATE_USER_FAILURE: "UPDATE_USER_FAILURE"
};

//initial state
export const initialState = {
  isFetching: false,
  isUpdating: false,
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
  },
  [types.UPDATE_USER_REQUEST]: state => {
    return { ...state, isUpdating: true };
  },
  [types.UPDATE_USER_SUCCESS]: (state, action) => {
    return {
      ...state,
      isUpdating: false,
      status: "success",
      data: { ...state.data, isFirstVisit: action.data.isFirstVisit }
    };
  },
  [types.UPDATE_USER_FAILURE]: (state, action) => {
    return { ...state, isUpdating: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const resetUser = () => ({ type: types.USER_RESET });
const fetchUserRequest = () => ({ type: types.FETCH_USER_REQUEST });
const fetchUserSuccess = data => ({ type: types.FETCH_USER_SUCCESS, data });
const fetchUserFailure = error => ({ type: types.FETCH_USER_FAILURE, error });
const updateUserRequest = () => ({ type: types.UPDATE_USER_REQUEST });
const updateUserSuccess = data => ({ type: types.UPDATE_USER_SUCCESS, data });
const updateUserFailure = error => ({ type: types.UPDATE_USER_FAILURE, error });

const fetchUserActionCreators = {
  reset: resetUser,
  request: fetchUserRequest,
  success: fetchUserSuccess,
  failure: fetchUserFailure
};

const updateUserActionCreators = {
  reset: resetUser,
  request: updateUserRequest,
  success: updateUserSuccess,
  failure: updateUserFailure
};

//Fetch user api call
const fetchUserApi = requestGenerator(fetchUserActionCreators);

const fetchUser = url => dispatch => dispatch(fetchUserApi.request({ method: "get", url }));

const cancelFetchUser = () => dispatch => dispatch(fetchUserApi.cancelRequest());

//Update user api call
const updateUserApi = requestGenerator(updateUserActionCreators);

const updateUser = (url, data) => dispatch => dispatch(updateUserApi.request({ method: "patch", url, data }));

const cancelUpdateUser = () => dispatch => dispatch(updateUserApi.cancelRequest());

//actions
export const actions = {
  resetUser,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchUser,
  cancelFetchUser,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  updateUser,
  cancelUpdateUser
};
