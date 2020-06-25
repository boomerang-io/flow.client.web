// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT = window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "local";

export const PLATFORM_VERSION =
  window._SERVER_DATA && window._SERVER_DATA.PLATFORM_VERSION ? window._SERVER_DATA.PLATFORM_VERSION : "";

export const appPath = {
  root: APP_ROOT,
  error: "/error",
  activity: "/activity",
  editor: "/teams/:teamId/editor/:workflowId",
  editorDesigner: `/teams/:teamId/editor/:workflowId/workflow`,
  editorConfigure: `/teams/:teamId/editor/:workflowId/configure`,
  editorChangelog: `/teams/:teamId/editor/:workflowId/changelog`,
  editorProperties: `/teams/:teamId/editor/:workflowId/properties`,
  execution: "/activity/:workflowId/execution/:executionId",
  insights: "/insights",
  properties: "/properties",
  taskTemplates: "/task-templates",
  teamProperties: `/team-properties`,
  workflows: "/workflows",
};

export const appLink = {
  activity: () => `/activity`,
  editor: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}`,
  editorDesigner: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/workflow`,
  editorConfigure: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/configure`,
  editorChangelog: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/changelog`,
  editorProperties: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/properties`,
  execution: ({ executionId, workflowId }) => `/activity/${workflowId}/execution/${executionId}`,
  properties: () => "/properties",
  taskTemplates: () => `/task-templates`,
  taskTemplateEdit: ({ id, version }) => `/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/task-templates/edit/${id}/${version}/settings`,
  teamProperties: () => `team-properties`,
  workflows: () => "/workflows",
  workflowActivity: ({ workflowId }) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
};

export const queryStringOptions = { arrayFormat: "comma", skipEmptyString: true };
