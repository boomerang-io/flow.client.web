import { combineReducers } from "redux";
import fetch from "./fetch";
import generate from "./generate";

const rootReducer = combineReducers({
  fetch,
  generate
});

export default rootReducer;
