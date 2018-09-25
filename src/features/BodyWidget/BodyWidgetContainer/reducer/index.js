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
  data: []
};

//action handlers
const actionHandlers = {
  [types.CREATE_NODE]: (state, action) => {
    return { ...state, data: [...state.data, action.data] };
  },
  [types.UPDATE_NODE]: (state, action) => {
    return state.nodes.map(node => (node.id === action.data.id ? action.data : node));
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

export const addNode = data => ({ type: types.CREATE_NODE, data });

export const updateNode = data => ({ type: types.UPDATE_NODE, data });

//actions
export const actions = {
  addNode,
  updateNode
};
