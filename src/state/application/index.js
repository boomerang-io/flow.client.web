/* eslint-disable no-console*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";

// Action types
export const types = {
  SET_ACTIVE_TEAM_ID: "SET_ACTIVE_TEAM_ID",
  UPDATE_ACTIVE_NODE: "UPDATE_ACTIVE_NODE",
  RESET_ACTIVE_NODE: "RESET_ACTIVE_NODE",
  MODAL_OPEN: "MODAL_OPEN"
};
Object.freeze(types);

//initial state
export const initialState = {
  activeTeamId: "",
  activeNode: {},
  modalOpen: false
};

const actionHandlers = {
  [types.SET_ACTIVE_TEAM_ID]: (state, action) => {
    return { ...state, activeTeamId: action.data.teamId };
  },
  [types.UPDATE_ACTIVE_NODE]: (state, action) => {
    return {
      ...state,
      activeNode: { ...state.activeNode, workflowId: action.data.workflowId, nodeId: action.data.nodeId }
    };
  },
  [types.RESET_ACTIVE_NODE]: (state, action) => {
    return { ...state, activeNode: { ...state.activeNode, workflowId: "", nodeId: "" } };
  },
  [types.MODAL_OPEN]: (state, action) => {
    return { ...state, modalOpen: action.data.modalOpen };
  }
};

export default createReducer(initialState, actionHandlers);

/*
 action creators declared to be passed into the GET request generator boilerplate
*/
export const setActiveTeam = data => ({ type: types.SET_ACTIVE_TEAM_ID, data });
export const updateActiveNode = data => ({ type: types.UPDATE_ACTIVE_NODE, data });
export const resetActiveNode = data => ({ type: types.RESET_ACTIVE_NODE, data });
export const isModalOpen = data => ({ type: types.MODAL_OPEN, data });

export const actions = {
  setActiveTeam,
  updateActiveNode,
  resetActiveNode,
  isModalOpen
};
