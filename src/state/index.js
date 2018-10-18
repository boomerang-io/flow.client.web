import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import nodes from "./nodes";
import tasks from "./tasks";
import workflow from "./workflow";
import workflowConfig from "./workflowConfig";

const rootReducer = combineReducers({
  routing: routerReducer,
  nodes,
  tasks,
  workflow,
  workflowConfig
});

export default rootReducer;
