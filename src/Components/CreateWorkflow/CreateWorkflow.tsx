import React from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { ComposedModal, notify, ToastNotification, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { Add32 } from "@carbon/icons-react";
import { FlowTeam, ComposedModalChildProps, ModalTriggerProps, WorkflowExport, CreateWorkflowSummary } from "Types";
import { FeatureFlag } from "Config/appConfig";
import styles from "./createWorkflow.module.scss";

const workflowDagEngine = new WorkflowDagEngine({ dag: null });

interface CreateWorkflowProps {
  isSystem: boolean;
  team: FlowTeam | null;
  teams: FlowTeam[] | null;
  hasReachedWorkflowLimit: boolean;
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ isSystem, team, teams, hasReachedWorkflowLimit }) => {
  const { teams: teamState } = useAppContext();
  const history = useHistory();
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  const [createWorkflowMutator, { error: workflowError, isLoading: workflowIsLoading }] = useMutation(
    resolver.postCreateWorkflow
  );

  const [
    createWorkflowRevisionMutator,
    { error: workflowRevisionError, isLoading: workflowRevisionIsLoading },
  ] = useMutation(resolver.postCreateWorkflowRevision, {
    // onSuccess: () =>
    //   isSystem
    //     ? queryCache.invalidateQueries(serviceUrl.getSystemWorkflows())
    //     : queryCache.invalidateQueries(serviceUrl.getTeams()),
  });

  const [importWorkflowMutator, { error: importError, isLoading: importIsLoading }] = useMutation(
    resolver.postImportWorkflow,
    {
      // onSuccess: () =>
      //   isSystem
      //     ? queryCache.invalidateQueries(serviceUrl.getSystemWorkflows())
      //     : queryCache.invalidateQueries(serviceUrl.getTeams()),
    }
  );

  const handleCreateWorkflow = async (workflowSummary: CreateWorkflowSummary) => {
    try {
      const { data: newWorkflow } = await createWorkflowMutator({ body: workflowSummary });
      const workflowId = newWorkflow.id;
      const dagProps = createWorkflowRevisionBody(workflowDagEngine, "Create workflow");
      const workflowRevision = {
        ...dagProps,
        workflowId,
      };

      await createWorkflowRevisionMutator({ workflowId, body: workflowRevision });
      queryCache.removeQueries(serviceUrl.getWorkflowRevision({ workflowId, revisionNumber: null }));
      history.push(appLink.editorDesigner({ workflowId }));
      notify(<ToastNotification kind="success" title="Create Workflow" subtitle="Successfully created workflow" />);
      if (isSystem) {
        queryCache.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else {
        queryCache.invalidateQueries(serviceUrl.getTeams());
      }

      return;
    } catch (e) {
      return;
      //no-op
    }
  };

  const handleImportWorkflow = async (workflowExport: WorkflowExport, closeModal: () => void, team: FlowTeam) => {
    let query;
    if (!isSystem) {
      query = queryString.stringify({ update: false, flowTeamId: team.id, scope: "team" });
    } else query = queryString.stringify({ update: false, scope: "system" });
    try {
      await importWorkflowMutator({ query, body: workflowExport });
      if (isSystem) {
        notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
        queryCache.invalidateQueries(serviceUrl.getSystemWorkflows());
      } else {
        //todo: fix refresh
        teamState.find((t) => t.id === team.id)?.workflows.push(workflowExport);
        queryCache.setQueryData(serviceUrl.getTeams(), teamState);
        notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
        queryCache.invalidateQueries(serviceUrl.getTeams());
      }
      closeModal();
    } catch (e) {
      //no-op
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
              <Add32 className={styles.addIcon} />
              <p className={styles.text}>Create a new workflow</p>
            </div>
          </TooltipHover>
        ) : (
          <button className={styles.container} onClick={openModal} data-testid="workflows-create-workflow-button">
            <Add32 className={styles.addIcon} />
            <p className={styles.text}>Create a new workflow</p>
          </button>
        )
      }
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalHeaderProps={{
        title: "Create a new Workflow",
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
          isSystem={isSystem}
          team={team}
          teams={teams}
        />
      )}
    </ComposedModal>
  );
};

export default CreateWorkflow;
