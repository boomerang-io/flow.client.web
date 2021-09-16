import React from "react";
import queryString from "query-string";
import { notify, ToastNotification, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useMutation, queryCache } from "react-query";
import { WorkflowExport } from "Types";
import styles from "./updateWorkflow.module.scss";

interface UpdateWorkflowProps {
  teamId: string | null;
  workflowId: string;
  onCloseModal: () => void;
}

const UpdateWorkflow: React.FC<UpdateWorkflowProps> = ({ teamId, workflowId, onCloseModal }) => {
  const [importWorkflowMutator, { isLoading: isPosting }] = useMutation(resolver.postImportWorkflow, {
    onSuccess: async () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });

  const handleImportWorkflow = async (data: WorkflowExport, closeModal: () => void) => {
    let query;
    if (teamId) {
      query = queryString.stringify({ update: true, flowTeamId: teamId, scope: "team" });
    } else query = queryString.stringify({ update: true, scope: "system" });

    try {
      await importWorkflowMutator({ query, body: data });
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
      closeModal();
    } catch {
      // no-op
    }
  };

  return (
    <ModalFlow
      isOpen
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your request will not be saved",
      }}
      composedModalProps={{
        containerClassName: styles.container,
      }}
      modalHeaderProps={{
        title: "Update Workflow",
      }}
      onCloseModal={onCloseModal}
    >
      <ImportWorkflowContent
        confirmButtonText={isPosting ? "Updating..." : "Update"}
        handleImportWorkflow={handleImportWorkflow}
        isLoading={isPosting}
        title="Select the Workflow JSON file you want to update the current Workflow with. The Workflow id must match."
        workflowId={workflowId}
      />
    </ModalFlow>
  );
};

export default UpdateWorkflow;
