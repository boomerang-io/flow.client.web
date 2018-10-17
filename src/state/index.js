import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import nodes from "./nodes";
import workflow from "./workflow";
import tasks from "./tasks";
import taskConfig from "./taskConfig";

const rootReducer = combineReducers({
  routing: routerReducer,
  nodes,
  taskConfig,
  tasks,
  workflow
});

export default rootReducer;
