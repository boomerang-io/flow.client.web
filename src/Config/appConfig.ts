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
  | "Profile"
  | "Insights"
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
  | "ManageTeamProperties"
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
  Profile: "/profile",
  Insights: "/:teamId/insights",
  Workflows: "/:teamId/workflows",
  Schedules: "/:teamId/schedules",

  //Manage
  ManageTaskTemplates: `/:teamId/task-templates`,
  ManageTaskTemplateDetail: `/:teamId/task-templates/:name/:version`,
  ManageTaskTemplateEditor: `/:teamId/task-templates/:name/:version/editor`,
  ManageTeamTokens: "/:teamId/tokens",
  ManageTeamProperties: `/:teamId/parameters`,
  ManageTeam: `/:teamId/manage`,
  ManageTeamSettings: "/:teamId/manage/settings",
  ManageTeamWorkflows: "/:teamId/manage/workflows",
  ManageTeamQuotas: "/:teamId/manage/quotas",
  ManageTeamLabels: "/:teamId/manage/Labels",
  ManageTeamApprovers: `/:teamId/manage/approver-groups`,

  //Admin
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
  profile: () => "/profile",
  insights: () => "/insights",
  manageTaskTemplates: ({ teamId }: TeamIdArg) =>
    `/${teamId}/task-templates`,
  manageTaskTemplateEdit: ({ teamId, name, version }: ManageTaskTemplateArgs) =>
    `/${teamId}/task-templates/${name}/${version}`,
  manageTaskTemplateYaml: ({ teamId, name, version }: ManageTaskTemplateArgs) =>
    `/${teamId}/task-templates/${name}/${version}/editor`,
  manageTeam: ({ teamId }: TeamIdArg) => `/${teamId}/manage`,
  manageTeamApprovers: ({ teamId }: TeamIdArg) => `/${teamId}/manage/approver-groups`,
  manageTeamWorkflows: ({ teamId }: TeamIdArg) => `/${teamId}/manage/workflows`,
  manageTeamLabels: ({ teamId }: TeamIdArg) => `/${teamId}/manage/labels`,
  manageTeamQuotas: ({ teamId }: TeamIdArg) => `/${teamId}/manage/quotas`,
  manageTeamSettings: ({ teamId }: TeamIdArg) => `/${teamId}/manage/settings`,
  manageTeamTokens: ({ teamId }: TeamIdArg) => `/${teamId}/tokens`,
  manageTeamParameters: ({ teamId }: TeamIdArg) => `/${teamId}/parameters`,
  manageUsers: () => "/admin/users",
  properties: () => "/admin/parameters",
  schedule: () => "/schedule",
  settings: () => "/admin/settings",
  templateWorkflows: () => "/admin/template-workflows",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateDetail: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}`,
  taskTemplateEditor: ({ name, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${name}/${version}/editor`,
  teamList: () => "/admin/teams",
  tokens: () => `/admin/tokens`,
  user: ({ userId }: UserIdArg) => `/admin/users/${userId}`,
  userLabels: ({ userId }: UserIdArg) => `/admin/users/${userId}/labels`,
  userSettings: ({ userId }: UserIdArg) => `/admin/users/${userId}/settings`,
  userList: () => "/admin/users",
  workflows: ({ teamId }: TeamIdArg) => `/${teamId}/workflows`,
  workflowActivity: ({ teamId, workflowId }: TeamRouteArgs) => `/${teamId}/activity?page=0&size=10&workflows=${workflowId}`,
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
