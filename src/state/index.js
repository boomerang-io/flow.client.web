import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import contactJoe from "./contactJoe";
import privacyStatement from "./privacyStatement";
import reportBug from "./reportBug";
import tasks from "./tasks";
import workflow from "./workflow";
import workflowConfig from "./workflowConfig";

const rootReducer = combineReducers({
  routing: routerReducer,
  contactJoe,
  privacyStatement,
  reportBug,
  tasks,
  workflow,
  workflowConfig
});

export default rootReducer;
