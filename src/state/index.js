import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";

import activity from "./activity";
import changeLog from "./changeLog";
import contactJoe from "./contactJoe";
import navbarLinks from "./navbarLinks";
import privacyStatement from "./privacyStatement";
import reportBug from "./reportBug";
import tasks from "./tasks";
import teams from "./teams";
import user from "./user";
import webhook from "./webhook";
import workflow from "./workflow";
import workflowExecution from "./workflowExecution";
import workflowExecutionActiveNode from "./workflowExecutionActiveNode";
import workflowRevision from "./workflowRevision";

const rootReducer = combineReducers({
  routing,
  activity,
  changeLog,
  contactJoe,
  navbarLinks,
  privacyStatement,
  reportBug,
  tasks,
  teams,
  user,
  webhook,
  workflow,
  workflowExecution,
  workflowExecutionActiveNode,
  workflowRevision
});

export default rootReducer;
