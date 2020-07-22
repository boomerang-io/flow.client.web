import React from "react";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { ComposedModal, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { Add32 } from "@carbon/icons-react";
import { FlowTeam, ComposedModalChildProps, ModalTriggerProps, WorkflowExport, CreateWorkflowSummary } from "Types";
import styles from "./createWorkflow.module.scss";

const workflowDagEngine = new WorkflowDagEngine({ dag: null, isModelLocked: false });

interface CreateWorkflowProps {
  team: FlowTeam;
  teams: FlowTeam[];
}

const CreateWorkflow: React.FC<CreateWorkflowProps> = ({ team, teams }) => {
  const history = useHistory();

  const [createWorkflowMutator, { error: workflowError, isLoading: workflowIsLoading }] = useMutation(
    resolver.postCreateWorkflow
  );

  const [
    createWorkflowRevisionMutator,
    { error: workflowRevisionError, isLoading: workflowRevisionIsLoading },
  ] = useMutation(resolver.postCreateWorkflowRevision, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });

  const [importWorkflowMutator, { error: importError, isLoading: importIsLoading }] = useMutation(
    resolver.postImportWorkflow,
    {
      onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
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
      history.push(appLink.editorDesigner({ teamId: team.id, workflowId }));
      notify(<ToastNotification kind="success" title="Create Workflow" subtitle="Successfully created workflow" />);
      return;
    } catch (e) {
      return;
      //no-op
    }
  };

  const handleImportWorkflow = async (workflowExport: WorkflowExport, closeModal: () => void, team: FlowTeam) => {
    const query = queryString.stringify({ update: false, flowTeamId: team.id });
    try {
      await importWorkflowMutator({ query, body: workflowExport });
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfullyupdated" />);
      closeModal();
    } catch (e) {
      //no-op
    }
  };

  const isLoading = workflowIsLoading || workflowRevisionIsLoading || importIsLoading;

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: ModalTriggerProps) => (
        <button className={styles.container} onClick={openModal} data-testid="workflows-create-workflow-button">
          <Add32 className={styles.addIcon} />
          <p className={styles.text}>Create a new workflow</p>
        </button>
      )}
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
          team={team}
          teams={teams}
        />
      )}
    </ComposedModal>
  );
};

export default CreateWorkflow;
