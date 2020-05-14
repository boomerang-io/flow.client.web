// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT = window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "local";

export const PLATFORM_VERSION =
  window._SERVER_DATA && window._SERVER_DATA.PLATFORM_VERSION ? window._SERVER_DATA.PLATFORM_VERSION : "";

export const appPath = {
  root: APP_ROOT,
  error: "/error",
  activity: "/activity",
  editor: "/editor/:workflowId",
  execution: "/activity/:workflowId/execution/:executionId",
  insights: "/insights",
  properties: "/properties",
  taskTemplates: "/task-templates",
  teamProperties: `/team-properties`,
  workflows: "/workflows"
};

export const appLink = {
  designer: ({ workflowId }) => `/editor/${workflowId}/designer`,
  taskTemplateEdit: ({ id, version }) => `/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({ id, version }) => `/task-templates/edit/${id}/${version}/settings`,
  taskTemplateCreate: () => `/task-templates/create`
};
