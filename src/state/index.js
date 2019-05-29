import { combineReducers } from "redux";
import activity from "./activity";
import app from "./app";
import changeLog from "./changeLog";
import importWorkflow from "./importWorkflow";
import insights from "./insights";
import navigation from "./navigation";
import onBoard from "./onBoard";
import tasks from "./tasks";
import teams from "./teams";
import user from "./user";
import workflow from "./workflow";
import workflowExecution from "./workflowExecution";
import workflowRevision from "./workflowRevision";

const rootReducer = () =>
  combineReducers({
    activity,
    app,
    changeLog,
    importWorkflow,
    insights,
    navigation,
    onBoard,
    tasks,
    teams,
    user,
    workflow,
    workflowExecution,
    workflowRevision
  });

export default rootReducer;
