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

type ReplaceArg = {
  replace: boolean
}

type QueryArg = {
  query: string
}

export const serviceUrl = {
  deleteToken: ({ tokenId }) => `${BASE_URL}/token/${tokenId}`,
  getFeatureFlags: () => `${BASE_URL}/features`,
  getNavigation: ({ query }: QueryArg) => `${BASE_URL}/navigation${query}`,
  getGlobalParameters: () => `${BASE_URL}/global-params`,
  getGlobalParameter: ({ key }: IdArg) => `${BASE_URL}/global-params/${key}`,
  getGlobalTokens: () => `${BASE_URL}/tokens/global-tokens`,
  getManageTeamsCreate: () => `${BASE_URL}/manage/teams`,
  getManageTeamLabels: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/labels`,
  getContext: () => `${BASE_URL}/context`,
  getTeams: ({ query }: QueryArg) => `${BASE_URL}/team/query${query ? "?" + query : ""}`,
  deleteTeamQuotas: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/quotas`,
  getTeamQuotaDefaults: () => `${BASE_URL}/team/quotas/default`,
  getTokens: ({ query }) => `${BASE_URL}/token/query${query ? "?" + query : ""}`,
  getUsers: ({ query }: QueryArg) => `${BASE_URL}/user/query${query ? "?" + query : ""}`,
  getUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  deleteUser: ({ userId }) => `${BASE_URL}/user/${userId}`,
  getUserProfile: () => `${BASE_URL}/user/profile`,
  getUserProfileImage: ({ userEmail }) => `${BASE_CORE_USERS_URL}/image/${userEmail}`,
  getIntegrations: ({ team }: TeamArg) => `${BASE_URL}/integration${team ? "?team=" + team : ""}`,
  getTaskrunLog: ({ id }: IdArg) =>
  `${BASE_URL}/taskrun/${id}/log`,
  postToken: () => `${BASE_URL}/token`,
  postTeamValidateName: () => `${BASE_URL}/team/validate-name`,
  postTeam: () => `${BASE_URL}/team`,
  postTeamQuotasReset: ({ team }: TeamArg) => `${BASE_URL}/teams/${team}/quotas/reset`,
  resourceTeam: ({ team }: TeamArg) => `${BASE_URL}/team/${team}`,
  resourceApproverGroups: ({ team, groupId }) =>
  `${BASE_URL}/team/${team}/approvers${groupId ? "/" + groupId : ""}`,
  // postImportWorkflow: ({ query }) => `${BASE_URL}/workflow/import?${query}`,
  putActivationApp: () => `${BASE_URL}/activate`,
  resourceSettings: () => `${BASE_URL}/settings`,
  getWorkflowTemplates: () => `${BASE_URL}/workflowtemplate/query`,
  resourceTrigger: () => `${BASE_URL}/trigger`,
  getGitHubAppInstallation: ({ id }: IdArg) => `${BASE_URL}/integration/github/installation${id ? "?id=" + id : ""}`,
  getGitHubAppInstallationForTeam: ({ team }: TeamArg) => `${BASE_URL}/integration/github/installation${team ? "?team=" + team : ""}`,
  postGitHubAppLink: () => `${BASE_URL}/integration/github/link`,
  postGitHubAppUnlink: () => `${BASE_URL}/integration/github/unlink`,
  "schedule": {
    getCronValidation: ({ expression }) => `${BASE_URL}/schedule/validate-cron?cron=${expression}`,
  },
  "task": {
    // deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/task/${id}`,
    queryTasks: ({ query }: QueryArg) => `${BASE_URL}/task/query${query ? "?" + query : ""}`,
    getTask: ({ name, version }: NameArg & Partial<VersionArg>) =>
      `${BASE_URL}/task/${name}${version ? `?version=${version}` : ""}`,
    getTaskChangelog: ({ name }: NameArg) =>
      `${BASE_URL}/task/${name}/changelog`,
    putTask: ({ name, replace }: NameArg & Partial<ReplaceArg>) => `${BASE_URL}/task/${name}/?replace=${replace ? replace : false}`,
    postValidateYaml: () => `${BASE_URL}/task/validate`,
  },
  "team": {
    deleteTeamMembers: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/members`,
    leaveTeam: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/leave`,
    resourceTeamParameters: ({ team }) => `${BASE_URL}/team/${team}/parameters`,
    getInsights: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/insights${query ? "?" + query : ""}`,
    "action": {
      getActionsSummary: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/action/summary${query ? "?" + query : ""}`,
      getActions: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/action/query${query ? "?" + query : ""}`,
      putAction: ({team}: TeamArg) => `${BASE_URL}/team/${team}/action`,
    },
    "task": {
      // deleteArchiveTaskTemplate: ({ id }) => `${BASE_URL}/task/${id}`,
      queryTasks: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/task/query${query ? "?" + query : ""}`,
      getTask: ({ team, name, version }: TeamArg & NameArg & Partial<VersionArg>) =>
        `${BASE_URL}/team/${team}/task/${name}${version ? `?version=${version}` : ""}`,
      getTaskChangelog: ({ team, name }: TeamArg & NameArg) =>
        `${BASE_URL}/team/${team}/task/${name}/changelog`,
      putTask: ({ team, name, replace}: TeamArg & NameArg & Partial<ReplaceArg>) => `${BASE_URL}/team/${team}/task/${name}?replace=${replace ? replace : false}`,
      postValidateYaml: () => `${BASE_URL}/team/${team}/task/validate`,
    },
    "workflow": {
      getWorkflow: ({ team, id, version }: TeamArg & IdArg & Partial<VersionArg>) => `${BASE_URL}/team/${team}/workflow/${id}${version ? `?version=${version}` : ""}`,
      getWorkflows: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/workflow/query${query ? "?" + query : ""}`,
      getWorkflowCompose: ({ team, id, version }: TeamArg & IdArg & Partial<VersionArg>) => `${BASE_URL}/team/${team}/workflow/${id}/compose${version ? `?version=${version}` : ""}`,
      getWorkflowChangelog: ({ team, id }: TeamArg & IdArg) =>
        `${BASE_URL}/team/${team}/workflow/${id}/changelog`,
      postCreateWorkflow: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/workflow`,
      postDuplicateWorkflow: ({ team, workflowId }: TeamArg & WorkflowIdArg) => `${BASE_URL}/team/${team}/workflow/${workflowId}/duplicate`,
      postSubmitWorkflow: ({ team, workflowId }: TeamArg & WorkflowIdArg) => `${BASE_URL}/team/${team}/workflow/${workflowId}/submit`,
      getAvailableParameters: ({ team, workflowId }: TeamArg & WorkflowIdArg) => `${BASE_URL}/team/${team}/workflow/${workflowId}/available-parameters`,
      putApplyWorkflow: ({ team, workflowId }: TeamArg & WorkflowIdArg) => `${BASE_URL}/team/${team}/workflow/${workflowId}/compose`,
    },
    "workflowrun": {
      deleteCancelWorkflow: ({ team, id }: TeamArg & IdArg) => `${BASE_URL}/team/${team}/workflowrun/${id}/cancel`,
      getWorkflowRunCount: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/workflowrun/count${query ? "?" + query : ""}`,
      getWorkflowRuns: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/workflowrun/query${query ? "?" + query : ""}`,
      getWorkflowRun: ({ team, id }: TeamArg & IdArg) => `${BASE_URL}/team/${team}/workflowrun/${id}`,
    },
    "schedule": {
      getSchedules: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/schedule/query${query ? "?" + query : ""}`,
      getSchedule: ({ team, id }: TeamArg & IdArg) => `${BASE_URL}/team/${team}/schedule/${id}`,
      getSchedulesCalendars: ({ team, query }: TeamArg & Partial<QueryArg>) => `${BASE_URL}/team/${team}/schedule/calendars${query ? "?" + query : ""}`,
      deleteSchedule: ({ team, id }: TeamArg & IdArg ) => `${BASE_URL}/team/${team}/schedule/${id}`,
      // getScheduleCalendar: ({ scheduleId, query }) =>
      //   `${BASE_URL}/schedule/${scheduleId}/calendar${query ? "?" + query : ""}`,
      putSchedule: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/schedule`,
      postSchedule: ({ team }: TeamArg) => `${BASE_URL}/team/${team}/schedule`,
    }
  }
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
  deleteCancelWorkflow: ({ team, runId }) => axios.delete(serviceUrl.team.workflowrun.deleteCancelWorkflow({ team, runId })),
  deleteGlobalParameter: ({ key }) => axios.delete(serviceUrl.getGlobalParameter({ key })),
  deleteTeamMembers: ({ team, body }) => axios.delete(serviceUrl.team.deleteTeamMembers({ team }), body),
  deleteTeamParameters: ({ team, body }) =>
    axios.delete(serviceUrl.team.resourceTeamParameters({ team }), body),
  deleteWorkflow: ({ team, id }) => axios.delete(serviceUrl.team.workflow.getWorkflow({ team, id })),
  leaveTeam: ({ team }) => axios.delete(serviceUrl.team.leaveTeam({ team })),
  deleteSchedule: ({ team, id }) => axios.delete(serviceUrl.team.schedule.deleteSchedule({ team, id })),
  deleteTeam: ({ team }: TeamArg) => axios.delete(serviceUrl.resourceTeam({ team })),
  deleteToken: ({ tokenId }) => axios.delete(serviceUrl.deleteToken({ tokenId })),
  deleteUser: ({ userId }) => axios.delete(serviceUrl.deleteUser({ userId })),
  patchGlobalParameter: ({ key, body }) =>
    axios({ url: serviceUrl.getGlobalParameter({ key }), data: body, method: HttpMethod.Patch }),
  patchTeam: ({ team, body }) => axios.patch(serviceUrl.resourceTeam({ team }), body),
  patchManageTeamLabels: ({ team, body }) => axios.patch(serviceUrl.getManageTeamLabels({ team }), body),
  patchProfile: ({ body }) =>
    axios({ url: serviceUrl.getUserProfile(), data: body, method: HttpMethod.Patch }),
  patchManageUser: ({ body, userId }) =>
    axios({ url: serviceUrl.getUser({ userId }), data: body, method: HttpMethod.Patch }),
  putSchedule: ({ team, body }) => axios.put(serviceUrl.team.schedule.putSchedule({ team }), body),
  postTeam: ({ body }) => axios.post(serviceUrl.postTeam(), body),
  postTeamValidateName: ({ body }) => axios.post(serviceUrl.postTeamValidateName(), body),
  postValidateYaml: ({ body }) =>
    axios({
      method: HttpMethod.Post,
      url: serviceUrl.task.postValidateYaml(),
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
  postApproverGroupRequest: ({ body, team }) =>
    axios({
      url: serviceUrl.resourceApproverGroups({ team }),
      data: body,
      method: HttpMethod.Post,
    }),
  postCreateTemplate: ({ body }) => axios.post(serviceUrl.getWorkflowTemplates(), body),
  postCreateWorkflow: ({ team, body }) => axios.post(serviceUrl.team.workflow.postCreateWorkflow({ team }), body),
  postDuplicateWorkflow: ({ team, workflowId }) => axios.post(serviceUrl.postDuplicateWorkflow({ team, workflowId })),
  postTemplateWorkflow: ({ workflowId, body }) => axios.post(serviceUrl.postDuplicateWorkflow({ workflowId }), body),
  postToken: ({ body }) => axios({ url: serviceUrl.postToken(), data: body, method: HttpMethod.Post }),
  putApplyTaskTemplate: ({ name, replace, body }) =>
    axios({ url: serviceUrl.task.putTask({ name, replace }), data: body, method: HttpMethod.Put }),
  putApplyTeamTaskTemplate: ({ team, name, replace, body }) =>
      axios({ url: serviceUrl.team.task.putTask({ team, name, replace }), data: body, method: HttpMethod.Put }),
  putApplyTaskTemplateYaml: ({ name, replace, body }) =>
    axios({
      url: serviceUrl.task.putTask({ name, replace }),
      data: body,
      method: HttpMethod.Put,
      headers: { "content-type": "application/x-yaml" },
    }),
  putApplyTeamTaskTemplateYaml: ({ team, name, replace, body }) =>
    axios({
      url: serviceUrl.team.task.putTask({ team, name, replace }),
      data: body,
      method: HttpMethod.Put,
      headers: { "content-type": "application/x-yaml" },
    }),
  postCreateTeam: ({ body }) =>
    axios({ url: serviceUrl.getManageTeamsCreate(), body, method: HttpMethod.Post }),
  putApplyWorkflow: ({ team, workflowId, body }) =>
    axios.put<Workflow, Workflow>(serviceUrl.team.workflow.putApplyWorkflow({ team, workflowId }), body),
  postSubmitWorkflow: ({ team, workflowId, body }) =>
    axios.post(
      serviceUrl.team.workflow.postSubmitWorkflow({team, workflowId}),
      body,
    ),
  postGlobalParameter: ({ body }) =>
    axios({ url: serviceUrl.getGlobalParameters(), data: body, method: HttpMethod.Post }),
  postSchedule: ({ team, body }) => axios.post(serviceUrl.team.schedule.postSchedule({ team }), body),
  postTeamParameter: ({ team, body }) =>
    axios({ url: serviceUrl.team.resourceTeamParameters({ team }), data: body, method: HttpMethod.Post }),
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
  putAction: ({ team, body }) =>
    axios({ url: serviceUrl.team.action.putAction({ team }), data: body, method: HttpMethod.Put }),
  postGitHubAppLink: ({ body }) => axios.post(serviceUrl.postGitHubAppLink(), body),
  postGitHubAppUnlink: ({ body }) => axios.post(serviceUrl.postGitHubAppUnlink(), body),
};
