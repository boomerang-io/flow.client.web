//@ts-nocheck
import React from "react";
import { useFeature } from "flagged";
import { useMutation, queryCache, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Button, ModalFlow, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "./CreateWorkflowContent";
import CreateWorkflowTemplates from "./CreateWorkflowTemplates";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { Template32, Add32 } from "@carbon/icons-react";
import { FlowTeam, ModalTriggerProps } from "Types";
import { WorkflowScope } from "Constants";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";

interface CreateTemplateWorkflowProps {
  teams?: FlowTeam[] | null;
  scope: string;
}

const CreateTemplateWorkflow: React.FC<CreateTemplateWorkflowProps> = ({ teams, scope }) => {
  const history = useHistory();
  const { teams: teamsIds } = queryString.parse(history.location.search);
  const initialSelectedTeam = teams && teamsIds?.length ? teams.find((team) => teamsIds.includes(team.id)) : null;

  const workflowQuotasEnabled: boolean = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const workflowTemplatesUrl = serviceUrl.workflowTemplates();
  const userWorkflowsUrl = serviceUrl.getUserWorkflows();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({ query: "" });

  const { data: userWorkflows, isLoading: userWorkflowsIsLoading, isError: userWorkflowsIsError } = useQuery({
    queryKey: userWorkflowsUrl,
    queryFn: resolver.query(userWorkflowsUrl),
  });

  const {
    data: workflowTemplatesData,
    isLoading: workflowTemplatesIsLoading,
    error: workflowTemplatesError,
  } = useQuery({
    queryKey: workflowTemplatesUrl,
    queryFn: resolver.query(workflowTemplatesUrl),
  });

  const { data: taskTemplatesData, error: taskTemplatesError, isLoading: taskTempaltesAreLoading } = useQuery({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl),
  });

  const [
    createTemplateWorkflowMutator,
    { isLoading: createTemplateWorkflowIsLoading, error: createTemplateWorkflowError },
  ] = useMutation(resolver.postTemplateWorkflow);

  const handleCreateWorkflow = async (selectedTemplateId: string, requestBody: any) => {
    try {
      const { data: newWorkflow } = await createTemplateWorkflowMutator({
        workflowId: selectedTemplateId,
        body: requestBody,
      });
      const workflowId = newWorkflow.id;

      history.push(appLink.editorDesigner({ workflowId }));
      notify(
        <ToastNotification
          kind="success"
          title="Create Workflow"
          subtitle="Successfully created workflow from template"
        />
      );
      if (scope === WorkflowScope.System) {
        queryCache.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else if (scope === WorkflowScope.Team) {
        queryCache.invalidateQueries(serviceUrl.getTeams());
      } else {
        queryCache.invalidateQueries(serviceUrl.getUserWorkflows());
      }

      return;
    } catch (e) {
      console.log(e);
      return;
      //no-op
    }
  };
  const isLoading = createTemplateWorkflowIsLoading;

  return (
    <ModalFlow
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <Button
          onClick={openModal}
          renderIcon={Add32}
          kind="ghost"
          size="field"
          data-testid="workflows-create-workflow-template-button"
        >
          <Template32 className={styles.addIcon} />
          <p className={styles.text}>Templates</p>
        </Button>
      )}
      modalHeaderProps={{
        title: "Create Workflow from Template",
        subtitle: "Get started by leveraging this template",
      }}
    >
      <CreateWorkflowTemplates
        templatesError={workflowTemplatesError || userWorkflowsIsError || taskTemplatesError}
        isLoading={workflowTemplatesIsLoading || userWorkflowsIsLoading || taskTempaltesAreLoading}
        workflowTemplates={workflowTemplatesData}
        taskTemplates={taskTemplatesData}
      />
      <CreateWorkflowContent
        createWorkflow={handleCreateWorkflow}
        createError={createTemplateWorkflowError}
        isLoading={isLoading}
        scope={scope}
        team={initialSelectedTeam}
        teams={teams}
        userWorkflows={userWorkflows}
        workflowQuotasEnabled={workflowQuotasEnabled}
      />
    </ModalFlow>
  );
};

export default CreateTemplateWorkflow;
