import { combineReducers } from "redux";
import app from "./app";
import globalConfiguration from "./globalConfiguration";
import importWorkflow from "./importWorkflow";
import insights from "./insights";
import navigation from "./navigation";
import onBoard from "./onBoard";
import tasks from "./tasks";
import teamProperties from "./teamProperties";
import teams from "./teams";
import user from "./user";
import workflow from "./workflow";
import workflowExecution from "./workflowExecution";
import workflowRevision from "./workflowRevision";

const rootReducer = () =>
  combineReducers({
    app,
    globalConfiguration,
    importWorkflow,
    insights,
    navigation,
    onBoard,
    tasks,
    teamProperties,
    teams,
    user,
    workflow,
    workflowExecution,
    workflowRevision,
  });

export default rootReducer;
