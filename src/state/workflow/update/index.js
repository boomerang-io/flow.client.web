/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  UPDATE_WORKFLOW_SUCCESS: "UPDATE_WORKFLOW_SUCCESS",
  UPDATE_WORKFLOW_FAILURE: "UPDATE_WORKFLOW_FAILURE",
  UPDATE_WORKFLOW_REQUEST: "UPDATE_WORKFLOW_REQUEST",
  UPDATE_WORKFLOW_RESET: "UPDATE_WORKFLOW_RESET"
};
Object.freeze(types);

//initial state
export const initialState = {
  isUpdating: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.UPDATE_WORKFLOW_SUCCESS]: (state, action) => ({
    ...state,
    isUpdating: false,
    status: "success",
    data: action.response
  }),
  [types.UPDATE_WORKFLOW_FAILURE]: (state, action) => ({
    ...state,
    isUpdating: false,
    status: "failure",
    data: [],
    error: action.error
  }),
  [types.UPDATE_WORKFLOW_REQUEST]: state => ({ ...state, isUpdating: true, status: "" }),
  [types.UPDATE_WORKFLOW_RESET]: () => ({ ...initialState })
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

const updateRequest = () => ({ type: types.UPDATE_WORKFLOW_REQUEST });
const updateSuccess = data => ({ type: types.UPDATE_WORKFLOW_SUCCESS, data });
const updateFailure = error => ({ type: types.UPDATE_WORKFLOW_FAILURE, error });
const reset = () => ({ type: types.UPDATE_WORKFLOW_RESET });

const updateActionCreators = {
  reset: reset,
  request: updateRequest,
  success: updateSuccess,
  failure: updateFailure
};

const updateApi = requestGenerator(updateActionCreators);
const update = (url, data) => dispatch => dispatch(updateApi.request({ method: "put", url, data }));
const cancel = () => dispatch => dispatch(updateApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  update,
  updateRequest,
  updateFailure,
  updateSuccess,
  cancel,
  reset
};
