import { lazy } from "react";

export const AsyncActivity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
export const AsyncEditor = lazy(() => import(/* webpackChunkName: "Editor =" */ "Features/Editor"));
export const AsyncExecution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
export const AsyncGlobalConfiguration = lazy(() =>
  import(/* webpackChunkName: "GlobalConfiguration" */ "Features/GlobalProperties")
);
export const AsyncInsights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
export const AsyncTaskTemplates = lazy(() => import(/* webpackChunkName: "Task Templates" */ "Features/TaskTemplates"));
export const AsyncTeamProperties = lazy(() =>
  import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties")
);
export const AsyncWorkflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));
