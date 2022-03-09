// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
import { StringifyOptions } from "query-string";
export const APP_ROOT =
  window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "/BMRG_APP_ROOT_CONTEXT";

export const CORE_ENV_URL =
  window._SERVER_DATA && window._SERVER_DATA.CORE_ENV_URL ? window._SERVER_DATA.CORE_ENV_URL : "";

export const BASE_DOCUMENTATION_URL = "https://www.useboomerang.io/docs/boomerang-flow";

export const isDevEnv = process.env.NODE_ENV === "development";
export const isTestEnv = process.env.NODE_ENV === "test";

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
  | "SystemWorkflows"
  | "SystemManagementWorkflows"
  | "TemplatesWorkflows"
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
  | "Workflows"
  | "WorkflowsMine"
  | "WorkflowsTeams";

export const AppPath: Record<AppPathKey, string> = {
  Root: "/",
  Error: "/error",
  Activity: "/activity",
  Actions: "/actions",
  ActionsApprovals: "/actions/approvals",
  ActionsManual: "/actions/manual",
  Editor: "/editor/:workflowId",
  EditorDesigner: `/editor/:workflowId/workflow`,
  EditorConfigure: `editor/:workflowId/configure`,
  EditorChangelog: `/editor/:workflowId/changelog`,
  EditorProperties: `/editor/:workflowId/parameters`,
  EditorSchedule: `/editor/:workflowId/schedule`,
  Execution: "/activity/:workflowId/execution/:executionId",
  Insights: "/insights",
  TeamTokens: "/manage/team-tokens",
  Workflows: "/workflows",
  WorkflowsMine: "/workflows/mine",
  WorkflowsTeams: "/workflows/teams",

  //Manage
  ManageTaskTemplates: `/manage/task-templates`,
  ManageTaskTemplatesTeam: `/manage/task-templates/team/:teamId`,
  ManageTaskTemplateEdit: `/manage/task-templates/team/:teamId/:taskId/:version`,
  ManageTaskTemplateYaml: `/manage/task-templates/team/:teamId/:taskId/:version/yaml-editor`,
  TeamApprovers: `/manage/approver-groups`,
  TeamProperties: `/manage/team-parameters`,

  //Admin
  Properties: "/admin/parameters",
  Quotas: "/admin/quotas",
  QuotasEdit: "/admin/quotas/:teamId",
  Schedules: "/schedules",
  Settings: "/admin/settings",
  SystemWorkflows: "/admin/system-workflows",
  SystemManagementWorkflows: "/admin/system-workflows/system",
  TemplatesWorkflows: "/admin/system-workflows/templates",
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
  activity: () => `/activity`,
  actions: () => `/actions`,
  actionsApprovals: () => `/actions/approvals`,
  actionsManual: () => `/actions/manual`,
  editorDesigner: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/workflow`,
  editorConfigure: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/configure`,
  editorChangelog: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/changelog`,
  editorProperties: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/parameters`,
  editorSchedule: ({ workflowId }: WorkflowIdArg) => `/editor/${workflowId}/schedule`,
  execution: ({ executionId, workflowId }: ExecutionArgs) => `/activity/${workflowId}/execution/${executionId}`,
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
  systemWorkflows: () => "/admin/system-workflows",
  systemManagementWorkflows: () => "/admin/system-workflows/system",
  templateWorkflows: () => "/admin/system-workflows/templates",
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
  workflows: () => "/workflows",
  workflowsMine: () => "/workflows/mine",
  workflowsTeams: () => "/workflows/teams",
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
