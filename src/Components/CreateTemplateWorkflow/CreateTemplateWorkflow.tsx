//@ts-nocheck
import React from "react";
import { useFeature } from "flagged";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Button } from "@carbon/react";
import { ModalFlow, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "./CreateWorkflowContent";
import CreateWorkflowTemplates from "./CreateWorkflowTemplates";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Template, Add } from "@carbon/react/icons";
import { FlowTeam, ModalTriggerProps } from "Types";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";

interface CreateTemplateWorkflowProps {
  team: FlowTeam;
}

const CreateTemplateWorkflow: React.FC<CreateTemplateWorkflowProps> = ({ team }) => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const workflowQuotasEnabled: boolean = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const workflowTemplatesUrl = serviceUrl.workflowTemplates();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({ query: "" });

  const {
    data: workflowTemplatesData,
    isLoading: workflowTemplatesIsLoading,
    error: workflowTemplatesError,
  } = useQuery({
    queryKey: workflowTemplatesUrl,
    queryFn: resolver.query(workflowTemplatesUrl),
  });

  const {
    data: taskTemplatesData,
    error: taskTemplatesError,
    isLoading: taskTempaltesAreLoading,
  } = useQuery({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl),
  });

  const {
    mutateAsync: createTemplateWorkflowMutator,
    isLoading: createTemplateWorkflowIsLoading,
    error: createTemplateWorkflowError,
  } = useMutation(resolver.postTemplateWorkflow);

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
      queryClient.invalidateQueries(serviceUrl.getTeams());
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
          renderIcon={Add}
          kind="ghost"
          size="md"
          data-testid="workflows-create-workflow-template-button"
        >
          <Template className={styles.addIcon} />
          <p className={styles.text}>Templates</p>
        </Button>
      )}
      modalHeaderProps={{
        title: "Create Workflow from Template",
        subtitle: "Get started by leveraging this template",
      }}
    >
      <CreateWorkflowTemplates
        templatesError={workflowTemplatesError || taskTemplatesError}
        isLoading={workflowTemplatesIsLoading || taskTempaltesAreLoading}
        workflowTemplates={workflowTemplatesData}
        taskTemplates={taskTemplatesData}
      />
      <CreateWorkflowContent
        createWorkflow={handleCreateWorkflow}
        createError={createTemplateWorkflowError}
        isLoading={isLoading}
        team={team}
        workflowQuotasEnabled={workflowQuotasEnabled}
      />
    </ModalFlow>
  );
};

export default CreateTemplateWorkflow;
