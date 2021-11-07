import { Server, Serializer, Model } from "miragejs";
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
    inflect.irregular("tasktemplate", "tasktemplate");
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
      config: Model,
      featureFlag: Model,
      insights: Model,
      manageTeam: Model,
      manageTeamDetail: Model,
      manageUser: Model,
      quotas: Model,
      revision: Model,
      setting: Model,
      summary: Model,
      systemWorkflows: Model,
      tasktemplate: Model,
      team: Model,
      teamApproverUsers: Model,
      teamProperties: Model,
      tokens: Model,
      flowNavigation: Model,
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

      this.get(serviceUrl.getPlatformConfig(), (schema) => {
        return schema.db.platformConfig[0];
      });

      this.get(`${BASE_URL}/navigation`, (schema) => {
        return schema.db.flowNavigation;
      });

      this.get(serviceUrl.getTeams(), (schema) => {
        return schema.db.teams;
      });

      this.get(serviceUrl.getFeatureFlags(), (schema) => {
        return schema.db.featureFlags[0];
      });

      this.get(serviceUrl.workflowAvailableParameters({ workflowId: ":workflowId" }), (schema) => {
        // return schema.availableParameters.all();
        return [];
      });

      this.get(serviceUrl.workflowTemplates(), (schema, request) => {
        return schema.db.workflowTemplates;
      });

      this.get(serviceUrl.getSystemWorkflows(), (schema) => {
        return schema.db.systemWorkflows;
      });

      this.get(serviceUrl.getUserWorkflows(), (schema) => {
        return schema.db.userWorkflows[0];
      });

      this.get(serviceUrl.getTeamQuotas({ id: ":id" }), (schema) => {
        return schema.db.quotas[0];
      });

      this.get(serviceUrl.getManageTeams({ query: null }), (schema) => {
        return schema.db.manageTeams[0];
      });

      this.post(serviceUrl.putActivationApp(), (schema) => {
        return {};
      });

      /**
       * Global Properties
       */

      this.get(serviceUrl.getGlobalConfiguration());
      this.post(serviceUrl.getGlobalConfiguration(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        schema.config.create({ id: uuid(), ...body });
        return schema.config.all();
      });

      this.patch(serviceUrl.getGlobalProperty({ id: ":id" }), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let { id } = request.params;
        let config = schema.config.find(id);
        config.update({ ...body });
      });

      this.delete(serviceUrl.getGlobalProperty({ id: ":id" }), (schema, request) => {
        let { id } = request.params;
        schema.db.config.remove({ id });
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
        const activeTeam = teamId && schema.db.teams.find(teamId);
        let activeExecutions =
          activeTeam && schema.db.insights[0].executions.filter((team) => team.teamName === activeTeam.name);
        return activeExecutions ? { ...schema.db.insights[0], executions: activeExecutions } : schema.db.insights[0];
      });

      /**
       * Task Templates
       */
      const tasktemplatePath = serviceUrl.getTaskTemplates({ workflowId: null });
      this.get(tasktemplatePath);
      this.put(tasktemplatePath, (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let taskTemplate = schema.tasktemplate.find(body.id);
        taskTemplate.revisions.push(body);
        taskTemplate.update({ ...body });
        return taskTemplate;
      });

      this.post(serviceUrl.postValidateYaml(), () => {
        return {};
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
          let flowTeam = schema.teams.findBy({ id: body.flowTeamId });
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
        let flowTeam = schema.teams.where((team) => team.workflows.find((workflow) => workflow.id === workflowId));
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
      this.get(serviceUrl.getActivity({ query: null }), (schema) => {
        return schema.db.activityList[0];
      });

      this.get(serviceUrl.getActivitySummary({ query: null }), (schema, request) => {
        return schema.db.activitySummary[0];
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
        if (type === "manual") return schema.db.manualTasks[0];
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

      this.get(serviceUrl.getFlowTeamUsers({ teamId: ":teamId" }), (schema) => {
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

      this.get(serviceUrl.getManageTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        return schema.manageTeamDetails.findBy({ id: teamId });
      });

      this.patch(serviceUrl.getManageTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        let body = JSON.parse(request.requestBody);
        let activeTeam = schema.manageTeamDetails.findBy({ id: teamId });
        let activeUsers = activeTeam.users.filter((user) => body.includes(user.id));
        activeTeam.update({ users: activeUsers });
        return activeTeam;
      });

      this.put(serviceUrl.getManageTeam({ teamId: ":teamId" }), (schema, request) => {
        let { teamId } = request.params;
        let body = JSON.parse(request.requestBody);
        let summary = schema.manageTeamDetails.findBy({ id: teamId });
        summary.update(body);
        return summary;
      });

      this.post(serviceUrl.getManageTeamsCreate(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        const teams = schema.manageTeams.first();
        const updatedRecords = teams.records.concat({ id: uuid(), isActive: true, ...body });
        teams.update({ records: updatedRecords });
        return {};
      });

      /**
       * Manage Users
       */

      this.get(serviceUrl.getManageUsers({ query: null }), (schema, request) => {
        const { query } = request.queryParams;
        const userData = schema.db.manageUsers[0];
        if (query) {
          userData.records =
            userData.records.filter((user) => user.name.includes(query) || user.email.includes(query)) ?? [];
        }
        return userData;
      });

      this.patch(serviceUrl.resourceManageUser({ userId: ":userId" }), (schema, request) => {
        const { userId } = request.params;
        let body = JSON.parse(request.requestBody);
        const users = schema.manageUsers.first();
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

      this.get(serviceUrl.getDefaultQuotas(), (schema, request) => {
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
