import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { ModalFlow, notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import WorkflowDagEngine, { createWorkflowRevisionBody } from "Utils/dag/WorkflowDagEngine";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { Add32 } from "@carbon/icons-react";
import styles from "./createWorkflow.module.scss";

const workflowDagEngine = new WorkflowDagEngine({ dag: null, isLocked: false });

CreateWorkflow.propTypes = {
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};

export function CreateWorkflow({ team, teams }) {
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

  const handleCreateWorkflow = async (workflowData) => {
    try {
      const { data: newWorkflow } = await createWorkflowMutator({ body: workflowData });
      const workflowId = newWorkflow.id;
      const dagProps = createWorkflowRevisionBody(workflowDagEngine, "Create workflow");
      const workflowRevision = {
        ...dagProps,
        workflowId,
      };

      await createWorkflowRevisionMutator({ workflowId, body: workflowRevision });
      history.push(appLink.editorDesigner({ teamId: team.id, workflowId }));
      notify(<ToastNotification kind="success" title="Create Workflow" subtitle="Successfully created workflow" />);
    } catch (e) {
      //no-op
    }
  };

  const handleImportWorkflow = async (data, closeModal, team) => {
    const query = queryString.stringify({ update: false, flowTeamId: team.id });
    try {
      await importWorkflowMutator({ query, body: data });
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfullyupdated" />);
      closeModal();
    } catch (e) {
      //no-op
    }
  };

  const isLoading = workflowIsLoading || workflowRevisionIsLoading || importIsLoading;

  return (
    <ModalFlow
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }) => (
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
      <CreateWorkflowContainer
        createError={workflowError || workflowRevisionError}
        createWorkflow={handleCreateWorkflow}
        importError={importError}
        importWorkflow={handleImportWorkflow}
        isLoading={isLoading}
        team={team}
        teams={teams}
      />
    </ModalFlow>
  );
}

export default CreateWorkflow;
