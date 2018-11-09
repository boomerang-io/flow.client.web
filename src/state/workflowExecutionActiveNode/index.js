/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";

// Action types
export const types = {
  UPDATE_ACTIVE_NODE: "UPDATE_ACTIVE_NODE",
  RESET_ACTIVE_NODE: "RESET_ACTIVE_NODE"
};
Object.freeze(types);

export const initialState = {
  activeNode: {}
};

//action handlers
const actionHandlers = {
  [types.UPDATE_ACTIVE_NODE]: (state, action) => {
    return {
      ...state,
      activeNode: { ...state.activeNode, workflowId: action.data.workflowId, nodeId: action.data.nodeId }
    };
  },
  [types.RESET_ACTIVE_NODE]: (state, action) => {
    return { ...state, activeNode: { ...state.activeNode, workflowId: "", nodeId: "" } };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

export const updateActiveNode = data => ({ type: types.UPDATE_ACTIVE_NODE, data });

export const resetActiveNode = data => ({ type: types.RESET_ACTIVE_NODE, data });

//actions
export const actions = {
  updateActiveNode,
  resetActiveNode
};
