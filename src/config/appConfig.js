// Look for the data injected into the HTML file from the Express app
// See server/app.js for implementation
export const APP_ROOT = window._SERVER_DATA && window._SERVER_DATA.APP_ROOT ? window._SERVER_DATA.APP_ROOT : "";

export const PLATFORM_VERSION =
  window._SERVER_DATA && window._SERVER_DATA.PLATFORM_VERSION ? window._SERVER_DATA.PLATFORM_VERSION : "";

export const appLink = {
  taskTemplateEdit: ({id, version}) => `/task-templates/${id}/${version}`,
  taskTemplateEditSettings: ({id, version}) => `/task-templates/edit/${id}/${version}/settings`,
  taskTemplateCreate: () => `/task-templates/create`,
};
