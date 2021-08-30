//@ts-nocheck
import React from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useMutation, queryCache, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { Button, ModalFlow, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContent from "./CreateWorkflowContent";
import CreateWorkflowTemplates from "./CreateWorkflowTemplates";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { formatErrorMessage } from "@boomerang-io/utils";
import { Template32, Add32 } from "@carbon/icons-react";
import {
  FlowTeam,
  ComposedModalChildProps,
  ModalTriggerProps,
  WorkflowSummary,
  WorkflowTemplate,
} from "Types";
import { WorkflowScope } from "Constants";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";

interface CreateTemplateWorkflowProps {
  teams?: FlowTeam[] | null;
}

const CreateTemplateWorkflow: React.FC<CreateTemplateWorkflowProps> = ({ teams }) => {
  const history = useHistory();
  const { teams: teamsIds } = queryString.parse(history.location.search);
  const initialSelectedTeam = teamsIds?.length ? teams.find((team) => teamsIds.includes(team.id)) : null;

  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const workflowTemplatesUrl = serviceUrl.getWorkflowTemplates();
  const userWorkflowsUrl = serviceUrl.getUserWorkflows();
  const getTaskTemplatesUrl = serviceUrl.getTaskTemplates({query:""});

  const { data: userWorkflows, isLoading: userWorkflowsIsLoading, isError: userWorkflowsIsError } = useQuery({
    queryKey: userWorkflowsUrl,
    queryFn: resolver.query(userWorkflowsUrl),
  });;

  const { data: workflowTemplatesData, isLoading: workflowTemplatesIsLoading, error: workflowTemplatesError } = useQuery({
    queryKey: workflowTemplatesUrl,
    queryFn: resolver.query(workflowTemplatesUrl),
  });

  const { data: taskTemplatesData, error: taskTemplatesError, isLoading: taskTempaltesAreLoading } = useQuery({
    queryKey: getTaskTemplatesUrl,
    queryFn: resolver.query(getTaskTemplatesUrl),
  });

  const [duplicateWorkflowMutator, { isLoading: duplicateWorkflowIsLoading, error: duplicateWorkflowError }] = useMutation(
    resolver.postDuplicateWorkflow
  );

  const handleCreateWorkflow = async (workflowTemplate: WorkflowTemplate) => {
    try {
      const { data: newWorkflow } = await duplicateWorkflowMutator({ workflowId: workflowTemplate.id });
      const workflowId = newWorkflow.id;

      history.push(appLink.editorDesigner({ workflowId }));
      notify(<ToastNotification kind="success" title="Create Workflow" subtitle="Successfully created workflow" />);
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
  const hasReachedWorkflowLimit  = false;
  const isLoading = duplicateWorkflowIsLoading;

  return (
    <ModalFlow
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        workflowQuotasEnabled && hasReachedWorkflowLimit ? (
          <TooltipHover
            direction="top"
            tooltipText={
              "This team has reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact your Team administrator/owner to increase the quota."
            }
          >
            <Button disabled renderIcon={Add32} kind="ghost" size="field" data-testid="workflows-create-workflow-template-button" >
              <Template32 className={styles.addIcon} />
              <p className={styles.text}>Templates</p>
            </Button>
          </TooltipHover>
        ) : (
          <Button onClick={openModal} renderIcon={Add32} kind="ghost" size="field" data-testid="workflows-create-workflow-template-button" >
            <Template32 className={styles.addIcon} />
            <p className={styles.text}>Templates</p>
          </Button>
        )
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
        createError={duplicateWorkflowError}
        isLoading={isLoading}
        team={initialSelectedTeam}
        teams={teams}
        userWorkflows={userWorkflows}
      />
    </ModalFlow>
  );
};

export default CreateTemplateWorkflow;
