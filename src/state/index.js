import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import tasks from "./tasks";
import workflow from "./workflow";
import workflowConfig from "./workflowConfig";

const rootReducer = combineReducers({
  routing: routerReducer,
  tasks,
  workflow,
  workflowConfig
});

export default rootReducer;
