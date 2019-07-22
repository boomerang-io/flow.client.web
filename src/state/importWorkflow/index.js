/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  IMPORT_WORKFLOW_RESET: "IMPORT_WORKFLOW_RESET",
  IMPORT_WORKFLOW_REQUEST: "IMPORT_WORKFLOW_REQUEST",
  IMPORT_WORKFLOW_SUCCESS: "IMPORT_WORKFLOW_SUCCESS",
  IMPORT_WORKFLOW_FAILURE: "IMPORT_WORKFLOW_FAILURE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isPosting: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.IMPORT_WORKFLOW_RESET]: () => {
    return { ...initialState };
  },
  [types.IMPORT_WORKFLOW_REQUEST]: state => {
    return { ...state, isPosting: true };
  },
  [types.IMPORT_WORKFLOW_SUCCESS]: (state, action) => {
    return { ...state, isPosting: false, status: "success", data: action.data };
  },
  [types.IMPORT_WORKFLOW_FAILURE]: (state, action) => {
    return { ...state, isPosting: false, status: "failure", error: action.error };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const postRequest = () => ({ type: types.IMPORT_WORKFLOW_REQUEST });
const postSuccess = data => ({ type: types.IMPORT_WORKFLOW_SUCCESS, data });
const postFailure = error => ({ type: types.IMPORT_WORKFLOW_FAILURE, error });
const reset = () => ({ type: types.IMPORT_WORKFLOW_RESET });

const postActionCreators = {
  reset: reset,
  request: postRequest,
  success: postSuccess,
  failure: postFailure
};

const postApi = requestGenerator(postActionCreators);
const post = (url, data) => dispatch => dispatch(postApi.request({ method: "post", url, data }));
const cancel = () => dispatch => dispatch(postApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  post,
  postRequest,
  postFailure,
  postSuccess,
  cancel,
  reset
};
