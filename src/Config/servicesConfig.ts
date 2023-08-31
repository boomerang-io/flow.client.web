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

type TeamIdArg = {
  teamId: string
}

type VersionArg = {
  version: string
}

type QueryArg = {
  query: string
}

export const serviceUrl = {
  // deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/tasktemplate/${id}`,
  deleteCancelWorkflow: ({ executionId }) => `${BASE_URL}/workflowrun/${executionId}/cancel`,
  deleteToken: ({ tokenId }) => `${BASE_URL}/token/${tokenId}`,
  deleteSchedule: ({ scheduleId }) => `${BASE_URL}/schedules/${scheduleId}`,
  deleteTeamMembers: ({ teamId }: TeamIdArg) => `${BASE_URL}/team/${teamId}/members`,
  leaveTeam: ({ id }: IdArg) => `${BASE_URL}/team/${id}/leave`,
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
  getManageTeamLabels: ({ teamId }: TeamIdArg) => `${BASE_URL}/team/${teamId}/labels`,
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
  deleteTeamQuotas: ({ id }: IdArg) => `${BASE_URL}/team/${id}/quotas`,
  getTeamQuotaDefaults: () => `${BASE_URL}/team/quotas/default`,
  getTokens: ({ query }) => `${BASE_URL}/token/query${query ? "?" + query : ""}`,
  getUsers: ({ query }: QueryArg) => `${BASE_URL}/user/query${query ? "?" + query : ""}`,
  getUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  deleteUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  getUserProfile: () => `${BASE_URL}/user/profile`,
  getUserProfileImage: ({ userEmail }) => `${BASE_CORE_USERS_URL}/image/${userEmail}`,
  getWorkflows: ({ query }: QueryArg) => `${BASE_URL}/workflow/query${query ? "?" + query : ""}`,
  getWorkflow: ({ id, version }: IdArg & Partial<VersionArg>) => `${BASE_URL}/workflow/${id}${version ? `?version=${version}` : ""}`,
  getWorkflowCompose: ({ id, version }: IdArg & Partial<VersionArg>) => `${BASE_URL}/workflow/${id}/compose${version ? `?version=${version}` : ""}`,
  getWorkflowChangelog: ({ id }: IdArg) =>
    `${BASE_URL}/workflow/${id}/changelog`,
  getWorkflowImport: ({ query }: QueryArg) => `${BASE_URL}/workflow/import?${query}`,
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
  postCreateWorkflow: () => `${BASE_URL}/workflow`,
  postCreateWorkflowRevision: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/compose`,
  postCreateWorkflowToken: ({ workflowId, label }: WorkflowIdArg & { label: string }) => `${BASE_URL}/workflow/${workflowId}/token?label=${label}`,
  postDuplicateWorkflow: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/duplicate`,
  postExecuteWorkflow: ({ id }: IdArg) => `${BASE_URL}/execute/${id}`,
  postSchedule: ({ teamId }: TeamIdArg) => `${BASE_URL}/schedules?team=${teamId}`,
  postToken: () => `${BASE_URL}/token`,
  postTeamValidateName: () => `${BASE_URL}/team/validate-name`,
  postValidateYaml: () => `${BASE_URL}/tasktemplate/yaml/validate`,
  // postImportWorkflow: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  putCreateWorkflowRevision: ({ workflowId }) => `${BASE_URL}/workflow/${workflowId}/compose`,
  putActivationApp: () => `${BASE_URL}/activate`,
  putTaskTemplateYaml: ({ replace, team }) =>
    `${BASE_URL}/tasktemplate?replace=${replace ? replace : "false"}${team ? "&team=" + team : ""}`,
  putTaskTemplate: ({ replace, team }) => `${BASE_URL}/tasktemplate?replace=${replace ? replace : "false"}${team ? "&team=" + team : ""}`,
  putStatusTaskTemplate: ({ name, status }) => `${BASE_URL}/tasktemplate/${name}/${status}`,
  postTeamQuotasReset: ({ id }) => `${BASE_URL}/teams/${id}/quotas/reset`,
  resourceTeam: ({ teamId }: TeamIdArg) => `${BASE_URL}/team/${teamId}`,
  putWorkflowAction: () => `${BASE_URL}/action/action`,
  resourceApproverGroups: ({ teamId, groupId }) =>
    `${BASE_URL}/team/${teamId}/approvers${groupId ? "/" + groupId : ""}`,
  resourceSettings: () => `${BASE_URL}/settings`,
  resourceTeamParameters: ({ id }) => `${BASE_URL}/team/${id}/parameters`,
  workflowAvailableParameters: ({ workflowId }: WorkflowIdArg) => `${BASE_URL}/workflow/${workflowId}/available-parameters`,
  getWorkflowTemplates: () => `${BASE_URL}/workflowtemplate/query`,
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
  deleteApproverGroup: ({ teamId, groupId }) => axios.delete(serviceUrl.resourceApproverGroups({ teamId, groupId })),
  // deleteArchiveTaskTemplate: ({ id }) => axios.delete(serviceUrl.deleteArchiveTaskTemplate({ id })),
  deleteCancelWorkflow: ({ executionId }) => axios.delete(serviceUrl.deleteCancelWorkflow({ executionId })),
  deleteGlobalParameter: ({ key }) => axios.delete(serviceUrl.getGlobalParameter({ key })),
  deleteTeamMembers: ({ id, body }) => axios.delete(serviceUrl.deleteTeamMembers({ id }), body),
  deleteTeamParameters: ({ id, body }) =>
    axios.delete(serviceUrl.resourceTeamParameters({ id }), body),
  deleteWorkflow: ({ id }) => axios.delete(serviceUrl.getWorkflow({ id })),
  leaveTeam: ({ id }) => axios.delete(serviceUrl.leaveTeam({ id })),
  deleteSchedule: ({ scheduleId }) => axios.delete(serviceUrl.deleteSchedule({ scheduleId })),
  deleteToken: ({ tokenId }) => axios.delete(serviceUrl.deleteToken({ tokenId })),
  deleteUser: ({ userId }) => axios.delete(serviceUrl.deleteUser({ userId })),
  patchGlobalParameter: ({ key, body }) =>
    axios({ url: serviceUrl.getGlobalParameter({ key }), data: body, method: HttpMethod.Patch }),
  patchTeam: ({ teamId, body }) => axios.patch(serviceUrl.resourceTeam({ teamId }), body),
  patchManageTeamLabels: ({ teamId, body }) => axios.patch(serviceUrl.getManageTeamLabels({ teamId }), body),
  patchManageUser: ({ body, userId }) =>
    axios({ url: serviceUrl.getUser({ userId }), data: body, method: HttpMethod.Patch }),
  putSchedule: ({ body }) => axios.put(serviceUrl.putSchedule(), body),
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
  patchTeamParameter: ({ id, key, body }) =>
    axios({
      url: serviceUrl.getTeamParameter({ id, key }),
      data: body,
      method: HttpMethod.Patch,
    }),
  patchUpdateWorkflowSummary: ({ body }) => axios.patch(serviceUrl.patchUpdateWorkflowSummary(), body),
  patchUpdateWorkflowProperties: ({ workflowId, body }) =>
    axios.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId }), body),
  postApproverGroupRequest: ({ body, teamId }) =>
    axios({
      url: serviceUrl.resourceApproverGroups({ teamId }),
      data: body,
      method: HttpMethod.Post,
    }),
  postCreateTemplate: ({ body }) => axios.post(serviceUrl.getWorkflowTemplates(), body),
  postCreateWorkflow: ({ body }) => axios.post(serviceUrl.postCreateWorkflow(), body),
  postCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.post(serviceUrl.postCreateWorkflowRevisut({ workflowId }), body),
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
  putStatusTaskTemplate: ({ name, status }) => axios.put(serviceUrl.putStatusTaskTemplate({ name, status })),
  postCreateTeam: ({ body }) =>
    axios({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethod.Post }),
  putCreateWorkflowRevision: ({ workflowId, body }) =>
    axios.put(serviceUrl.putCreateWorkflowRevision({ workflowId }), body),
  postExecuteWorkflow: ({ id, properties }) =>
    axios.post({
      url: serviceUrl.postExecuteWorkflow({ id }),
      data: { properties },
      method: HttpMethod.Post,
    }),
  postGlobalParameter: ({ body }) =>
    axios({ url: serviceUrl.getGlobalParameters(), data: body, method: HttpMethod.Post }),
  postImportWorkflow: ({ query, body }) => axios.post(serviceUrl.getWorkflowImport({ query }), body),
  postSchedule: ({ teamId, body }) => axios.post(serviceUrl.postSchedule({ teamId }), body),
  postTeamParameter: ({ id, body }) =>
    axios({ url: serviceUrl.resourceTeamParameters({ id }), data: body, method: HttpMethod.Post }),
  postWorkflowAvailableParameters: ({ workflowId, body }) =>
    axios.post(serviceUrl.workflowAvailableParameters({ workflowId }), body),
  putActivationApp: ({ body }) =>
    axios({
      method: HttpMethod.Put,
      url: serviceUrl.putActivationApp(),
      data: body,
      validateStatus: (status) => status >= 200 && status < 300,
    }),
  putApproverGroupRequest: ({ body, teamId }) =>
    axios({
      url: serviceUrl.resourceApproverGroups({ teamId }),
      data: body,
      method: HttpMethod.Put,
    }),
  putPlatformSettings: ({ body }) => axios.put(serviceUrl.resourceSettings(), body),
  putRestoreTaskTemplate: ({ id }: IdArg) => axios.put(serviceUrl.putRestoreTaskTemplate({ id })),
  patchUpdateTeam: ({ teamId, body }) => axios.patch(serviceUrl.resourceTeam({ teamId }), body),
  deleteTeamQuotas: ({ id }) =>
    axios({ url: serviceUrl.deleteTeamQuotas({ id }), method: HttpMethod.Delete }),
  putWorkflowAction: ({ body }) =>
    axios({ url: serviceUrl.putWorkflowAction(), data: body, method: HttpMethod.Put }),
};
