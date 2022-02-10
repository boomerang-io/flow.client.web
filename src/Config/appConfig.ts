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
  | "TeamList"
  | "TeamApprovers"
  | "TeamProperties"
  | "TeamTokens"
  | "Tokens"
  | "User"
  | "UserList"
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
  TeamList: "/admin/teams",
  Tokens: "/admin/tokens",
  User: "/admin/users/:userId",
  UserList: "/admin/users",
};

export const appLink: Record<string, (args?: any) => string> = {
  activity: () => `/activity`,
  actions: () => `/actions`,
  actionsApprovals: () => `/actions/approvals`,
  actionsManual: () => `/actions/manual`,
  editorDesigner: ({ workflowId }) => `/editor/${workflowId}/workflow`,
  editorConfigure: ({ workflowId }) => `/editor/${workflowId}/configure`,
  editorChangelog: ({ workflowId }) => `/editor/${workflowId}/changelog`,
  editorProperties: ({ workflowId }) => `/editor/${workflowId}/parameters`,
  editorSchedule: ({ workflowId }) => `/editor/${workflowId}/schedule`,
  execution: ({ executionId, workflowId }) => `/activity/${workflowId}/execution/${executionId}`,
  insights: () => "/insights",
  manageTaskTemplates: ({ teamId }) => `/manage/task-templates/team/${teamId}`,
  manageTaskTemplateEdit: ({ teamId, taskId, version }) => `/manage/task-templates/team/${teamId}/${taskId}/${version}`,
  manageTaskTemplateYaml: ({ teamId, taskId, version }) =>
    `/manage/task-templates/team/${teamId}/${taskId}/${version}/yaml-editor`,
  manageUsers: () => "/admin/users",
  properties: () => "/admin/parameters",
  quotas: () => "/admin/quotas",
  quotasEdit: ({ teamId }) => `/admin/quotas/${teamId}`,
  schedule: () => "/schedule",
  settings: () => "/admin/settings",
  systemWorkflows: () => "/admin/system-workflows",
  systemManagementWorkflows: () => "/admin/system-workflows/system",
  templateWorkflows: () => "/admin/system-workflows/templates",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ id, version }) => `/admin/task-templates/${id}/${version}`,
  taskTemplateYaml: ({ id, version }) => `/admin/task-templates/${id}/${version}/yaml-editor`,
  teamApprovers: () => `/manage/approver-groups`,
  teamProperties: () => `/manage/team-parameters`,
  teamTaskTemplates: () => `/manage/task-templates`,
  team: ({ teamId }) => `/admin/teams/${teamId}`,
  teamWorkflows: ({ teamId }) => `/admin/teams/${teamId}/workflows`,
  teamSettings: ({ teamId }) => `/admin/teams/${teamId}/settings`,
  teamList: () => "/admin/teams",
  teamTokens: () => `/manage/team-tokens`,
  tokens: () => `/admin/tokens`,
  userList: () => "/admin/users",
  workflows: () => "/workflows",
  workflowsMine: () => "/workflows/mine",
  workflowsTeams: () => "/workflows/teams",
  workflowActivity: ({ workflowId }) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
  //external apps
  docsWorkflowEditor: () => `${BASE_DOCUMENTATION_URL}/how-to-guide/workflow-editor`,
};

export const queryStringOptions: StringifyOptions = { arrayFormat: "comma", skipEmptyString: true };

export const FeatureFlag: Record<string, string> = {
  /**
   * new Feature Flags
   */
  ActivityEnabled: "ActivityEnabled",
  EditVerifiedTasksEnabled: "EditVerifiedTasksEnabled",
  GlobalParametersEnabled: "GlobalParametersEnabled",
  InsightsEnabled: "InsightsEnabled",
  TeamManagementEnabled: "TeamManagementEnabled",
  TeamParametersEnabled: "TeamParametersEnabled",
  TeamTasksEnabled: "TeamTasksEnabled",
  UserManagementEnabled: "UserManagementEnabled",
  WorkflowQuotasEnabled: "WorkflowQuotasEnabled",
  WorkflowTokensEnabled: "WorkflowTokensEnabled",
  WorkflowTriggersEnabled: "WorkflowTriggersEnabled",
};
