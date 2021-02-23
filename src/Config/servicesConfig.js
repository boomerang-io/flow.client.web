import portForwardMap from "../setupPortForwarding";
import axios, { CancelToken } from "axios";
import { HttpMethod } from "Constants";

export const CORE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.CORE_SERVICE_ENV_URL : "/api";

export const PRODUCT_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL : "/api";

const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

/**
 * if port forwarding is enabled, then check to see if service is in config map
 * If it is, set the url request to be only the serviceContextPath so the url is relativet to the root of the app
 * CRA will proxy the request as seen in setupProxy.js
 * @param {string} baseUrl - base of the serivce url
 * @param {sring} serviceContextPath - additional path for the service context e.g. /admin
 */
function determineUrl(baseUrl, serviceContextPath) {
  if (REACT_APP_PORT_FORWARD && portForwardMap[serviceContextPath]) {
    return serviceContextPath;
  } else {
    return baseUrl + serviceContextPath;
  }
}

export const BASE_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/workflow");
export const BASE_CORE_URL = CORE_SERVICE_ENV_URL;
export const BASE_CORE_USERS_URL = determineUrl(CORE_SERVICE_ENV_URL, "/users");

export const serviceUrl = {
  deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}`,
  getActivitySummary: ({ query }) => `${BASE_URL}/activity/summary${query ? "?" + query : ""}`,
  getActivity: ({ query }) => `${BASE_URL}/activity${query ? "?" + query : ""}`,
  getDefaultQuotas: () => `${BASE_URL}/quotas/default`,
  getFeatureFlags: () => `${BASE_URL}/features`,
  getGlobalConfiguration: () => `${BASE_URL}/config`,
  getGlobalProperty: ({ id }) => `${BASE_URL}/config/${id}`,
  getInsights: ({ query }) => `${BASE_URL}/insights${query ? "?" + query : ""}`,
  getManageTeamsCreate: () => `${BASE_URL}/manage/teams`,
  getManageTeam: ({ teamId }) => `${BASE_URL}/manage/teams/${teamId}`,
  getManageTeamUser: ({ teamId }) => `${BASE_URL}/manage/teams/${teamId}/members`,
  getManageTeams: ({ query }) => `${BASE_URL}/manage/teams${query ? "?" + query : ""}`,
  getManageUsers: ({ query }) => `${BASE_URL}/manage/users${query ? "?" + query : ""}`,
  // getPlatformNavigation: () => `${BASE_CORE_USERS_URL}/navigation`,
  getPlatformNavigation: () => `${BASE_URL}/users/navigation`,
  getFlowNavigation: () => `${BASE_URL}/navigation`,
  getSystemWorkflows: () => `${BASE_URL}/workflows/system`,
  getTaskTemplates: () => `${BASE_URL}/tasktemplate`,
  getTeams: () => `${BASE_URL}/teams`,
  getTeamProperty: ({ teamId, configurationId }) => `${BASE_URL}/teams/${teamId}/properties/${configurationId}`,
  getTeamProperties: ({ id }) => `${BASE_URL}/teams/${id}/properties`,
  getTeamQuotas: ({ id }) => `${BASE_URL}/teams/${id}/quotas`,
  getUsers: () => `${BASE_URL}/users`,
  getUser: ({ userId }) => `${BASE_URL}/users/${userId}`,
  getUserTeams: ({ email }) => `${BASE_URL}/teams?userEmail=${email}`,
  // getUserProfile: () => `${BASE_CORE_USERS_URL}/profile`,
  getUserProfile: () => `${BASE_URL}/users/profile`,

  getWorkflow: ({ id }) => `${BASE_URL}/workflow/${id}`,
  getWorkflowAvailableParameters: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/available-parameters`,

  getWorkflowChangelog: ({ workflowId, query }) =>
    `${BASE_URL}/workflow/${workflowId}/changelog${query ? "?" + query : ""}`,
  getWorkflowImport: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  getWorkflowExecution: ({ executionId }) => `${BASE_URL}/activity/${executionId}`,
  getWorkflowExecutionLog: ({ flowActivityId, flowTaskId }) =>
    `${BASE_URL}/activity/${flowActivityId}/log/${flowTaskId}`,
  getWorkflowRevision: ({ workflowId, revisionNumber }) =>
    `${BASE_URL}/workflow/${workflowId}/revision${revisionNumber ? "/" + revisionNumber : ""}`,
  getWorkflowSummary: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/summary`,
  patchUpdateWorkflowProperties: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/properties`,
  patchUpdateWorkflowSummary: () => `${BASE_URL}/workflow`,
  postCreateWorkflow: () => `${BASE_URL}/workflow`,
  postCreateWorkflowRevision: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/revision`,
  postCreateWorkflowToken: ({ workflowId, label }) => `${BASE_URL}/workflow/${workflowId}/token?label=${label}`,
  postExecuteWorkflow: ({ id }) => `${BASE_URL}/execute/${id}`,
  // postImportWorkflow: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  // putActivationApp: () => `${BASE_CORE_USERS_URL}/register`,
  putActivationApp: () => `${BASE_URL}/users/register`,
  putRestoreTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}/activate`,
  putTeamQuotasDefault: ({ id }) => `${BASE_URL}/teams/${id}/quotas/default`,
  putWorkflowApproval: () => `${BASE_URL}/approvals/action`,
  resourceManageUser: ({ userId }) => `${BASE_URL}/manage/users/${userId}`,
  resourceSettings: () => `${BASE_URL}/settings`,
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
  deleteWorkflow: ({ id }) => axios.delete(serviceUrl.getWorkflow({ id })),
  patchGlobalPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalProperty({ id }), body, method: HttpMethod.Patch }),
  patchManageTeamUser: ({ teamId, body }) => axios.patch(serviceUrl.getManageTeamUser({ teamId }), body),
  patchManageUser: ({ body, userId }) =>
    cancellableResolver({ url: serviceUrl.resourceManageUser({ userId }), body, method: HttpMethod.Patch }),

  patchTeamPropertyRequest: ({ teamId, configurationId, body }) =>
    cancellableResolver({
      url: serviceUrl.getTeamProperty({ teamId, configurationId }),
      body,
      method: HttpMethod.Patch,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  // postAddService: ({ body }) =>
  //   cancellableResolver({ url: serviceUrl.postAddService(), body, method: HttpMethod.Post }),
  postCreateWorkflow: ({ body }) => axios.post(serviceUrl.postCreateWorkflow(), body),
  postCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.post(serviceUrl.postCreateWorkflowRevision({ workflowId }), body),
  postCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HttpMethod.Post }),
  putCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HttpMethod.Put }),
  postCreateTeam: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethod.Post }),
  postExecuteWorkflow: ({ id, properties }) =>
    cancellableResolver({
      url: serviceUrl.postExecuteWorkflow({ id }),
      body: { properties },
      method: HttpMethod.Post,
    }),
  postGlobalPropertyRequest: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalConfiguration(), body, method: HttpMethod.Post }),
  postImportWorkflow: ({ query, body }) => axios.post(serviceUrl.getWorkflowImport({ query }), body),
  postTeamPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamProperties({ id }), body, method: HttpMethod.Post }),
  putActivationApp: ({ body }) =>
    axios({
      method: HttpMethod.Put,
      url: serviceUrl.putActivationApp(),
      data: body,
      validateStatus: (status) => status >= 200 && status < 300,
    }),
  putPlatformSettings: ({ body }) => axios.put(serviceUrl.resourceSettings(), body),
  putRestoreTaskTemplate: ({ id }) => axios.put(serviceUrl.putRestoreTaskTemplate({ id })),
  putUpdateTeam: ({ teamId, body }) => axios.put(serviceUrl.getManageTeam({ teamId }), body),
  putTeamQuotasDefault: ({ id }) =>
    cancellableResolver({ url: serviceUrl.putTeamQuotasDefault({ id }), method: HttpMethod.Put }),
  putTeamQuotas: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamQuotas({ id }), body, method: HttpMethod.Put }),
  putWorkflowApproval: ({ body }) =>
    cancellableResolver({ url: serviceUrl.putWorkflowApproval(), body, method: HttpMethod.Put }),
};
