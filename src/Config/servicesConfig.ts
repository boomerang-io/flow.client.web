/*
* This file contains all the service URLs and configurations.
* 
* The model is to have a serviceUrl object that contains all the service URLs and a resolver object that holds all the queries and mutations.
*
* This depends on the /server to mount the environment variables that are the root prefixes.
*/
//@ts-nocheck
import axios from "axios";
import { Envs, HttpMethod } from "Constants";

// Set defaults, change them if Cypress is NOT defined
export let CORE_SERVICE_ENV_URL = "/api";

if (import.meta.env.MODE === Envs.Prod && window._SERVER_DATA) {
  CORE_SERVICE_ENV_URL = window._SERVER_DATA.CORE_SERVICE_ENV_URL;
}

export const PRODUCT_SERVICE_ENV_URL =
  import.meta.env.MODE === Envs.Prod && window._SERVER_DATA ? window._SERVER_DATA.PRODUCT_SERVICE_ENV_URL : "/api";


export const BASE_URL = `${PRODUCT_SERVICE_ENV_URL}`;
export const BASE_CORE_URL = CORE_SERVICE_ENV_URL;
export const BASE_CORE_USERS_URL = `${CORE_SERVICE_ENV_URL}/users`;

type IdArg = {
  id: string
}

type NameArg = {
  name: string
}

type WorkflowIdArg = {
  workflowId: string;
}

type TeamArg = {
  team: string
}

type VersionArg = {
  version: string | number
}

type QueryArg = {
  query: string
}

export const serviceUrl = {
  // deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}`,
  deleteCancelWorkflow: ({ executionId }) => `${BASE_URL}/workflowrun/${executionId}/cancel`,
  deleteToken: ({ tokenId }) => `${BASE_URL}/token/${tokenId}`,
  deleteSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  deleteTeamMembers: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/members`,
  leaveTeam: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/leave`,
  getWorkflowRunCount: ({ query }: QueryArg) => `${BASE_URL}/workflowrun/count${query ? "?" + query : ""}`,
  getWorkflowRuns: ({ query }: QueryArg) => `${BASE_URL}/workflowrun/query${query ? "?" + query : ""}`,
  getActionsSummary: ({ query }: QueryArg) => `${BASE_URL}/action/summary${query ? "?" + query : ""}`,
  getActions: ({ query }: QueryArg) => `${BASE_URL}/action/query${query ? "?" + query : ""}`,
  getFeatureFlags: () => `${BASE_URL}/features`,
  getNavigation: ({ query }: QueryArg) => `${BASE_URL}/navigation${query}`,
  getGlobalParameters: () => `${BASE_URL}/global-params`,
  getGlobalParameter: ({ key }: IdArg) => `${BASE_URL}/global-params/${key}`,
  getGlobalTokens: () => `${BASE_URL}/tokens/global-tokens`,
  getInsights: ({ query }: QueryArg) => `${BASE_URL}/insights${query ? "?" + query : ""}`,
  getManageTeamsCreate: () => `${BASE_URL}/manage/teams`,
  getManageTeamLabels: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/labels`,
  // getPlatformConfig: () => `${BASE_CORE_USERS_URL}/navigation`,
  getContext: () => `${BASE_URL}/context`,
  getSchedules: ({ query }: QueryArg) => `${BASE_URL}/schedules/query${query ? "?" + query : ""}`,
  getSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  getSchedulesCalendars: ({ query }: QueryArg) => `${BASE_URL}/schedules/calendars${query ? "?" + query : ""}`,
  // getScheduleCalendar: ({ scheduleId, query }) =>
  //   `${BASE_URL}/schedules/${scheduleId}/calendar${query ? "?" + query : ""}`,
  getScheduleCronValidation: ({ expression }) => `${BASE_URL}/schedules/validate/cron?cron=${expression}`,
  getTaskTemplates: ({ query }: QueryArg) => `${BASE_URL}/tasktemplate/query${query ? "?" + query : ""}`,
  getTaskTemplate: ({ name, version }: NameArg & Partial<VersionArg>) =>
    `${BASE_URL}/tasktemplate/${name}${version ? `?version=${version}` : ""}`,
  getTaskTemplateChangelog: ({ name }: NameArg) =>
    `${BASE_URL}/tasktemplate/${name}/changelog`,
  getTeams: ({ query }: QueryArg) => `${BASE_URL}/team/query${query ? "?" + query : ""}`,
  deleteTeamQuotas: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/quotas`,
  getTeamQuotaDefaults: () => `${BASE_URL}/team/quotas/default`,
  getTokens: ({ query }) => `${BASE_URL}/token/query${query ? "?" + query : ""}`,
  getUsers: ({ query }: QueryArg) => `${BASE_URL}/user/query${query ? "?" + query : ""}`,
  getUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  deleteUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  getUserProfile: () => `${BASE_URL}/user/profile`,
  getUserProfileImage: ({ userEmail }) => `${BASE_CORE_USERS_URL}/image/${userEmail}`,
  getWorkflows: ({ query }: QueryArg) => `${BASE_URL}/workflow/query${query ? "?" + query : ""}`,
  getIntegrations: ({ team }: TeamArg) => `${BASE_URL}/integration?team=${team}`,
  getWorkflow: ({ id, version }: IdArg & Partial<VersionArg>) => `${BASE_URL}/workflow/${id}${version ? `?version=${version}` : ""}`,
  getWorkflowCompose: ({ id, version }: IdArg & Partial<VersionArg>) => `${BASE_URL}/workflow/${id}/compose${version ? `?version=${version}` : ""}`,
  getWorkflowChangelog: ({ id }: IdArg) =>
    `${BASE_URL}/workflow/${id}/changelog`,
  getWorkflowExecution: ({ executionId }) => `${BASE_URL}/activity/${executionId}`,
  getWorkflowExecutionLog: ({ flowActivityId, flowTaskId }) =>
    `${BASE_URL}/activity/${flowActivityId}/log/${flowTaskId}`,
  getWorkflowRevision: ({ workflowId, revisionNumber }) =>
    `${BASE_URL}/workflow/${workflowId}/revision${revisionNumber ? "/" + revisionNumber : ""}`,
  getWorkflowSummary: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/summary`,
  getWorkflowSchedules: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/schedules`,
  getWorkflowSchedulesCalendar: ({ workflowId, query }: WorkflowIdArg & QueryArg) =>
    `${BASE_URL}/workflow/${workflowId}/schedules/calendar${query ? "?" + query : ""}`,
  getWorkflowTaskTemplates: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/tasktemplate/workflow/${workflowId}`,
  patchUpdateWorkflowProperties: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/properties`,
  patchUpdateWorkflowSummary: () => `${BASE_URL}/workflow`,
  putSchedule: () => `${BASE_URL}/schedules`,
  postCreateWorkflow: ({ team }: TeamArg) => `${BASE_URL}/workflow?team=${team}`,
  postCreateWorkflowToken: ({ workflowId, label }: WorkflowIdArg & { label: string }) => `${BASE_URL}/workflow/${workflowId}/token?label=${label}`,
  postDuplicateWorkflow: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/duplicate`,
  postWorkflowRun: () => `${BASE_URL}/workflowrun/submit`,
  postSchedule: ({ team }: TeamArg) => `${BASE_URL}/schedules?team=${team}`,
  postToken: () => `${BASE_URL}/token`,
  postTeamValidateName: () => `${BASE_URL}/team/validate-name`,
  postTeam: () => `${BASE_URL}/team`,
  postValidateYaml: () => `${BASE_URL}/tasktemplate/validate`,
  // postImportWorkflow: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  putCreateWorkflowRevision: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/compose`,
  putActivationApp: () => `${BASE_URL}/activate`,
  putTaskTemplateYaml: ({ replace, team }) =>
    `${BASE_URL}/tasktemplate?replace=${replace ? replace : "false"}${team ? "&team=" + team : ""}`,
  putTaskTemplate: ({ replace, team }) => `${BASE_URL}/tasktemplate?replace=${replace ? replace : "false"}${team ? "&team=" + team : ""}`,
  postTeamQuotasReset: ({ team }: TeamArg) => `${BASE_URL}/teams/${team}/quotas/reset`,
  resourceTeam: ({ team }: TeamArg) => `${BASE_URL}/team/${team}`,
  putWorkflowAction: () => `${BASE_URL}/action/action`,
  resourceApproverGroups: ({ team, groupId }) =>
    `${BASE_URL}/team/${team}/approvers${groupId ? "/" + groupId : ""}`,
  resourceSettings: () => `${BASE_URL}/settings`,
  resourceTeamParameters: ({ team }) => `${BASE_URL}/team/${team}/parameters`,
  workflowAvailableParameters: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/available-parameters`,
  getWorkflowTemplates: () => `${BASE_URL}/workflowtemplate/query`,
  resourceTriggers: () => `${BASE_URL}/triggers`,
  getGitHubAppInstallations: ({ id }: IdArg) => `${BASE_URL}/integration/github/installations?id=${id}`,
  postGitHubAppLink: () => `${BASE_URL}/integration/github/link`,
};

export const resolver = {
  query: (url) => () => axios.get(url).then((response) => response.data),
  queryYaml: (url) => () => axios.get(url, {
    headers: {
      "accept": "application/x-yaml",
    },
  }).then((response) => response.data),
  postMutation: (request) => axios.post(request),
  patchMutation: (request) => axios.patch(request),
  putMutation: (request) => axios.put(request),
  deleteApproverGroup: ({ team, groupId }) => axios.delete(serviceUrl.resourceApproverGroups({ team, groupId })),
  // deleteArchiveTaskTemplate: ({ id }) => axios.delete(serviceUrl.deleteArchiveTaskTemplate({ id })),
  deleteCancelWorkflow: ({ executionId }) => axios.delete(serviceUrl.deleteCancelWorkflow({ executionId })),
  deleteGlobalParameter: ({ key }) => axios.delete(serviceUrl.getGlobalParameter({ key })),
  deleteTeamMembers: ({ team, body }) => axios.delete(serviceUrl.deleteTeamMembers({ team }), body),
  deleteTeamParameters: ({ team, body }) =>
    axios.delete(serviceUrl.resourceTeamParameters({ team }), body),
  deleteWorkflow: ({ id }) => axios.delete(serviceUrl.getWorkflow({ id })),
  leaveTeam: ({ team }) => axios.delete(serviceUrl.leaveTeam({ team })),
  deleteSchedule: ({ scheduleId }) => axios.delete(serviceUrl.deleteSchedule({ scheduleId })),
  deleteToken: ({ tokenId }) => axios.delete(serviceUrl.deleteToken({ tokenId })),
  deleteUser: ({ userId }) => axios.delete(serviceUrl.deleteUser({ userId })),
  patchGlobalParameter: ({ key, body }) =>
    axios({ url: serviceUrl.getGlobalParameter({ key }), data: body, method: HttpMethod.Patch }),
  patchTeam: ({ team, body }) => axios.patch(serviceUrl.resourceTeam({ team }), body),
  patchManageTeamLabels: ({ team, body }) => axios.patch(serviceUrl.getManageTeamLabels({ team }), body),
  patchManageUser: ({ body, userId }) =>
    axios({ url: serviceUrl.getUser({ userId }), data: body, method: HttpMethod.Patch }),
  putSchedule: ({ body }) => axios.put(serviceUrl.putSchedule(), body),
  postTeam: ({ body }) => axios.post(serviceUrl.postTeam(), body),
  postTeamValidateName: ({ body }) => axios.post(serviceUrl.postTeamValidateName(), body),
  postValidateYaml: ({ body }) =>
    axios({
      method: HttpMethod.Post,
      url: serviceUrl.postValidateYaml(),
      data: body,
      headers: {
        "content-type": "application/x-yaml",
      },
    }),
  patchTeamParameter: ({ team, key, body }) =>
    axios({
      url: serviceUrl.getTeamParameter({ team, key }),
      data: body,
      method: HttpMethod.Patch,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  postApproverGroupRequest: ({ body, team }) =>
    axios({
      url: serviceUrl.resourceApproverGroups({ team }),
      data: body,
      method: HttpMethod.Post,
    }),
  postCreateTemplate: ({ body }) => axios.post(serviceUrl.getWorkflowTemplates(), body),
  postCreateWorkflow: ({ team, body }) => axios.post(serviceUrl.postCreateWorkflow({ team }), body),
  postDuplicateWorkflow: ({ workflowId }) => axios.post(serviceUrl.postDuplicateWorkflow({ workflowId })),
  postTemplateWorkflow: ({ workflowId, body }) => axios.post(serviceUrl.postDuplicateWorkflow({ workflowId }), body),
  postToken: ({ body }) => axios({ url: serviceUrl.postToken(), data: body, method: HttpMethod.Post }),
  putApplyTaskTemplate: ({ replace, team, body }) =>
    axios({ url: serviceUrl.putTaskTemplate({ replace, team }), data: body, method: HttpMethod.Put }),
  putApplyTaskTemplateYaml: ({ replace, team, body }) =>
    axios({
      url: serviceUrl.putTaskTemplateYaml({ replace, team }),
      data: body,
      method: HttpMethod.Put,
      headers: { "content-type": "application/x-yaml" },
    }),
  postCreateTeam: ({ body }) =>
    axios({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethod.Post }),
  putCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.put<Workflow, Workflow>(serviceUrl.putCreateWorkflowRevision({ workflowId }), body),
  postWorkflowRun: ({ data }) =>
    axios.post(
      serviceUrl.postWorkflowRun(),
      data,
    ),
  postGlobalParameter: ({ body }) =>
    axios({ url: serviceUrl.getGlobalParameters(), data: body, method: HttpMethod.Post }),
  postSchedule: ({ team, body }) => axios.post(serviceUrl.postSchedule({ team }), body),
  postTeamParameter: ({ team, body }) =>
    axios({ url: serviceUrl.resourceTeamParameters({ team }), data: body, method: HttpMethod.Post }),
  postWorkflowAvailableParameters: ({ workflowId, body }) =>
    axios.post(serviceUrl.workflowAvailableParameters({ workflowId }), body),
  putActivationApp: ({ body }) =>
    axios({
      method: HttpMethod.Put,
      url: serviceUrl.putActivationApp(),
      data: body,
      validateStatus: (status) => status >= 200 && status < 300,
    }),
  putApproverGroupRequest: ({ body, team }) =>
    axios({
      url: serviceUrl.resourceApproverGroups({ team }),
      data: body,
      method: HttpMethod.Put,
    }),
  putPlatformSettings: ({ body }) => axios.put(serviceUrl.resourceSettings(), body),
  putRestoreTaskTemplate: ({ id }: IdArg) => axios.put(serviceUrl.putRestoreTaskTemplate({ id })),
  patchUpdateTeam: ({ team, body }) => axios.patch(serviceUrl.resourceTeam({ team }), body),
  deleteTeamQuotas: ({ team }) =>
    axios({ url: serviceUrl.deleteTeamQuotas({ team }), method: HttpMethod.Delete }),
  putWorkflowAction: ({ body }) =>
    axios({ url: serviceUrl.putWorkflowAction(), data: body, method: HttpMethod.Put }),
  postGitHubAppLink: ({ body }) => axios.post(serviceUrl.postGitHubAppLink(), body),
};
