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
  | "Callback"
  | "Editor"
  | "EditorDesigner"
  | "EditorConfigure"
  | "EditorConfigureGeneral"
  | "EditorConfigureTriggers"
  | "EditorConfigureRun"
  | "EditorConfigureParams"
  | "EditorConfigureWorkspaces"
  | "EditorTokens"
  | "EditorChangelog"
  | "EditorProperties"
  | "EditorSchedule"
  | "Execution"
  | "Home"
  | "Profile"
  | "Insights"
  | "Integrations"
  | "ManageTaskTemplates"
  | "ManageTaskTemplateDetail"
  | "ManageTaskTemplateEditor"
  | "ManageTeam"
  | "Properties"
  | "Schedules"
  | "Settings"
  | "TemplateWorkflows"
  | "TaskTemplates"
  | "TaskTemplateDetail"
  | "TaskTemplateEditor"
  | "ManageTeam"
  | "ManageTeamSettings"
  | "ManageTeamWorkflows"
  | "ManageTeamLabels"
  | "ManageTeamQuotas"
  | "ManageTeamApprovers"
  | "ManageTeamParameters"
  | "ManageTeamTokens"
  | "Tokens"
  | "TeamList"
  | "User"
  | "UserList"
  | "UserLabels"
  | "UserSettings"
  | "Workflows";

export const AppPath: Record<AppPathKey, string> = {
  Root: "/",
  Error: "/error",
  Activity: "/:team/activity",
  Actions: "/:team/actions",
  ActionsApprovals: "/:team/actions/approvals",
  ActionsManual: "/:team/actions/manual",
  Callback: "/callback",
  Editor: "/:team/editor/:workflowId",
  EditorDesigner: `/:team/editor/:workflowId/workflow`,
  EditorConfigure: `/:team/editor/:workflowId/configure`,
  EditorConfigureGeneral: `/:team/editor/:workflowId/configure/general`,
  EditorConfigureTriggers: `/:team/editor/:workflowId/configure/triggers`,
  EditorConfigureRun: `/:team/editor/:workflowId/configure/run`,
  EditorConfigureParams: `/:team/editor/:workflowId/configure/parameters`,
  EditorConfigureWorkspaces: `/:team/editor/:workflowId/configure/workspaces`,
  EditorTokens: `/:team/editor/:workflowId/tokens`,
  EditorChangelog: `/:team/editor/:workflowId/changelog`,
  EditorProperties: `/:team/editor/:workflowId/parameters`,
  EditorSchedule: `/:team/editor/:workflowId/schedule`,
  Execution: "/:team/activity/:workflowId/execution/:executionId",
  Home: "/home",
  Profile: "/profile",
  Insights: "/:team/insights",
  Integrations: "/:team/integrations",
  Workflows: "/:team/workflows",
  Schedules: "/:team/schedules",

  //Manage
  ManageTaskTemplates: `/:team/task-templates`,
  ManageTaskTemplateDetail: `/:team/task-templates/:name/:version`,
  ManageTaskTemplateEditor: `/:team/task-templates/:name/:version/editor`,
  ManageTeamParameters: `/:team/parameters`,
  ManageTeam: `/:team/manage`,
  ManageTeamTokens: "/:team/manage/tokens",
  ManageTeamSettings: "/:team/manage/settings",
  ManageTeamWorkflows: "/:team/manage/workflows",
  ManageTeamQuotas: "/:team/manage/quotas",
  ManageTeamLabels: "/:team/manage/labels",
  ManageTeamApprovers: `/:team/manage/approver-groups`,

  //admin
  Properties: "/admin/parameters",
  Settings: "/admin/settings",
  TemplateWorkflows: "/admin/template-workflows",
  TaskTemplates: "/admin/task-templates",
  TaskTemplateDetail: `/admin/task-templates/:name/:version`,
  TaskTemplateEditor: `/admin/task-templates/:name/:version/editor`,
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
interface TeamArg {
  team: string;
}

interface UserIdArg {
  userId: string
}

type TeamRouteArgs = WorkflowIdArg & TeamArg;
interface ManageTaskTemplateArgs {
  team: string;
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
  activity: ({ team }: TeamArg) => `/${team}/activity`,
  actions: ({ team }: TeamArg) => `/${team}/actions`,
  actionsApprovals: ({ team }: TeamArg) => `/${team}/actions/approvals`,
  actionsManual: ({ team }: TeamArg) => `/${team}/actions/manual`,
  editorDesigner: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/workflow`,
  editorConfigure: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure`,
  editorConfigureGeneral: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure/general`,
  editorConfigureTriggers: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure/triggers`,
  editorConfigureRun: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure/run`,
  editorConfigureParams: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure/parameters`,
  editorConfigureWorkspaces: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/configure/workspaces`,
  editorTokens: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/tokens`,
  editorChangelog: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/changelog`,
  editorProperties: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/parameters`,
  editorSchedule: ({ team, workflowId }: TeamRouteArgs) => `/${team}/editor/${workflowId}/schedule`,
  execution: ({ team, workflowId, executionId }: TeamArg & ExecutionArgs) => `/${team}/activity/${workflowId}/execution/${executionId}`,
  home: () => "/home",
  profile: () => "/profile",
  insights: ({ team }: TeamArg) => `/${team}/insights`,
  integrations: ({ team }: TeamArg) => `/${team}/integrations`,
  manageTaskTemplates: ({ team }: TeamArg) =>
    `/${team}/task-templates`,
  manageTaskTemplateEdit: ({ team, name, version }: ManageTaskTemplateArgs) =>
    `/${team}/task-templates/${name}/${version}`,
  manageTaskTemplateYaml: ({ team, name, version }: ManageTaskTemplateArgs) =>
    `/${team}/task-templates/${name}/${version}/editor`,
  manageTeam: ({ team }: TeamArg) => `/${team}/manage`,
  manageTeamApprovers: ({ team }: TeamArg) => `/${team}/manage/approver-groups`,
  manageTeamWorkflows: ({ team }: TeamArg) => `/${team}/manage/workflows`,
  manageTeamLabels: ({ team }: TeamArg) => `/${team}/manage/labels`,
  manageTeamQuotas: ({ team }: TeamArg) => `/${team}/manage/quotas`,
  manageTeamSettings: ({ team }: TeamArg) => `/${team}/manage/settings`,
  manageTeamTokens: ({ team }: TeamArg) => `/${team}/manage/tokens`,
  manageTeamParameters: ({ team }: TeamArg) => `/${team}/parameters`,
  manageUsers: () => "/admin/users",
  properties: () => "/admin/parameters",
  schedule: () => "/schedule",
  settings: () => "/admin/settings",
  templateWorkflows: () => "/admin/template-workflows",
  taskTemplates: () => "/admin/task-templates",
  adminTaskTemplateDetail: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}`,
  adminTaskTemplateEditor: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}/editor`,
  teamList: () => "/admin/teams",
  tokens: () => `/admin/tokens`,
  user: ({ userId }: UserIdArg) => `/admin/users/${userId}`,
  userLabels: ({ userId }: UserIdArg) => `/admin/users/${userId}/labels`,
  userSettings: ({ userId }: UserIdArg) => `/admin/users/${userId}/settings`,
  userList: () => "/admin/users",
  workflows: ({ team }: TeamArg) => `/${team}/workflows`,
  workflowActivity: ({ team, workflowId }: TeamRouteArgs) => `/${team}/activity?page=0&size=10&workflows=${workflowId}`,
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
