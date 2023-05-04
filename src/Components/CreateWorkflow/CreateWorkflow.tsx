import React from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useMutation, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { ComposedModal, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { formatErrorMessage } from "@boomerang-io/utils";
import { Add } from "@carbon/react/icons";
import {
  FlowTeam,
  ComposedModalChildProps,
  ModalTriggerProps,
  WorkflowExport,
  CreateWorkflowSummary,
  WorkflowSummary,
  WorkflowViewType,
  WorkflowView,
} from "Types";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";
interface CreateWorkflowProps {
  team?: FlowTeam;
  hasReachedWorkflowLimit: boolean;
  workflows?: WorkflowSummary[];
  viewType: WorkflowViewType;
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ team, hasReachedWorkflowLimit, workflows, viewType }) => {
  const workflowDagEngine = new WorkflowDagEngine({ dag: null });
  const { teams: teamState } = useAppContext();
  const queryClient = useQueryClient();
  const history = useHistory();
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  const {
    mutateAsync: createWorkflowMutator,
    error: workflowError,
    isLoading: workflowIsLoading,
  } = useMutation(resolver.postCreateWorkflow);

  const {
    mutateAsync: createWorkflowRevisionMutator,
    error: workflowRevisionError,
    isLoading: workflowRevisionIsLoading,
  } = useMutation(resolver.postCreateWorkflowRevision);

  const {
    mutateAsync: importWorkflowMutator,
    error: importError,
    isLoading: importIsLoading,
  } = useMutation(resolver.postImportWorkflow);

  const handleCreateWorkflow = async (workflowSummary: CreateWorkflowSummary) => {
    try {
      const { data: newWorkflow } = await createWorkflowMutator({ body: workflowSummary });
      const workflowId = newWorkflow.id;
      const dagProps = createWorkflowRevisionBody(workflowDagEngine, `Create ${viewType}`);
      const workflowRevision = {
        ...dagProps,
        workflowId,
      };

      await createWorkflowRevisionMutator({ workflowId, body: workflowRevision });

      queryClient.removeQueries(serviceUrl.getWorkflowRevision({ workflowId, revisionNumber: null }));
      history.push(appLink.editorDesigner({ workflowId }));
      notify(
        <ToastNotification kind="success" title={`Create ${viewType}`} subtitle={`${viewType} successfully created`} />
      );
      if (viewType === WorkflowView.Template) {
        queryClient.invalidateQueries(serviceUrl.workflowTemplates());
      } else {
        queryClient.invalidateQueries(serviceUrl.getTeams());
      }
      return;
    } catch (e) {
      console.log(e);
      return;
      //no-op
    }
  };

  // TODO - fix up import query
  const handleImportWorkflow = async (workflowExport: WorkflowExport, closeModal: () => void, team: FlowTeam) => {
    let query;
    if (viewType === WorkflowView.Workflow) {
      query = queryString.stringify({ update: false, flowTeamId: team.id });
    } else query = queryString.stringify({ update: false });
    try {
      await importWorkflowMutator({ query, body: workflowExport });
      notify(
        <ToastNotification kind="success" title={`Update ${viewType}`} subtitle={`${viewType} successfully updated`} />
      );
      if (viewType === WorkflowView.Template) {
        queryClient.invalidateQueries(serviceUrl.workflowTemplates());
      } else {
        //todo: fix refresh
        teamState.find((t) => t.id === team.id)?.workflows.push(workflowExport);
        queryClient.setQueryData(serviceUrl.getTeams(), teamState);
        queryClient.invalidateQueries(serviceUrl.getTeams());
      }
      closeModal();
    } catch (err) {
      const errorMessages = formatErrorMessage({
        error: err,
        defaultMessage: `Import ${viewType} Failed`,
      });
      notify(<ToastNotification kind="error" title={errorMessages.title} subtitle={errorMessages.message} />);
    }
  };

  const isLoading = workflowIsLoading || workflowRevisionIsLoading || importIsLoading;

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: ModalTriggerProps) =>
        workflowQuotasEnabled && hasReachedWorkflowLimit ? (
          <TooltipHover
            direction="top"
            tooltipText={
              "This team has reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact your Team administrator/owner to increase the quota."
            }
          >
            <div className={styles.disabledCreate} data-testid="workflows-create-workflow-button">
              <Add className={styles.addIcon} />
              <p className={styles.text}>Create a new ${viewType}</p>
            </div>
          </TooltipHover>
        ) : (
          <button className={styles.container} onClick={openModal} data-testid="workflows-create-workflow-button">
            <Add className={styles.addIcon} />
            <p className={styles.text}>Create a new ${viewType}</p>
          </button>
        )
      }
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalHeaderProps={{
        title: `Create a new ${viewType}`,
        subtitle: "Get started with these basics, then proceed to designing it out.",
      }}
    >
      {({ closeModal }: ComposedModalChildProps) => (
        <CreateWorkflowContainer
          closeModal={closeModal}
          createError={workflowError || workflowRevisionError}
          createWorkflow={handleCreateWorkflow}
          importError={importError}
          importWorkflow={handleImportWorkflow}
          isLoading={isLoading}
          team={team}
          teams={teams}
          type={viewType}
          workflows={workflows}
          //@ts-ignore
          workflowQuotasEnabled={workflowQuotasEnabled}
        />
      )}
    </ComposedModal>
  );
};

export default CreateWorkflow;
