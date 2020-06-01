import portForwardMap from "../setupPortForwarding";
import axios, { CancelToken } from "axios";

export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL : "/api";

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL : "/api";

const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

/**
 * if port forwarding is enabled, then check to see if service is in config map
 * If it is, set the url request to be only the serviceContextPath
 * CRA will proxy the request as seen in setupProxy.js
 * @param {string} baseUrl - base of the serivce url
 * @param {sring} serviceContextPath - additional path for the service context e.g. /admin
 */
function determineUrl(baseUrl, serviceContextPath) {
  if (REACT_APP_PORT_FORWARD && portForwardMap[serviceContextPath]) {
    return serviceContextPath;
  } else {
    return baseUrl;
  }
}

// Standard
export const BASE_URL = BASE_SERVICE_ENV_URL;
export const BASE_SERVICE_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/flow");
export const BASE_USERS_URL = determineUrl(BASE_SERVICE_ENV_URL, "/users");
export const BASE_TEAMS_URL = `${BASE_SERVICE_URL}/teams`;

// Profile image
export const IMG_URL = `${BASE_USERS_URL}/image`;

// Teams
export const TEAMS_USER_URL = (email) => `${BASE_TEAMS_URL}?userEmail=${email}`;
export const TEAM_PROPERTIES_ID_URL = (ciTeamId) => `${BASE_TEAMS_URL}/${ciTeamId}/properties`;
export const TEAM_PROPERTIES_ID_PROPERTY_ID_URL = (ciTeamId, configurationId) =>
  `${BASE_TEAMS_URL}/${ciTeamId}/properties/${configurationId}`;

export const HTTP_METHODS = {
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  GET: "get",
};

export const serviceUrl = {
  deleteArchiveTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}`,
  getActivitySummary: ({ query }) => `${BASE_SERVICE_URL}/activity/summary?${query}`,
  getActivityStatusSummary: ({ query }) => `${BASE_SERVICE_URL}/activity/summary?${query}`,
  getActivity: ({ query }) => `${BASE_SERVICE_URL}/activity?${query}`,
  getGlobalConfiguration: () => `${BASE_SERVICE_URL}/config`,
  getGlobalProperty: ({ id }) => `${BASE_SERVICE_URL}/config/${id}`,
  getInsights: ({ query }) => `${BASE_SERVICE_URL}/insights?${query}`,

  getNavigation: () => `${BASE_USERS_URL}/navigation`,
  getTaskTemplates: () => `${BASE_SERVICE_URL}/tasktemplate`,
  getTeams: () => `${BASE_SERVICE_URL}/teams`,
  getTeamProperty: ({ teamId, configurationId }) => `${BASE_SERVICE_URL}/teams/${teamId}/properties/${configurationId}`,
  getTeamProperties: ({ id }) => `${BASE_SERVICE_URL}/teams/${id}/properties`,
  getUserTeams: ({ email }) => `${BASE_TEAMS_URL}?userEmail=${email}`,
  getUserProfile: () => `${BASE_USERS_URL}/profile`,
  getWorkflow: ({ id }) => `${BASE_SERVICE_URL}/workflow/${id}`,
  getWorkflowChangelog: ({ workflowId }) =>
    `${BASE_SERVICE_URL}/workflow/${workflowId}/changelog?sort=version&order=DESC`,
  getWorkflowImport: ({ query }) => `${BASE_SERVICE_URL}/workflow/import?${query}`,
  getWorkflowExecution: ({ executionId }) => `${BASE_SERVICE_URL}/activity/${executionId}`,
  getWorkflowExecutionLog: ({ flowActivityId, flowTaskId }) =>
    `${BASE_SERVICE_URL}/activity/${flowActivityId}/log/${flowTaskId}`,
  getWorkflowRevision: ({ workflowId, revisionNumber }) =>
    `${BASE_SERVICE_URL}/workflow/${workflowId}/revision${revisionNumber ? "/" + revisionNumber : ""}`,
  getWorkflowSummary: ({ workflowId }) => `${BASE_SERVICE_URL}/workflow/${workflowId}/summary`,
  patchUpdateWorkflowProperties: ({ workflowId }) => `${BASE_SERVICE_URL}/workflow/${workflowId}/properties`,
  patchUpdateWorkflowSummary: () => `${BASE_SERVICE_URL}/workflow`,
  postCreateWorkflow: () => `${BASE_SERVICE_URL}/workflow`,
  postCreateWorkflowRevision: ({ workflowId }) => `${BASE_SERVICE_URL}/workflow/${workflowId}/revision`,
  postCreateWorkflowToken: ({ workflowId }) => `${BASE_SERVICE_URL}/workflow/${workflowId}/webhook-token`,
  postExecuteWorkflow: ({ id }) => `${BASE_SERVICE_URL}/execute/${id}`,
  postImportWorkflow: ({ query }) => `${BASE_SERVICE_URL}/workflow/import?${query}`,
  restoreTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}/activate`,
};

export const cancellableResolver = ({ url, method, body, ...config }) => {
  // Create a new CancelToken source for this request
  const source = CancelToken.source();
  const promise = axios({
    ...config,
    method,
    url,
    data: body,
    cancelToken: source.token,
  });
  return { promise, cancel: () => source.cancel("cancel") };
};

export const resolver = {
  query: (url) => () => axios.get(url).then((response) => response.data),
  postMutation: (request) => axios.post(request),
  patchMutation: (request) => axios.patch(request),
  putMutation: (request) => axios.put(request),
  deleteArchiveTaskTemplate: ({ id }) => axios.delete(serviceUrl.deleteArchiveTaskTemplate({ id })),
  deleteGlobalPropertyRequest: ({ id }) => axios.delete(serviceUrl.getGlobalProperty({ id })),
  deleteTeamPropertyRequest: ({ teamId, configurationId }) =>
    axios.delete(serviceUrl.getTeamProperty({ teamId, configurationId })),
  patchGlobalPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalProperty({ id }), body, method: HTTP_METHODS.PATCH }),
  patchTeamPropertyRequest: ({ teamId, configurationId, body }) =>
    cancellableResolver({
      url: serviceUrl.getTeamProperty({ teamId, configurationId }),
      body,
      method: HTTP_METHODS.PATCH,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  postAddService: ({ body }) =>
    cancellableResolver({ url: serviceUrl.postAddService(), body, method: HTTP_METHODS.POST }),
  postCreateWorkflow: ({ body }) => axios.post(serviceUrl.postCreateWorkflow(), body),
  postCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.post(serviceUrl.postCreateWorkflowRevision({ workflowId }), body),
  postCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HTTP_METHODS.POST }),
  putCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HTTP_METHODS.PUT }),
  postGlobalPropertyRequest: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalConfiguration(), body, method: HTTP_METHODS.POST }),
  putRestoreTaskTemplate: ({ id }) => axios.put(serviceUrl.restoreTaskTemplate({ id })),
  deleteWorkflow: ({ id }) => axios.delete(serviceUrl.getWorkflow({ id })),
  postExecuteWorkflow: ({ id, properties }) => axios.post(serviceUrl.postExecuteWorkflow({ id }), { properties }),
  postImportWorkflow: ({ query, body }) => axios.post(serviceUrl.getWorkflowImport({ query }), body),
  postTeamPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamProperties({ id }), body, method: HTTP_METHODS.POST }),
};
