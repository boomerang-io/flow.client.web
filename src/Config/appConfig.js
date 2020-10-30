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

export const CORE_ENV_URL =
  window._SERVER_DATA && window._SERVER_DATA.CORE_ENV_URL ? window._SERVER_DATA.CORE_ENV_URL : "";

export const isDevEnv = process.env.NODE_ENV === "development";
export const isTestEnv = process.env.NODE_ENV === "test";

export const AppPath = {
  Root: "/",
  Error: "/error",
  Activity: "/activity",
  Editor: "/teams/:teamId/editor/:workflowId",
  EditorDesigner: `/teams/:teamId/editor/:workflowId/workflow`,
  EditorConfigure: `/teams/:teamId/editor/:workflowId/configure`,
  EditorChangelog: `/teams/:teamId/editor/:workflowId/changelog`,
  EditorProperties: `/teams/:teamId/editor/:workflowId/properties`,
  Execution: "/activity/:workflowId/execution/:executionId",
  Insights: "/insights",
  Properties: "/admin/properties",
  Quotas: "/admin/quotas",
  QuotasEdit: "/admin/quotas/:teamId",
  Settings: "/admin/settings",
  TaskTemplates: "/admin/task-templates",
  TaskTemplateEdit: `/admin/task-templates/:id/:version`,
  Team: "/admin/teams/:teamId",
  TeamSettings: "/admin/teams/:teamId/settings",
  TeamWorkflows: "/admin/teams/:teamId/workflows",
  TeamList: "/admin/teams",
  TeamProperties: `/team-properties`,
  User: "/admin/users/:userId",
  UserList: "/admin/users",
  Workflows: "/workflows",
};

export const appLink = {
  activity: () => `/activity`,
  editor: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}`,
  editorDesigner: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/workflow`,
  editorConfigure: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/configure`,
  editorChangelog: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/changelog`,
  editorProperties: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/properties`,
  execution: ({ executionId, workflowId }) => `/activity/${workflowId}/execution/${executionId}`,
  insights: () => "/insights",
  properties: () => "/admin/properties",
  manageUsers: () => "/admin/users",
  quotas: () => "/admin/quotas",
  quotasEdit: ({ teamId }) => `/admin/quotas/${teamId}`,
  settings: () => "/admin/settings",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ id, version }) => `/admin/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/admin/task-templates/edit/${id}/${version}/settings`,
  teamProperties: () => `/team-properties`,
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
  StandaloneModeEnabled: "standaloneModeEnabled",
};
