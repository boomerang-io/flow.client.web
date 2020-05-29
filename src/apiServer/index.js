import { Server, Serializer, Model } from "miragejs";
import { inflections } from "inflected";
import fixtures from "./fixtures";
import { serviceUrl } from "Config/servicesConfig";

export function startApiServer({ environment = "test", timing = 0 } = {}) {
  inflections("en", function (inflect) {
    inflect.irregular("tasktemplate", "tasktemplate");
    inflect.irregular("tasktemplate", "tasktemplate");
  });

  const ApplicationSerializer = Serializer.extend({
    root: false,
    embed: true,
  });

  return new Server({
    environment,
    fixtures,
    serializers: {
      application: ApplicationSerializer,
    },
    models: {
      tasktemplate: Model,
      team: Model,
      revision: Model,
      summary: Model,
    },

    routes() {
      // Simple get static data
      this.get(serviceUrl.getUserProfile(), (schema) => {
        return schema.db.profile;
      });

      this.get(serviceUrl.getNavigation(), (schema) => {
        return schema.db.navigation;
      });

      this.get(serviceUrl.getTeams(), (schema) => {
        return schema.db.teams;
      });

      // Task Templates
      const tasktemplatePath = serviceUrl.getTaskTemplates();
      this.get(tasktemplatePath);
      this.put(tasktemplatePath, (schema, request) => {
        let body = JSON.parse(request.requestBody);
        let taskTemplate = schema.tasktemplate.find(body.id);
        taskTemplate.revisions.push(body);
        taskTemplate.update({ ...body });
        return taskTemplate;
      });

      // Workflow Summary
      this.get(serviceUrl.getWorkflowSummary({ workflowId: ":id" }));

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

      this.timing = timing;
      // Allow unhandled requests on the current domain to pass through
      this.passthrough();
    },
  });
}
