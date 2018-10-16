import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import taskReducer from "./tasks";
import nodeReducer from "./nodes";

const rootReducer = combineReducers({
  routing: routerReducer,
  tasks: taskReducer,
  nodes: nodeReducer
});

export default rootReducer;
