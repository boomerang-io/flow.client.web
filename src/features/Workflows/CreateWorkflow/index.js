import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
import { useHistory } from "react-router-dom";
import { ModalFlow, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import CreateWorkflowContainer from "./CreateWorkflowContainer";
import DiagramApplication, { createWorkflowRevisionBody } from "Utilities/DiagramApplication";
import { QueryStatus } from "Constants";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import queryString from "query-string";
import { Add32 } from "@carbon/icons-react";
import styles from "./createWorkflow.module.scss";

const diagramApp = new DiagramApplication({ dag: null, isLocked: false });

CreateWorkflow.propTypes = {
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};

export function CreateWorkflow({ team, teams }) {
  const history = useHistory();

  const [createWorkflowMutator, { error: workflowError, status: workflowStatus }] = useMutation(
    resolver.postCreateWorkflow,
    {
      onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
    }
  );

  const [createWorkflowRevisionMutator, { error: workflowRevisionError, status: workflowRevisionStatus }] = useMutation(
    resolver.postCreateWorkflowRevision
  );

  const [importWorkflowMutator, { error: importError, status: importStatus }] = useMutation(
    resolver.postImportWorkflow,
    {
      onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
    }
  );

  const handleCreateWorkflow = async (workflowData) => {
    try {
      const { data: newWorkflow } = await createWorkflowMutator({ body: workflowData });
      const workflowId = newWorkflow.id;
      const dagProps = createWorkflowRevisionBody(diagramApp, "Create workflow");
      const workflowRevision = {
        ...dagProps,
        workflowId,
      };

      await createWorkflowRevisionMutator({ workflowId, body: workflowRevision });
      history.push(appLink.designer({ teamId: team.id, workflowId }));
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

  const isLoading =
    workflowRevisionStatus === QueryStatus.Loading ||
    workflowStatus === QueryStatus.Loading ||
    importStatus === QueryStatus.Loading;

  return (
    <ModalFlow
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }) => (
        <button className={styles.container} onClick={openModal}>
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
