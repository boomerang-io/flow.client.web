import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import activity from "./activity";
import changeLog from "./changeLog";
import contactJoe from "./contactJoe";
import insights from "./insights";
import navbarLinks from "./navbarLinks";
import onBoard from "./onBoard";
import privacyStatement from "./privacyStatement";
import reportBug from "./reportBug";
import tasks from "./tasks";
import teams from "./teams";
import user from "./user";
import workflow from "./workflow";
import workflowExecution from "./workflowExecution";
import workflowExecutionActiveNode from "./workflowExecutionActiveNode";
import workflowRevision from "./workflowRevision";

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    activity,
    changeLog,
    contactJoe,
    insights,
    navbarLinks,
    onBoard,
    privacyStatement,
    reportBug,
    tasks,
    teams,
    user,
    workflow,
    workflowExecution,
    workflowExecutionActiveNode,
    workflowRevision
  });

export default rootReducer;
