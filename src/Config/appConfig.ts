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
  | "ManageTaskTemplatesTeam"
  | "ManageTaskTemplateEdit"
  | "ManageTaskTemplateYaml"
  | "Properties"
  | "Quotas"
  | "QuotasEdit"
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
  | "TeamList"
  | "TeamApprovers"
  | "TeamProperties"
  | "TeamTokens"
  | "Tokens"
  | "User"
  | "UserList"
  | "UserTeams"
  | "UserLabels"
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
  ManageTaskTemplatesTeam: `/:teamId/manage/task-templates/team/:teamId`,
  ManageTaskTemplateEdit: `/:teamId/manage/task-templates/team/:teamId/:taskId/:version`,
  ManageTaskTemplateYaml: `/:teamId/manage/task-templates/team/:teamId/:taskId/:version/yaml-editor`,
  TeamApprovers: `/:teamId/manage/approver-groups`,
  TeamProperties: `/:teamId/manage/team-parameters`,

  //Admin
  Properties: "/admin/parameters",
  Quotas: "/admin/quotas",
  QuotasEdit: "/admin/quotas/:teamId",
  Settings: "/admin/settings",
  TemplateWorkflows: "/admin/template-workflows",
  TaskTemplates: "/admin/task-templates",
  TaskTemplateEdit: `/admin/task-templates/:id/:version`,
  TaskTemplateYaml: `/admin/task-templates/:id/:version/yaml-editor`,
  Team: "/admin/teams/:teamId",
  TeamSettings: "/admin/teams/:teamId/settings",
  TeamWorkflows: "/admin/teams/:teamId/workflows",
  TeamLabels: "/admin/teams/:teamId/Labels",
  TeamList: "/admin/teams",
  Tokens: "/admin/tokens",
  User: "/admin/users/:userId",
  UserTeams: "/admin/users/:userId/teams",
  UserLabels: "/admin/users/:userId/labels",
  UserList: "/admin/users",
};

interface WorkflowIdArg {
  workflowId: string;
}
interface TeamIdArg {
  teamId: string;
}
interface ManageTaskTemplateArgs {
  teamId: string;
  taskId: string;
  version: string;
}
interface AdminTaskTemplateArgs {
  id: string;
  version: string;
}
interface ExecutionArgs {
  executionId: string;
  workflowId: string;
}

export const appLink: Record<string, (args?: any) => string> = {
  activity: ({ teamId }: TeamIdArg) => `/${teamId}/activity`,
  actions: ({ teamId }: TeamIdArg) => `/${teamId}/actions`,
  actionsApprovals: ({ teamId }: TeamIdArg) => `/${teamId}/actions/approvals`,
  actionsManual: ({ teamId }: TeamIdArg) => `/${teamId}/actions/manual`,
  editorDesigner: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/workflow`,
  editorConfigure: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/configure`,
  editorChangelog: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/changelog`,
  editorProperties: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/parameters`,
  editorSchedule: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/schedule`,
  execution: ({ executionId, workflowId }: ExecutionArgs) => `/activity/${workflowId}/execution/${executionId}`,
  home: () => "/home",
  insights: () => "/insights",
  manageTaskTemplates: ({ teamId }: TeamIdArg) => `/manage/task-templates/team/${teamId}`,
  manageTaskTemplateEdit: ({ teamId, taskId, version }: ManageTaskTemplateArgs) =>
    `/manage/task-templates/team/${teamId}/${taskId}/${version}`,
  manageTaskTemplateYaml: ({ teamId, taskId, version }: ManageTaskTemplateArgs) =>
    `/manage/task-templates/team/${teamId}/${taskId}/${version}/yaml-editor`,
  manageUsers: () => "/admin/users",
  properties: () => "/admin/parameters",
  quotas: () => "/admin/quotas",
  quotasEdit: ({ teamId }: TeamIdArg) => `/admin/quotas/${teamId}`,
  schedule: () => "/schedule",
  settings: () => "/admin/settings",
  templateWorkflows: () => "/admin/template-workflows",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ id, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${id}/${version}`,
  taskTemplateYaml: ({ id, version }: AdminTaskTemplateArgs) => `/admin/task-templates/${id}/${version}/yaml-editor`,
  teamApprovers: () => `/manage/approver-groups`,
  teamProperties: () => `/manage/team-parameters`,
  teamTaskTemplates: () => `/manage/task-templates`,
  team: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}`,
  teamWorkflows: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/workflows`,
  teamLabels: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/labels`,
  teamSettings: ({ teamId }: TeamIdArg) => `/admin/teams/${teamId}/settings`,
  teamList: () => "/admin/teams",
  teamTokens: () => `/manage/team-tokens`,
  tokens: () => `/admin/tokens`,
  user: ({ userId }) => `/admin/users/${userId}`,
  userTeams: ({ userId }) => `/admin/users/${userId}/teams`,
  userLabels: ({ userId }) => `/admin/users/${userId}/labels`,
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
