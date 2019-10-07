/* eslint-disable no-console*/
/* eslint-disable no-unused-vars*/
import createReducer from "@boomerang/boomerang-utilities/lib/createReducer";

//action types
export const types = {
  RESET_ONBOARD_EXP: "RESET_ONBOARD_EXP",
  ONBOARD_EXP_SHOW: "ONBOARD_EXP_SHOW",
  ONBOARD_EXP_HIDE: "ONBOARD_EXP_HIDE"
};

//initial state
export const initialState = {
  show: false
};

//reducer action handlers
const actionHandlers = {
  [types.RESET_ONBOARD_EXP]: () => {
    return { ...initialState };
  },
  [types.ONBOARD_EXP_SHOW]: state => {
    return { ...state, show: true };
  },
  [types.ONBOARD_EXP_HIDE]: (state, action) => {
    return { ...state, show: false };
  }
};

//reducer exported by default
export default createReducer(initialState, actionHandlers);

const resetOnBoardExp = () => ({ type: types.RESET_ONBOARD_EXP });
const showOnBoardExp = () => ({ type: types.ONBOARD_EXP_SHOW });
const hideOnBoardExp = () => ({ type: types.ONBOARD_EXP_HIDE });

//actions
export const actions = {
  resetOnBoardExp,
  showOnBoardExp,
  hideOnBoardExp
};
