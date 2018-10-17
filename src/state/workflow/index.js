import { combineReducers } from "redux";
import fetch from "./fetch";
import update from "./update";

const rootReducer = combineReducers({
  fetch,
  update
});

export default rootReducer;
