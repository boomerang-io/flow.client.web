import { Server, Serializer, Model } from "miragejs";
import { inflections } from "inflected";
import fixtures from "./fixtures";
import { serviceUrl } from "Config/servicesConfig";
import uuid from "uuid/v4";

export function startApiServer({ environment = "test", timing = 0 } = {}) {
  inflections("en", function (inflect) {
    // Prevent pluralization bc our apis are weird
    inflect.irregular("changelog", "changelogs");
    inflect.irregular("config", "config");
    inflect.irregular("tasktemplate", "tasktemplate");
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
      changelog: Model,
      config: Model,
      tasktemplate: Model,
      team: Model,
      revision: Model,
      summary: Model,
    },

    routes() {
      // Control how long the responses take to resolve
      this.timing = timing;

      // Allow unhandled requests on the current domain to pass through
      this.passthrough();

      /**
       * Simple GET of static data
       */
      this.get(serviceUrl.getUserProfile(), (schema) => {
        return schema.db.profile[0];
      });

      this.get(serviceUrl.getNavigation(), (schema) => {
        return schema.db.navigation[0];
      });

      this.get(serviceUrl.getTeams(), (schema) => {
        return schema.db.teams;
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
       * Task Templates
       */
      const tasktemplatePath = serviceUrl.getTaskTemplates();
      this.get(tasktemplatePath);
      this.put(tasktemplatePath, (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let taskTemplate = schema.tasktemplate.find(body.id);
        taskTemplate.revisions.push(body);
        taskTemplate.update({ ...body });
        return taskTemplate;
      });

      /**
       * Editor
       */

      // Workflow Summary
      this.get(serviceUrl.getWorkflowSummary({ workflowId: ":id" }));
      this.patch(serviceUrl.patchUpdateWorkflowSummary(), (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let summary = schema.summaries.find(body.id);
        summary.update(body);
        return summary;
      });
      this.post(serviceUrl.postCreateWorkflowToken({ workflowId: ":workflowId" }), (schema, request) => {
        return { token: uuid() };
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

      /**
       * TODO
       */
    },
  });
}
