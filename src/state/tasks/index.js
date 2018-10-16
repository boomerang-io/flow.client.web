/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  RESET_TASKS: "RESET_TASKS",
  FETCH_TASKS_REQUEST: "FETCH_TASKS_REQUEST",
  FETCH_TASKS_SUCCESS: "FETCH_TASKS_SUCCESS",
  FETCH_TASKS_FAILURE: "FETCH_TASKS_FAILURE"
};
Object.freeze(types);

// Initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: []
};

//action handlers
const actionHandlers = {
  [types.RESET_TASKS]: () => {
    return { ...initialState };
  },
  [types.FETCH_TASKS_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_TASKS_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_TASKS_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the request generator boilerplate
*/
const resetFetchTasks = () => ({ type: types.RESET_TASKS });
const fetchTasksRequest = () => ({ type: types.FETCH_TASKS_REQUEST });
const fetchTasksSuccess = data => ({ type: types.FETCH_TASKS_SUCCESS, data });
const fetchTasksFailure = error => ({ type: types.FETCH_TASKS_FAILURE, error });

const fetchTasksCreators = {
  reset: resetFetchTasks,
  request: fetchTasksRequest,
  success: fetchTasksSuccess,
  failure: fetchTasksFailure
};

const fetchTasksApi = requestGenerator(fetchTasksCreators);

const fetchTasks = url => dispatch => dispatch(fetchTasksApi.request({ method: "get", url }));

const cancelFetchTasks = () => dispatch => dispatch(fetchTasksApi.cancelRequest());

//actions
export const actions = {
  resetFetchTasks,
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchTasks,
  cancelFetchTasks
};
