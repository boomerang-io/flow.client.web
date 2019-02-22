import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import activity from "./activity";
import app from "./app";
import changeLog from "./changeLog";
import contactJoe from "./contactJoe";
import importWorkflow from "./importWorkflow";
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
import workflowRevision from "./workflowRevision";

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    activity,
    app,
    changeLog,
    contactJoe,
    importWorkflow,
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
    workflowRevision
  });

export default rootReducer;
