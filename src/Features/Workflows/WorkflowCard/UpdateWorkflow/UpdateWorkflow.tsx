import React from "react";
import queryString from "query-string";
import { notify, ToastNotification, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useMutation, queryCache } from "react-query";
import { WorkflowExport } from "Types";
import styles from "./updateWorkflow.module.scss";

interface UpdateWorkflowProps {
  teamId: string;
  workflowId: string;
  onCloseModal: () => void;
}

const UpdateWorkflow: React.FC<UpdateWorkflowProps> = ({ teamId, workflowId, onCloseModal }) => {
  const [importWorkflowMutator, { isLoading: isPosting }] = useMutation(resolver.postImportWorkflow, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });

  const handleImportWorkflow = async (data: WorkflowExport, closeModal: () => void) => {
    const query = queryString.stringify({ update: true, flowTeamId: teamId });
    try {
      await importWorkflowMutator({ query, body: data });
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
      closeModal();
    } catch {}
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
        title: "Update .json file",
      }}
      onCloseModal={onCloseModal}
    >
      <ImportWorkflowContent
        confirmButtonText={isPosting ? "Updating..." : "Update"}
        handleImportWorkflow={handleImportWorkflow}
        isLoading={isPosting}
        title="Update a Workflow - Select the Workflow file you want to upload"
        workflowId={workflowId}
      />
    </ModalFlow>
  );
};

export default UpdateWorkflow;
