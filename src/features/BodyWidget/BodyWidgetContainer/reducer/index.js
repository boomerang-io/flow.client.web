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
  [types.ADD_NODE]: (state, action) => {
    return { ...state, data: [...state.data, action.data] };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

/*
const nodes = (state = [], action) => {
  switch (action.type) {
    case types.CREATE_NODE:
      return [
        ...state,
        {
          data: action.data
        }
      ];
    default:
      return state;
  }
};
export default nodes;*/
export const addNode = data => ({ type: types.CREATE_NODE, data });

//actions
export const actions = {
  addNode
};
