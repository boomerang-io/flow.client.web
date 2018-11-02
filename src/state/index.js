import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import activityActiveNode from "./activityActiveNode";
import contactJoe from "./contactJoe";
import navbarLinks from "./navbarLinks";
import privacyStatement from "./privacyStatement";
import reportBug from "./reportBug";
import tasks from "./tasks";
import teams from "./teams";
import user from "./user";
import workflow from "./workflow";
import workflowConfig from "./workflowConfig";

const rootReducer = combineReducers({
  routing: routerReducer,
  activityActiveNode,
  contactJoe,
  navbarLinks,
  privacyStatement,
  reportBug,
  tasks,
  teams,
  user,
  workflow,
  workflowConfig
});

export default rootReducer;
