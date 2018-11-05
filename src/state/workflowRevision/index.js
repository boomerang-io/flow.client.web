/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";
import requestGenerator from "@boomerang/boomerang-utilities/lib/requestGenerator";

// Action types
export const types = {
  WORKFLOW_REVISION_RESET: "WORKFLOW_REVISION_RESET",
  FETCH_WORKFLOW_REVISION_REQUEST: "FETCH_WORKFLOW_REVISION_REQUEST",
  FETCH_WORKFLOW_REVISION_SUCCESS: "FETCH_WORKFLOW_REVISION_SUCCESS",
  FETCH_WORKFLOW_REVISION_FAILURE: "FETCH_WORKFLOW_REVISION_FAILURE",
  CREATE_WORKFLOW_REVISION_SUCCESS: "CREATE_WORKFLOW_REVISION_SUCCESS",
  CREATE_WORKFLOW_REVISION_FAILURE: "CREATE_WORKFLOW_REVISION_FAILURE",
  CREATE_WORKFLOW_REVISION_REQUEST: "CREATE_WORKFLOW_REVISION_REQUEST",
  CREATE_NODE: "CREATE_NODE",
  UPDATE_NODE: "UPDATE_NODE",
  DELETE_NODE: "DELETE_NODE"
};
Object.freeze(types);

//initial state
export const initialState = {
  isFetching: false,
  isCreating: false,
  fetchingStatus: "",
  creatingStatus: "",
  error: "",
  dag: undefined,
  config: {}
};

//action handlers
const actionHandlers = {
  [types.WORKFLOW_REVISION_RESET]: () => {
    return { ...initialState };
  },
  [types.FETCH_WORKFLOW_REVISION_REQUEST]: state => {
    return { ...state, isFetching: true };
  },
  [types.FETCH_WORKFLOW_REVISION_SUCCESS]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetchingStatus: "success",
      dag: action.data.dag,
      config: normalizeConfigNodes(action.data.config.nodes)
    };
  },
  [types.FETCH_WORKFLOW_REVISION_FAILURE]: (state, action) => {
    return { ...state, isFetching: false, fetchingStatus: "failure", error: action.error };
  },
  [types.CREATE_WORKFLOW_REVISION_SUCCESS]: (state, action) => ({
    ...state,
    isCreating: false,
    creatingStatus: "success",
    dag: action.data.dag,
    config: normalizeConfigNodes(action.data.config.nodes)
  }),
  [types.CREATE_WORKFLOW_REVISION_FAILURE]: (state, action) => ({
    ...state,
    isCreating: false,
    creatingStatus: "failure",
    error: action.error
  }),
  [types.CREATE_WORKFLOW_REVISION_REQUEST]: state => ({ ...state, isCreating: true, creatingStatus: "" }),
  [types.CREATE_NODE]: (state, action) => {
    return { ...state, config: { ...state.config, [action.data.nodeId]: action.data } };
  },
  [types.UPDATE_NODE]: (state, action) => {
    //const updatedNode = { ...state.data[action.data.nodeId], config: action.data.config };
    const updatedNode = {
      ...state.config[action.data.nodeId],
      inputs: { ...state.config[action.data.nodeId].inputs, ...action.data.inputs }
    };
    return { ...state, config: { ...state.config, [action.data.nodeId]: updatedNode } };
  },
  [types.DELETE_NODE]: (state, action) => {
    const nodes = { ...state.nodes };
    delete nodes[action.data.nodeId];
    return { ...state, nodes };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
const reset = () => ({ type: types.WORKFLOW_REVISION_RESET });
const fetchRequest = () => ({ type: types.FETCH_WORKFLOW_REVISION_REQUEST });
const fetchSuccess = data => ({ type: types.FETCH_WORKFLOW_REVISION_SUCCESS, data });
const fetchFailure = error => ({ type: types.FETCH_WORKFLOW_REVISION_FAILURE, error });
const createRequest = () => ({ type: types.CREATE_WORKFLOW_REVISION_REQUEST });
const createSuccess = data => ({ type: types.CREATE_WORKFLOW_REVISION_SUCCESS, data });
const createFailure = error => ({ type: types.CREATE_WORKFLOW_REVISION_FAILURE, error });
const addNode = data => ({ type: types.CREATE_NODE, data });
const updateNode = data => ({ type: types.UPDATE_NODE, data });
const deleteNode = data => ({ type: types.DELETE_NODE, data });

const fetchActionCreators = {
  reset: reset,
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure
};

const fetchApi = requestGenerator(fetchActionCreators);
const fetch = url => dispatch => dispatch(fetchApi.request({ method: "get", url }));
const cancelFetch = () => dispatch => dispatch(fetchApi.cancelRequest());

const createActionCreators = {
  reset: reset,
  request: createRequest,
  success: createSuccess,
  failure: createFailure
};

const createApi = requestGenerator(createActionCreators);
const create = (url, data) => dispatch => dispatch(createApi.request({ method: "post", url, data }));
const cancelCreate = () => dispatch => dispatch(createApi.cancelRequest());

/*
 action creators declared to be passed into the GET request generator boilerplate
*/

//actions
export const actions = {
  fetch,
  fetchRequest,
  fetchFailure,
  fetchSuccess,
  cancelFetch,
  create,
  createRequest,
  createFailure,
  createSuccess,
  cancelCreate,
  addNode,
  updateNode,
  deleteNode,
  reset
};

//helper
//TODO can this be improved?
function normalizeConfigNodes(nodes) {
  const normalizedNodesObj = {};
  nodes.forEach(node => {
    normalizedNodesObj[node.nodeId] = node;
  });

  return normalizedNodesObj;
}
