// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
import { Envs } from "Constants";
import { StringifyOptions } from "query-string";
export const APP_ROOT =
  window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "/BMRG_APP_ROOT_CONTEXT";

export const CORE_ENV_URL =
  window._SERVER_DATA && window._SERVER_DATA.CORE_ENV_URL ? window._SERVER_DATA.CORE_ENV_URL : "";

export const BASE_DOCUMENTATION_URL = "https://www.useboomerang.io/docs/boomerang-flow";

//@ts-ignore
export const isDevEnv = import.meta.env.MODE === Envs.Dev;
//@ts-ignore
export const isTestEnv = import.meta.env.MODE === Envs.Test;

type AppPathKey =
  | "Root"
  | "Error"
  | "Activity"
  | "Actions"
  | "ActionsApprovals"
  | "ActionsManual"
  | "Editor"
  | "EditorDesigner"
  | "EditorConfigure"
  | "EditorChangelog"
  | "EditorProperties"
  | "EditorSchedule"
  | "Execution"
  | "Home"
  | "Insights"
  | "ManageTaskTemplates"
  | "ManageTaskTemplateEdit"
  | "ManageTaskTemplateYaml"
  | "Properties"
  | "Schedules"
  | "Settings"
  | "TemplateWorkflows"
  | "TaskTemplates"
  | "TaskTemplateEdit"
  | "TaskTemplateYaml"
  | "Team"
  | "TeamSettings"
  | "TeamWorkflows"
  | "TeamLabels"
  | "TeamQuotas"
  | "TeamList"
  | "TeamApprovers"
  | "TeamProperties"
  | "TeamTokens"
  | "Tokens"
  | "User"
  | "UserList"
  | "UserLabels"
  | "UserSettings"
  | "Workflows";

export const AppPath: Record<AppPathKey, string> = {
  Root: "/",
  Error: "/error",
  Activity: "/:teamId/activity",
  Actions: "/:teamId/actions",
  ActionsApprovals: "/:teamId/actions/approvals",
  ActionsManual: "/:teamId/actions/manual",
  Editor: "/:teamId/editor/:workflowId",
  EditorDesigner: `/:teamId/editor/:workflowId/workflow`,
  EditorConfigure: `/:teamId/editor/:workflowId/configure`,
  EditorChangelog: `/:teamId/editor/:workflowId/changelog`,
  EditorProperties: `/:teamId/editor/:workflowId/parameters`,
  EditorSchedule: `/:teamId/editor/:workflowId/schedule`,
  Execution: "/:teamId/activity/:workflowId/execution/:executionId",
  Home: "/home",
  Insights: "/:teamId/insights",
  TeamTokens: "/:teamId/manage/team-tokens",
  Workflows: "/:teamId/workflows",
  Schedules: "/:teamId/schedules",

  //Manage
  ManageTaskTemplates: `/:teamId/manage/task-templates`,
  ManageTaskTemplateEdit: `/:teamId/manage/task-templates/:name/:version`,
  ManageTaskTemplateYaml: `/:teamId/manage/task-templates/:name/:version/yaml-editor`,
  TeamApprovers: `/:teamId/manage/approver-groups`,
  TeamProperties: `/:teamId/manage/team-parameters`,

  //Admin
  Properties: "/admin/parameters",
  Settings: "/admin/settings",
  TemplateWorkflows: "/admin/template-workflows",
  TaskTemplates: "/admin/task-templates",
  TaskTemplateEdit: `/admin/task-templates/:id/:version`,
  TaskTemplateYaml: `/admin/task-templates/:id/:version/yaml-editor`,
  Team: "/admin/teams/:teamId",
  TeamSettings: "/admin/teams/:teamId/settings",
  TeamWorkflows: "/admin/teams/:teamId/workflows",
  TeamQuotas: "/admin/teams/:teamId/quotas",
  TeamLabels: "/admin/teams/:teamId/Labels",
  TeamList: "/admin/teams",
  Tokens: "/admin/tokens",
  User: "/admin/users/:userId",
  UserLabels: "/admin/users/:userId/labels",
  UserSettings: "/admin/users/:userId/settings",
  UserList: "/admin/users",
};

interface WorkflowIdArg {
  workflowId: string;
}
interface TeamIdArg {
  teamId: string;
}

interface UserIdArg {
  userId: string
}

type TeamRouteArgs = WorkflowIdArg & TeamIdArg;
interface ManageTaskTemplateArgs {
  teamId: string;
  name: string;
  version: string;
}
interface AdminTaskTemplateArgs {
  name: string;
  version: string;
}
interface ExecutionArgs {
  executionId: string;
  workflowId: string;
}

export const appLink = {
  activity: ({ teamId }: TeamIdArg) => `/${teamId}/activity`,
  actions: ({ teamId }: TeamIdArg) => `/${teamId}/actions`,
  actionsApprovals: ({ teamId }: TeamIdArg) => `/${teamId}/actions/approvals`,
  actionsManual: ({ teamId }: TeamIdArg) => `/${teamId}/actions/manual`,
  editorDesigner: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/editor/${workflowId}/workflow`,
  editorConfigure: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/editor/${workflowId}/configure`,
  editorChangelog: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/editor/${workflowId}/changelog`,
  editorProperties: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/editor/${workflowId}/parameters`,
  editorSchedule: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/editor/${workflowId}/schedule`,
  execution: ({ executionId, workflowId }: ExecutionArgs) => `/activity/${workflowId}/execution/${executionId}`,
  home: () => "/home",
  insights: () => "/insights",
  manageTaskTemplates: ({ teamId }: TeamIdArg) => `/${teamId}/manage/task-templates`,
  manageTaskTemplateEdit: ({ teamId, name, version }: ManageTaskTemplateArgs) =>
    `/${teamId}/manage/task-templates/${name}/${version}`,
  manageTaskTemplateYaml: ({ teamId, name, version }: ManageTaskTemplateArgs) =>
    `/${teamId}/manage/task-templates/${name}/${version}/yaml-editor`,
  manageUsers: () => "/admin/users",
  properties: () => "/admin/parameters",
  schedule: () => "/schedule",
  settings: () => "/admin/settings",
  templateWorkflows: () => "/admin/template-workflows",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}`,
  taskTemplateYaml: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}/yaml-editor`,
  teamApprovers: () => `/manage/approver-groups`,
  teamProperties: () => `/manage/team-parameters`,
  team: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}`,
  teamWorkflows: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/workflows`,
  teamLabels: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/labels`,
  teamQuotas: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/quotas`,
  teamSettings: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/settings`,
  teamList: () => "/admin/teams",
  teamTokens: () => `/manage/team-tokens`,
  tokens: () => `/admin/tokens`,
  user: ({ userId }: UserIdArg) => `/admin/users/${userId}`,
  userLabels: ({ userId }: UserIdArg) => `/admin/users/${userId}/labels`,
  userSettings: ({ userId }: UserIdArg) => `/admin/users/${userId}/settings`,
  userList: () => "/admin/users",
  workflows: ({ teamId }: TeamIdArg) => `/${teamId}/workflows`,
  workflowActivity: ({ workflowId }: WorkflowIdArg) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
  //external apps
  docsWorkflowEditor: () => `${BASE_DOCUMENTATION_URL}/how-to-guide/workflow-editor`,
};

/**
 * new Feature Flags
 */
export enum FeatureFlag {
  ActivityEnabled = "ActivityEnabled",
  EditVerifiedTasksEnabled = "EditVerifiedTasksEnabled",
  GlobalParametersEnabled = "GlobalParametersEnabled",
  InsightsEnabled = "InsightsEnabled",
  TeamManagementEnabled = "TeamManagementEnabled",
  TeamParametersEnabled = "TeamParametersEnabled",
  TeamTasksEnabled = "TeamTasksEnabled",
  UserManagementEnabled = "UserManagementEnabled",
  WorkflowQuotasEnabled = "WorkflowQuotasEnabled",
  WorkflowTokensEnabled = "WorkflowTokensEnabled",
  WorkflowTriggersEnabled = "WorkflowTriggersEnabled",
}

export const queryStringOptions: StringifyOptions = { arrayFormat: "comma", skipEmptyString: true };
