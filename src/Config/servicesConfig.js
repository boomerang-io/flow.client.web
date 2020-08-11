import portForwardMap from "../setupPortForwarding";
import axios, { CancelToken } from "axios";
import { HttpMethods } from "Constants";

export const BASE_SERVICE_ENV_URL =
  process.env.NODE_ENV === "production" ? window._SERVER_DATA && window._SERVER_DATA.BASE_SERVICE_ENV_URL : "/api";

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

// Standard
export const BASE_URL = BASE_SERVICE_ENV_URL;
export const BASE_SERVICE_URL = determineUrl(PRODUCT_SERVICE_ENV_URL, "/workflow");
export const BASE_USERS_URL = determineUrl(BASE_SERVICE_ENV_URL, "/users");

export const serviceUrl = {
  deleteArchiveTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}`,
  getActivitySummary: ({ query }) => `${BASE_SERVICE_URL}/activity/summary${query ? "?" + query : ""}`,
  getActivity: ({ query }) => `${BASE_SERVICE_URL}/activity${query ? "?" + query : ""}`,
  getGlobalConfiguration: () => `${BASE_SERVICE_URL}/config`,
  getGlobalProperty: ({ id }) => `${BASE_SERVICE_URL}/config/${id}`,
  getInsights: ({ query }) => `${BASE_SERVICE_URL}/insights${query ? "?" + query : ""}`,
  getManageTeamsCreate: () => `${BASE_SERVICE_URL}/manage/teams`,
  getManageTeam: ({ teamId }) => `${BASE_SERVICE_URL}/manage/teams/${teamId}`,
  getManageTeams: ({ query }) => `${BASE_SERVICE_URL}/manage/teams${query ? "?" + query : ""}`,
  getManageUsers: ({ query }) => `${BASE_SERVICE_URL}/manage/users${query ? "?" + query : ""}`,
  getNavigation: () => `${BASE_USERS_URL}/navigation`,
  getTaskTemplates: () => `${BASE_SERVICE_URL}/tasktemplate`,
  getTeams: () => `${BASE_SERVICE_URL}/teams`,
  getTeamProperty: ({ teamId, configurationId }) => `${BASE_SERVICE_URL}/teams/${teamId}/properties/${configurationId}`,
  getTeamProperties: ({ id }) => `${BASE_SERVICE_URL}/teams/${id}/properties`,
  getTeamQuotas: ({ id }) => `${BASE_SERVICE_URL}/teams/${id}/quotas`,
  getUsers: () => `${BASE_SERVICE_URL}/users`,
  getUser: ({ userId }) => `${BASE_SERVICE_URL}/users/${userId}`,
  getUserTeams: ({ email }) => `${BASE_SERVICE_URL}/teams?userEmail=${email}`,
  getUserProfile: () => `${BASE_USERS_URL}/profile`,
  getWorkflow: ({ id }) => `${BASE_SERVICE_URL}/workflow/${id}`,
  getWorkflowChangelog: ({ workflowId, query }) =>
    `${BASE_SERVICE_URL}/workflow/${workflowId}/changelog${query ? "?" + query : ""}`,
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
  postValidateActivationCode: () => `${BASE_SERVICE_URL}/validatesetup`,
  putRestoreTaskTemplate: ({ id }) => `${BASE_SERVICE_URL}/tasktemplate/${id}/activate`,
  putTeamQuotasDefault: ({ id }) => `${BASE_SERVICE_URL}/teams/${id}/quotas/default`,
  resourceManageUser: ({ userId }) => `${BASE_SERVICE_URL}/manage/users/${userId}`,
  resourceSettings: () => `${BASE_SERVICE_URL}/settings`,
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
    cancellableResolver({ url: serviceUrl.getGlobalProperty({ id }), body, method: HttpMethods.Patch }),
  patchManageTeamUser: ({ teamId, body }) => axios.patch(serviceUrl.getManageTeam({ teamId }), body),
  patchManageUser: ({ body, userId }) =>
    cancellableResolver({ url: serviceUrl.resourceManageUser({ userId }), body, method: HttpMethods.Patch }),

  patchTeamPropertyRequest: ({ teamId, configurationId, body }) =>
    cancellableResolver({
      url: serviceUrl.getTeamProperty({ teamId, configurationId }),
      body,
      method: HttpMethods.Patch,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  // postAddService: ({ body }) =>
  //   cancellableResolver({ url: serviceUrl.postAddService(), body, method: HttpMethods.Post }),
  postCreateWorkflow: ({ body }) => axios.post(serviceUrl.postCreateWorkflow(), body),
  postCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.post(serviceUrl.postCreateWorkflowRevision({ workflowId }), body),
  postCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HttpMethods.Post }),
  putCreateTaskTemplate: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getTaskTemplates(), body, method: HttpMethods.Put }),
  postCreateTeam: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethods.Post }),
  postExecuteWorkflow: ({ id, properties }) =>
    cancellableResolver({
      url: serviceUrl.postExecuteWorkflow({ id }),
      body: { properties },
      method: HttpMethods.Post,
    }),
  postGlobalPropertyRequest: ({ body }) =>
    cancellableResolver({ url: serviceUrl.getGlobalConfiguration(), body, method: HttpMethods.Post }),
  postImportWorkflow: ({ query, body }) => axios.post(serviceUrl.getWorkflowImport({ query }), body),
  postTeamPropertyRequest: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamProperties({ id }), body, method: HttpMethods.Post }),
  postValidateActivationCode: ({ body }) =>
    axios({
      method: "post",
      url: serviceUrl.postValidateActivationCode(),
      data: body,
      validateStatus: (status) => status >= 200 && status < 300,
    }),
  putPlatformSettings: ({ body }) => axios.put(serviceUrl.resourceSettings(), body),
  putRestoreTaskTemplate: ({ id }) => axios.put(serviceUrl.putRestoreTaskTemplate({ id })),
  putUpdateTeam: ({ teamId, body }) => axios.put(serviceUrl.getManageTeam({ teamId }), body),
  putTeamQuotasDefault: ({ id }) => axios.put(serviceUrl.putTeamQuotasDefault({ id })),
  patchTeamQuotas: ({ id, body }) =>
    cancellableResolver({ url: serviceUrl.getTeamQuotas({ id }), body, method: HttpMethods.Patch }),
};
