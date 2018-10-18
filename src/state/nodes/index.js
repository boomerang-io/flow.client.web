/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";

// Action types
export const types = {
  CREATE_NODE: "CREATE_NODE",
  REPLACE_NODE: "REPLACE_NODE",
  UPDATE_NODE: "UPDATE_NODE",
  DELETE_NODE: "DELETE_NODE"
};
Object.freeze(types);

export const initialState = {
  nodes: {}
};

//action handlers
const actionHandlers = {
  [types.CREATE_NODE]: (state, action) => {
    return { ...state, nodes: { ...state.nodes, [action.data.nodeId]: action.data } };
  },
  [types.UPDATE_NODE]: (state, action) => {
    //const updatedNode = { ...state.nodes[action.data.nodeId], config: action.data.config };
    const updatedNode = {
      ...state.nodes[action.data.nodeId],
      config: { ...state.nodes[action.data.nodeId].config, ...action.data.config }
    };
    return { ...state, nodes: { ...state.nodes, [action.data.nodeId]: updatedNode } };
  },
  [types.DELETE_NODE]: (state, action) => {
    const {
      nodes: { [action.data.nodeId]: _, ...nodes }
    } = state;
    return { ...state, nodes };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

export const addNode = data => ({ type: types.CREATE_NODE, data });

export const updateNode = data => ({ type: types.UPDATE_NODE, data });

export const deleteNode = data => ({ type: types.DELETE_NODE, data });

//actions
export const actions = {
  addNode,
  updateNode,
  deleteNode
};
