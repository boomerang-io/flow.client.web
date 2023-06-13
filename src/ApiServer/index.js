import { Server, Serializer, Model, Response } from "miragejs";
import { inflections } from "inflected";
import queryString from "query-string";
import { v4 as uuid } from "uuid";
import { serviceUrl, BASE_URL } from "Config/servicesConfig";
import * as fixtures from "./fixtures";

export function startApiServer({ environment = "test", timing = 0 } = {}) {
  inflections("en", function (inflect) {
    // Prevent pluralization bc our apis are weird
    inflect.irregular("activity", "activity");
    inflect.irregular("config", "config");
    // inflect.irregular("tasktemplates", "tasktemplates");
    inflect.irregular("insights", "insights");
    inflect.irregular("flowNavigation", "flowNavigation");
  });

  return new Server({
    environment,
    // Load in mock data
    fixtures,
    // Return the data as is, don't add a root key
    serializers: {
      application: Serializer.extend({
        root: false,
        embed: true,
      }),
    },
    // Register the data as a model so we can use the schema
    models: {
      activity: Model,
      approverGroups: Model,
      changelog: Model,
      globalParams: Model,
      featureFlag: Model,
      insights: Model,
      manageTeam: Model,
      manageTeamDetail: Model,
      manageUser: Model,
      quotas: Model,
      revision: Model,
      setting: Model,
      summary: Model,
      taskTemplates: Model,
      team: Model,
      teamApproverUsers: Model,
      teamNameValidate: Model,
      taskTemplateValidate: Model,
      teamProperties: Model,
      tokens: Model,
      flowNavigation: Model,
      workflowCalendar: Model,
      workflowSchedules: Model,
    },

    routes() {
      // Control how long the responses take to resolve
      this.timing = timing;

      // Allow unhandled requests on the current domain to pass through
      this.passthrough();

      this.get("/info", () => []);

      /**
       * Simple GET of static data
       */
      this.get(serviceUrl.getUserProfile(), (schema) => {
        return schema.db.profile[0];
      });

      this.get(serviceUrl.getContext(), (schema) => {
        return schema.db.platformConfig[0];
      });

      this.get(`${BASE_URL}/navigation`, (schema) => {
        return schema.db.flowNavigation;
      });

      this.get(serviceUrl.getMyTeams({ query: null }), (schema) => {
        return schema.db.myTeams[0];
      });

      this.get(serviceUrl.getFeatureFlags(), (schema) => {
        return schema.db.featureFlags[0];
      });

      this.get(
        serviceUrl.getWorkflowSchedulesCalendar({
          workflowId: ":workflowId",
          query: null,
        }),
        (schema) => {
          return schema.db.workflowCalendar;
        }
      );

      this.get(serviceUrl.getSchedule({ query: null }), (schema) => {
        return schema.db.workflowSchedules;
      });

      this.get(serviceUrl.getSchedules({ query: null }), (schema) => {
        return schema.db.workflowSchedules[0];
      });

      this.get(serviceUrl.getWorkflowSchedules({ workflowId: ":workflowId" }), (schema) => {
        return schema.db.workflowSchedules;
      });

      this.get(serviceUrl.workflowAvailableParameters({ workflowId: ":workflowId" }), (schema) => {
        return schema.db.availableParameters[0].data;
      });

      this.get(serviceUrl.getWorkflowTemplates(), (schema) => {
        return schema.db.workflowTemplates[0];
      });

      this.get(serviceUrl.getWorkflows({ query: null }), (schema) => {
        return schema.db.workflows[0];
      });

      this.get(serviceUrl.getTeamQuotas({ id: ":id" }), (schema) => {
        return schema.db.quotas[0];
      });

      this.get(serviceUrl.getTeams({ query: null }), (schema) => {
        return schema.db.teams[0];
      });

      this.put(serviceUrl.putActivationApp(), () => {
        return {};
      });

      /**
       * Global Parameters
       */

      this.get(serviceUrl.getGlobalParams({ query: null }), (schema) => {
        return schema.db.globlaParams[0];
      });
      this.post(serviceUrl.getGlobalParams(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        schema.globalParams.create({ id: uuid(), ...body });
        return schema.globalParams.all();
      });

      this.patch(serviceUrl.getGlobalProperty({ id: ":id" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let { id } = request.params;
        let param = schema.globalParams.find(id);
        param.update({ ...body });
      });

      this.delete(serviceUrl.getGlobalProperty({ id: ":id" }), (schema, request) => {
        let { id } = request.params;
        schema.db.globalParams.remove({ id });
      });

      /**
       * Team Propertiies
       */
      this.get(serviceUrl.getTeamProperties({ id: ":id" }), (schema, request) => {
        let { id } = request.params;
        let property = schema.teamProperties.find(id);
        return property && property.properties ? property.properties : [];
      });
      this.post(serviceUrl.getTeamProperties({ id: ":id" }), (schema, request) => {
        /**
         * find team record, update the list of properties for that team
         */
        let { id } = request.params;
        let body = JSON.parse(request.requestBody);
        let activeTeamProperty = schema.teamProperties.find(id);
        let currentProperties = activeTeamProperty.attrs.properties;
        currentProperties.push({ id: uuid(), ...body });
        activeTeamProperty.update({ properties: currentProperties });
        return schema.teamProperties.all();
      });
      this.patch(
        serviceUrl.getTeamProperty({ teamId: ":teamId", configurationId: ":configurationId" }),
        (schema, request) => {
          /**
           * find team record, update the list of properties for that team
           */
          let { teamId, configurationId } = request.params;
          let body = JSON.parse(request.requestBody);
          let activeTeamProperty = schema.teamProperties.find(teamId);
          let currentProperties = activeTeamProperty.attrs.properties;
          let foundIndex = currentProperties.findIndex((prop) => prop.id === configurationId);
          currentProperties[foundIndex] = body;
          activeTeamProperty.update({ properties: currentProperties });
          return schema.teamProperties.all();
        }
      );
      this.delete(
        serviceUrl.getTeamProperty({ teamId: ":teamId", configurationId: ":configurationId" }),
        (schema, request) => {
          /**
           * find team record, update the list of properties for that team
           */
          let { teamId, configurationId } = request.params;
          let activeTeamProperty = schema.teamProperties.find(teamId);
          let currentProperties = activeTeamProperty.attrs.properties;
          let newProperties = currentProperties.filter((prop) => prop.id !== configurationId);
          activeTeamProperty.update({ properties: newProperties });
          return schema.teamProperties.all();
        }
      );

      /**
       * Insights
       */
      this.get(serviceUrl.getInsights({ query: null }), (schema, request) => {
        //grab the querystring from the end of the request url
        const query = request.url.substring(14);
        // eslint-disable-next-line
        const { fromDate = null, toDate = null, teamId = null } = queryString.parse(query);
        const activeTeam = teamId && schema.db.myTeams.find(teamId);
        let activeExecutions =
          activeTeam && schema.db.insights[0].executions.filter((team) => team.teamName === activeTeam.name);
        return activeExecutions ? { ...schema.db.insights[0], executions: activeExecutions } : schema.db.insights[0];
      });

      /**
       * Task Templates
       */
      const tasktemplatePath = serviceUrl.getTaskTemplates({ query: null });
      this.get(serviceUrl.getTaskTemplates({ query: null }), (schema) => {
        console.log(schema.db.taskTemplates);
        return schema.db.taskTemplates[0];
      });
      this.put(tasktemplatePath, (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let taskTemplate = schema.tasktemplate.find(body.id);
        taskTemplate.revisions.push(body);
        taskTemplate.update({ ...body });
        return taskTemplate;
      });

      this.post(serviceUrl.postValidateYaml(), (schema) => {
        return schema.db.taskTemplateValidate[0];
      });

      /**
       * Workflows
       */

      // Workflow Summary
      this.get(serviceUrl.getWorkflowSummary({ workflowId: ":workflowId" }), (schema, request) => {
        let { workflowId } = request.params;
        return schema.summaries.find(workflowId);
      });

      this.patch(serviceUrl.patchUpdateWorkflowSummary(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let summary = schema.summaries.find(body.workflowId);
        summary.update(body);
        return summary;
      });

      this.post(serviceUrl.postCreateWorkflow(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let workflow = { ...body, id: uuid(), createdDate: Date.now(), revisionCount: 1, status: "active" };
        if (body.flowTeamId) {
          let flowTeam = schema.myTeams.findBy({ id: body.flowTeamId });
          const teamWorkflows = [...flowTeam.workflows];
          teamWorkflows.push(workflow);
          flowTeam.update({ workflows: teamWorkflows });
          return schema.summaries.create(workflow);
        }
        return {};
      });

      this.post(
        serviceUrl.postCreateWorkflowToken({ workflowId: ":workflowId", label: ":label" }),
        (schema, request) => {
          return { token: uuid() };
        }
      );

      this.del(serviceUrl.getWorkflow({ id: ":workflowId" }), (schema, request) => {
        let { workflowId } = request.params;
        let flowTeam = schema.myTeams.where((team) => team.workflows.find((workflow) => workflow.id === workflowId));
        let { attrs } = flowTeam.models[0];
        const teamWorkflows = attrs.workflows.filter((workflow) => workflow.id !== workflowId);
        flowTeam.update({ workflows: teamWorkflows });
        return schema.db.summaries.remove({ id: workflowId });
      });

      // Workflow Revision
      this.get(serviceUrl.getWorkflowRevision({ workflowId: ":workflowId" }), (schema, request) => {
        let { workflowId } = request.params;
        if (workflowId) {
          return schema.revisions.findBy({ workFlowId: workflowId });
        } else {
          return {};
        }
      });

      this.get(
        serviceUrl.getWorkflowRevision({ workflowId: ":workflowId", revisionNumber: ":revisionNumber" }),
        (schema, request) => {
          let { workflowId, revisionNumber } = request.params;
          if (revisionNumber) {
            return schema.revisions.findBy({ workFlowId: workflowId, version: revisionNumber });
          } else {
            return {};
          }
        }
      );

      this.get(serviceUrl.getWorkflowTaskTemplates({ workflowId: ":workflowId" }), (schema, request) => {
        return schema.db.tasktemplate;
      });

      this.post(serviceUrl.postCreateWorkflowRevision({ workflowId: ":workflowId" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let { workflowId } = request.params;
        let revision = { ...body, workFlowId: workflowId };
        return schema.revisions.create(revision);
      });

      //Workflow Config Cron

      this.get(`${BASE_URL}/workflow/validate/cron`, () => {
        return {
          valid: true,
        };
      });

      // Workflow Properties
      this.patch(serviceUrl.patchUpdateWorkflowProperties({ workflowId: ":workflowId" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let { workflowId } = request.params;
        let summary = schema.summaries.find(workflowId);
        summary.update({ properties: body });
        return summary;
      });

      // Workflow Changelog
      this.get(serviceUrl.getWorkflowChangelog({ workflowId: ":workflowId" }), (schema, request) => {
        let { workflowId } = request.params;
        return schema.changelogs.where({ workflowId });
      });

      //Workflow Available Parameters
      this.post(serviceUrl.workflowAvailableParameters({ workflowId: ":workflowId" }), (schema, request) => {
        return schema.db.availableParameters[0].data;
      });
      /**
       * Activity
       */
      this.get(serviceUrl.getWorkflowRuns({ query: null }), (schema) => {
        return schema.db.workflowRuns[0];
      });

      this.get(serviceUrl.getWorkflowRunCount({ query: null }), (schema, request) => {
        return schema.db.workflowRunCount[0];
      });

      this.get(serviceUrl.getWorkflowExecution({ executionId: ":id" }), (schema, request) => {
        return schema.db.workflowExecution[0];
      });

      this.delete(serviceUrl.deleteCancelWorkflow({ executionId: ":id" }), (schema, request) => {
        return {};
      });

      /**
       * Actions
       */
      this.get(serviceUrl.getActionsSummary({ query: null }), (schema) => {
        return schema.db.actionsSummary[0];
      });

      this.get(serviceUrl.getActions({ query: null }), (schema, request) => {
        const { type } = request.queryParams;
        if (type === "approval") return schema.db.approvals[0];
        if (type === "task") return schema.db.manualTasks[0];
        return {};
      });

      this.put(serviceUrl.putWorkflowAction(), () => {
        return {};
      });

      /**
       * Approvers Group
       */
      this.get(serviceUrl.resourceApproverGroups({ teamId: ":teamId" }), (schema) => {
        return schema.db.approverGroups;
      });

      this.get(serviceUrl.getTeamMembers({ teamId: ":teamId" }), (schema) => {
        return schema.db.teamApproverUsers;
      });

      //Delete approver group
      this.delete(serviceUrl.resourceApproverGroups({ teamId: ":teamId", groupId: ":groupId" }), (schema, request) => {
        const { groupId } = request.params;
        const approverGroup = schema.approverGroups.find(groupId);
        approverGroup.destroy();
      });

      //Create approver group
      this.post(serviceUrl.resourceApproverGroups({ teamId: ":teamId" }), (schema, request) => {
        const body = JSON.parse(request.requestBody);
        schema.approverGroups.create({ groupId: uuid(), ...body });
        return schema.approverGroups.all();
      });

      //Update approver group
      this.put(serviceUrl.resourceApproverGroups({ teamId: ":teamId" }), (schema, request) => {
        return {};
      });

      /**
       * Manage Team
       */

      this.post(serviceUrl.postTeamValidateName(), (schema, request) => {
        return new Response(422, {}, { errors: [ 'Name is already taken'] });
      });

      this.get(serviceUrl.getTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        return schema.manageTeamDetails.findBy({ id: teamId });
      });

      this.patch(serviceUrl.getTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        let body = JSON.parse(request.requestBody);
        let activeTeam = schema.manageTeamDetails.findBy({ id: teamId });
        let activeUsers = activeTeam.users.filter((user) => body.includes(user.id));
        activeTeam.update({ users: activeUsers });
        return activeTeam;
      });

      this.put(serviceUrl.getTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        let body = JSON.parse(request.requestBody);
        let summary = schema.manageTeamDetails.findBy({ id: teamId });
        summary.update(body);
        return summary;
      });

      this.patch(serviceUrl.getManageTeamLabels({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        let body = JSON.parse(request.requestBody);
        let activeTeam = schema.manageTeamDetails.findBy({ id: teamId });
        activeTeam.update({ labels: body });
        return activeTeam;
      });

      this.post(serviceUrl.getManageTeamsCreate(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        const teams = schema.teams.first();
        const updatedRecords = teams.records.concat({ id: uuid(), isActive: true, ...body });
        teams.update({ records: updatedRecords });
        return {};
      });

      /**
       * Manage Users
       */

      this.get(serviceUrl.getUsers({ query: null }), (schema, request) => {
        const { query } = request.queryParams;
        const userData = schema.db.users[0];
        if (query) {
          userData.content =
            userData.content.filter((user) => user.name.includes(query) || user.email.includes(query)) ?? [];
        }
        return userData;
      });

      this.get(serviceUrl.getUser({ userId: ":userId" }), (schema, request) => {
        const { userId } = request.params;
        const user = schema.db.users[0].content.find((user) => user.id === userId);
        return user;
      });

      this.patch(serviceUrl.getUser({ userId: ":userId" }), (schema, request) => {
        const { userId } = request.params;
        let body = JSON.parse(request.requestBody);
        const users = schema.users.first();
        const updatedRecords = [];
        for (let user of users.records) {
          if (user.id === userId) {
            user = user = { ...user, ...body };
          }
          updatedRecords.push(user);
        }
        users.update({ records: updatedRecords });
        return {};
      });

      /**
       * Quotas
       */

      this.patch(serviceUrl.getTeamQuotas({ id: ":id" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        const quotas = schema.quotas.first();

        const key = Object.keys(body)[0];
        const value = Object.values(body)[0];

        quotas.update({ [key]: value });
        return {};
      });

      this.put(serviceUrl.putTeamQuotasDefault({ id: ":id" }), (schema, request) => {
        const quotas = schema.quotas.first();
        const defaultConfig = {
          maxWorkflowCount: 20,
          maxWorkflowExecutionMonthly: 150,
          maxWorkflowStorage: 10,
          maxWorkflowExecutionTime: 30,
          maxConcurrentWorkflows: 4,
        };

        quotas.update(defaultConfig);
        return {};
      });

      this.put(serviceUrl.getTeamQuotas({ id: ":id" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        const quotas = schema.quotas.first();
        quotas.update(body);
        return {};
      });

      this.get(serviceUrl.getTeamQuotaDefaults(), (schema, request) => {
        return {
          maxWorkflowCount: 20,
          maxWorkflowExecutionMonthly: 150,
          maxWorkflowStorage: 10,
          maxWorkflowExecutionTime: 30,
          maxConcurrentWorkflows: 4,
        };
      });

      /**
       *  Manage Settings
       * */

      this.get(serviceUrl.resourceSettings(), (schema) => {
        return schema.settings.all();
      });

      this.put(serviceUrl.resourceSettings(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        const settings = schema.settings.all();
        settings.update(body[0]);
        return schema.settings.all();
      });

      /**
       * Manage and Administer Tokens
       */
      this.get(serviceUrl.getTeamTokens({ teamId: ":teamId" }), (schema) => {
        return schema.db.tokens;
      });

      this.get(serviceUrl.getGlobalTokens(), (schema) => {
        return schema.db.tokens;
      });

      this.delete(serviceUrl.deleteToken({ tokenId: ":tokenId" }), (schema, request) => {
        return {};
      });

      this.post(serviceUrl.postGlobalToken(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let newToken = {
          ...body,
          creatorId: "1",
          creationDate: Date.now(),
          creatorName: "Test User",
          tokenValue: "testglobal",
        };
        return schema.tokens.create(newToken);
      });

      this.post(serviceUrl.postTeamToken(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let newToken = {
          ...body,
          creatorId: "1",
          creationDate: Date.now(),
          creatorName: "Test User",
          tokenValue: "testteam",
        };
        return schema.tokens.create(newToken);
      });

      /**
       * Workflow Templates
       */
      this.post(serviceUrl.postDuplicateWorkflow({ workflowId: ":workflowId" }), (schema, request) => {
        return {};
      });
      /**
       * TODO
       */
    },
  });
}
