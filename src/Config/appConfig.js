// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT =
  window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "/BMRG_APP_ROOT_CONTEXT";

export const PRODUCT_STANDALONE =
  window._SERVER_DATA && window._SERVER_DATA.PRODUCT_STANDALONE
    ? window._SERVER_DATA.PRODUCT_STANDALONE === "true"
    : process.env.REACT_APP_PRODUCT_STANDALONE
    ? true
    : false;

export const EMBEDDED_MODE =
  window._SERVER_DATA && window._SERVER_DATA.EMBEDDED_MODE
    ? window._SERVER_DATA.EMBEDDED_MODE === "true"
    : process.env.REACT_APP_EMBEDDED_MODE
    ? true
    : true;

export const CORE_ENV_URL =
  window._SERVER_DATA && window._SERVER_DATA.CORE_ENV_URL ? window._SERVER_DATA.CORE_ENV_URL : "";

export const BASE_DOCUMENTATION_URL = PRODUCT_STANDALONE
  ? "https://www.useboomerang.io/docs/boomerang-flow"
  : `${CORE_ENV_URL}/docs/boomerang-flow`;

export const isDevEnv = process.env.NODE_ENV === "development";
export const isTestEnv = process.env.NODE_ENV === "test";

export const AppPath = {
  Root: "/",
  Error: "/error",
  Activity: "/activity",
  Editor: "/editor/:workflowId",
  EditorDesigner: `/editor/:workflowId/workflow`,
  EditorConfigure: `editor/:workflowId/configure`,
  EditorChangelog: `/editor/:workflowId/changelog`,
  EditorProperties: `/editor/:workflowId/parameters`,
  Execution: "/activity/:workflowId/execution/:executionId",
  Insights: "/insights",
  Properties: "/admin/parameters",
  Quotas: "/admin/quotas",
  QuotasEdit: "/admin/quotas/:teamId",
  Settings: "/admin/settings",
  SystemWorkflows: "/admin/system-workflows",
  TaskTemplates: "/admin/task-templates",
  TaskTemplateEdit: `/admin/task-templates/:id/:version`,
  Team: "/admin/teams/:teamId",
  TeamSettings: "/admin/teams/:teamId/settings",
  TeamWorkflows: "/admin/teams/:teamId/workflows",
  TeamList: "/admin/teams",
  TeamProperties: `/team-parameters`,
  User: "/admin/users/:userId",
  UserList: "/admin/users",
  Workflows: "/workflows",
};

export const appLink = {
  activity: () => `/activity`,
  editorDesigner: ({ workflowId }) => `/editor/${workflowId}/workflow`,
  editorConfigure: ({ workflowId }) => `/editor/${workflowId}/configure`,
  editorChangelog: ({ workflowId }) => `/editor/${workflowId}/changelog`,
  editorProperties: ({ workflowId }) => `/editor/${workflowId}/parameters`,
  execution: ({ executionId, workflowId }) => `/activity/${workflowId}/execution/${executionId}`,
  insights: () => "/insights",
  properties: () => "/admin/parameters",
  manageUsers: () => "/admin/users",
  quotas: () => "/admin/quotas",
  quotasEdit: ({ teamId }) => `/admin/quotas/${teamId}`,
  settings: () => "/admin/settings",
  systemWorkflows: () => "/admin/system-workflows",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ id, version }) => `/admin/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/admin/task-templates/edit/${id}/${version}/settings`,
  teamProperties: () => `/team-parameters`,
  teamTaskTemplates: (teamId) => `/task-templates`,
  team: ({ teamId }) => `/admin/teams/${teamId}`,
  teamWorkflows: ({ teamId }) => `/admin/teams/${teamId}/workflows`,
  teamSettings: ({ teamId }) => `/admin/teams/${teamId}/settings`,
  teamList: () => "/admin/teams",
  workflows: () => "/workflows",
  workflowActivity: ({ workflowId }) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
};

export const queryStringOptions = { arrayFormat: "comma", skipEmptyString: true };

export const FeatureFlag = {
  /**
   * new Feature Flags
   */
  TeamManagementEnabled: "TeamManagementEnabled",
  WorkflowQuotasEnabled: "WorkflowQuotasEnabled",
  SettingsEnabled: "SettingsEnabled",
  UserManagementEnabled: "UserManagementEnabled",
  GlobalParametersEnabled: "GlobalParametersEnabled",
  WorkflowTokensEnabled: "WorkflowTokensEnabled",
  TaskManagerEnabled: "TaskManagerEnabled",
  EditVerifiedTasksEnabled: "EditVerifiedTasksEnabled",
  WorkflowTriggersEnabled: "WorkflowTriggersEnabled",
  TeamParametersEnabled: "TeamParametersEnabled",

  ActivityEnabled: "ActivityEnabled",
  InsightsEnabled: "InsightsEnabled",
};
