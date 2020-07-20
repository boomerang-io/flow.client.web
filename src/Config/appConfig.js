// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT =
  window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "BMRG_APP_ROOT_CONTEXT";

export const PLATFORM_VERSION =
  window._SERVER_DATA && window._SERVER_DATA.PLATFORM_VERSION ? window._SERVER_DATA.PLATFORM_VERSION : "";

export const AppPath = {
  Root: APP_ROOT,
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
  TaskTemplates: "/admin/task-templates",
  Teams: "/admin/teams",
  TeamProperties: `/team-properties`,
  Users: "/admin/users",
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
  quotas: () => "/admin/quotas",
  taskTemplates: () => "/admin/task-templates",
  taskTemplateEdit: ({ id, version }) => `/admin/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/admin/task-templates/edit/${id}/${version}/settings`,
  teamProperties: () => `/team-properties`,
  teamTaskTemplates: (teamId) => `/task-templates`,
  teams: () => "/admin/teams",
  users: () => "/admin/users",
  workflows: () => "/workflows",
  workflowActivity: ({ workflowId }) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
};

export const queryStringOptions = { arrayFormat: "comma", skipEmptyString: true };

export const FeatureFlag = {
  Standalone: "standalone",
};
