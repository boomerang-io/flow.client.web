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
  entities: {}
};

//action handlers
const actionHandlers = {
  [types.CREATE_NODE]: (state, action) => {
    return { ...state, entities: { ...state.entities, [action.data.nodeId]: action.data } };
  },
  [types.UPDATE_NODE]: (state, action) => {
    //const updatedNode = { ...state.entities[action.data.nodeId], config: action.data.config };
    const updatedNode = {
      ...state.entities[action.data.nodeId],
      config: { ...state.entities[action.data.nodeId].config, ...action.data.config }
    };
    return { ...state, entities: { ...state.entities, [action.data.nodeId]: updatedNode } };
  },
  [types.DELETE_NODE]: (state, action) => {
    const {
      entities: { [action.data.nodeId]: _, ...entities }
    } = state;
    return { ...state, entities };
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
