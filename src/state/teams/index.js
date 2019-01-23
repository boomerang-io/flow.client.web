/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  FETCH_TEAMS_RESET: "FETCH_TEAMS_RESET",
  FETCH_TEAMS_REQUEST: "FETCH_TEAMS_REQUEST",
  FETCH_TEAMS_SUCCESS: "FETCH_TEAMS_SUCCESS",
  FETCH_TEAMS_FAILURE: "FETCH_TEAMS_FAILURE",
  UPDATE_WORKFLOWS: "UPDATE_WORKFLOWS"
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
  [types.FETCH_TEAMS_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_TEAMS_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_TEAMS_SUCCESS]: (state, action) => {
    return { ...state, isFetching: false, status: "success", data: action.data };
  },
  [types.FETCH_TEAMS_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },
  [types.UPDATE_WORKFLOWS]: (state, action) => {
    const unchangedTeam = state.data.filter(team => team.id !== action.data.teamId);
    const teamToUpdate = state.data.find(team => team.id === action.data.teamId);
    const updatedWorkflows = teamToUpdate.workflows.filter(workflow => workflow.id !== action.data.workflowId);
    const updatedTeam = { ...teamToUpdate, workflows: updatedWorkflows };
    return { ...state, data: [...unchangedTeam, updatedTeam] };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchRequest = () => ({ type: types.FETCH_TEAMS_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_TEAMS_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_TEAMS_FAILURE, error });
const reset = () => ({ type: types.FETCH_TEAMS_RESET });
const updateWorkflows = data => ({ type: types.UPDATE_WORKFLOWS, data });

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
  updateWorkflows,
  reset
};
