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
const fetchTaskConfigurationRequest = () => ({ type: types.FETCH_TASK_CONFIGURATION_REQUEST });
const fetchTaskConfigurationSuccess = data => ({ type: types.FETCH_TASK_CONFIGURATION_SUCCESS, response: data });
const fetchTaskConfigurationFailure = error => ({ type: types.FETCH_TASK_CONFIGURATION_FAILURE, error });
const taskConfigurationReset = () => ({ type: types.RESET_TASK_CONFIGURATION });

const updateTaskConfigurationRequest = () => ({ type: types.UPDATE_TASK_CONFIGURATION_REQUEST });
const updateTaskConfigurationSuccess = data => ({ type: types.UPDATE_TASK_CONFIGURATION_SUCCESS, response: data });
const updateTaskConfigurationFailure = error => ({ type: types.UPDATE_TASK_CONFIGURATION_FAILURE, error });
const updateTaskConfigurationReset = () => ({ type: types.UPDATE_TASK_CONFIGURATION_RESET });

const fetchTaskConfigurationActionCreators = {
  reset: taskConfigurationReset,
  request: fetchTaskConfigurationRequest,
  success: fetchTaskConfigurationSuccess,
  failure: fetchTaskConfigurationFailure
};

const updateTaskConfigurationActionCreators = {
  reset: updateTaskConfigurationReset,
  request: updateTaskConfigurationRequest,
  success: updateTaskConfigurationSuccess,
  failure: updateTaskConfigurationFailure
};

const fetchTaskConfigurationApi = requestGenerator(fetchTaskConfigurationActionCreators);
const fetchTaskConfiguration = url => dispatch => dispatch(fetchTaskConfigurationApi.request({ method: "get", url }));
const cancelTaskConfiguration = () => dispatch => dispatch(fetchTaskConfigurationApi.cancelRequest());

const updateTaskConfigurationApi = requestGenerator(updateTaskConfigurationActionCreators);
const updateTaskConfiguration = (url, data) => dispatch =>
  dispatch(updateTaskConfigurationApi.request({ method: "put", url, data }));
const cancelUpdateTaskConfiguration = () => dispatch => dispatch(updateTaskConfigurationApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetchTaskConfiguration,
  fetchTaskConfigurationRequest,
  fetchTaskConfigurationFailure,
  fetchTaskConfigurationSuccess,
  cancelTaskConfiguration,
  taskConfigurationReset,

  updateTaskConfiguration,
  updateTaskConfigurationRequest,
  updateTaskConfigurationFailure,
  updateTaskConfigurationSuccess,
  cancelUpdateTaskConfiguration,
  updateTaskConfigurationReset
};
