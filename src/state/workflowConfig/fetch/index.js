/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  FETCH_WORKFLOW_CONFIG_RESET: "FETCH_WORKFLOW_CONFIG_RESET",
  FETCH_WORKFLOW_CONFIG_REQUEST: "FETCH_WORKFLOW_CONFIG_REQUEST",
  FETCH_WORKFLOW_CONFIG_SUCCESS: "FETCH_WORKFLOW_CONFIG_SUCCESS",
  FETCH_WORKFLOW_CONFIG_FAILURE: "FETCH_WORKFLOW_CONFIG_FAILURE",
  CREATE_NODE: "CREATE_NODE",
  REPLACE_NODE: "REPLACE_NODE",
  UPDATE_NODE: "UPDATE_NODE",
  DELETE_NODE: "DELETE_NODE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  status: "",
  error: "",
  data: {}
};

//action handlers
const actionHandlers = {
  [types.FETCH_WORKFLOW_CONFIG_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_WORKFLOW_CONFIG_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_WORKFLOW_CONFIG_SUCCESS]: (state, action) => {
    const normalizedDataObj = {
      id: action.data.id,
      workflowId: action.data.workflowId
    };
    action.data.nodes.forEach(node => {
      normalizedDataObj[node.nodeId] = node;
    });
    return { ...state, isFetching: false, status: "success", data: normalizedDataObj };
  },
  [types.FETCH_WORKFLOW_CONFIG_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, status: "failure", error: action.error };
  },
  [types.CREATE_NODE]: (state, action) => {
    return { ...state, data: { ...state.data, [action.data.nodeId]: action.data } };
  },
  [types.UPDATE_NODE]: (state, action) => {
    //const updatedNode = { ...state.data[action.data.nodeId], config: action.data.config };
    const updatedNode = {
      ...state.data[action.data.nodeId],
      config: { ...state.data[action.data.nodeId].config, ...action.data.config }
    };
    return { ...state, data: { ...state.data, [action.data.nodeId]: updatedNode } };
  },
  [types.DELETE_NODE]: (state, action) => {
    const {
      data: { [action.data.nodeId]: _, ...data }
    } = state;
    return { ...state, data };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const fetchRequest = () => ({ type: types.FETCH_WORKFLOW_CONFIG_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_WORKFLOW_CONFIG_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_WORKFLOW_CONFIG_FAILURE, error });
const reset = () => ({ type: types.FETCH_WORKFLOW_CONFIG_RESET });
const addNode = data => ({ type: types.CREATE_NODE, data });
const updateNode = data => ({ type: types.UPDATE_NODE, data });
const deleteNode = data => ({ type: types.DELETE_NODE, data });

const actionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(actionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancelFetch = () => dispatch => dispatch(fetchApi.cancelRequest());

//actions
export const actions = {
  fetch,
  fetchRequest,
  fetchFailure,
  fetchSuccess,
  cancelFetch,
  reset,
  addNode,
  updateNode,
  deleteNode
};
