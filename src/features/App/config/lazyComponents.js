import { lazy } from "react";

export const AsyncActivity = lazy(() => import(/* webpackChunkName: "Activity" */ "Features/Activity"));
export const AsyncWorkflows = lazy(() => import(/* webpackChunkName: "Workflows" */ "Features/Workflows"));
export const AsyncDesigner = lazy(() => import(/* webpackChunkName: "Designer" */ "Features/Designer"));
export const AsyncInsights = lazy(() => import(/* webpackChunkName: "Insights" */ "Features/Insights"));
export const AsyncExecution = lazy(() => import(/* webpackChunkName: "Execution" */ "Features/Execution"));
export const AsyncGlobalConfiguration = lazy(() =>
  import(/* webpackChunkName: "GlobalConfiguration" */ "Features/GlobalConfiguration")
);
export const AsyncTeamProperties = lazy(() =>
  import(/* webpackChunkName: "TeamProperties" */ "Features/TeamProperties")
);
