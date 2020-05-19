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
  execution: "/activity/:workflowId/execution/:executionId",
  insights: "/insights",
  properties: "/properties",
  taskTemplates: "/task-templates",
  teamProperties: `/team-properties`,
  workflows: "/workflows",
};

export const appLink = {
  activity: () => `/activity`,
  designer: ({ teamId, workflowId }) => `/teams/${teamId}/editor/${workflowId}/designer`,
  execution: ({ executionId, workflowId }) => `/activity/${workflowId}/execution/${executionId}`,
  taskTemplateEdit: ({ id, version }) => `/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/task-templates/edit/${id}/${version}/settings`,
  taskTemplateCreate: () => `/task-templates/create`,
  workflows: () => "/workflows",
  workflowActivity: ({ workflowId }) => `/activity?page=0&size=10&workflowIds=${workflowId}`,
};
