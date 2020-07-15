import React from "react";
import queryString from "query-string";
import { notify, ToastNotification, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useMutation, queryCache } from "react-query";
import styles from "./updateWorkflow.module.scss";

export default function UpdateWorkflow({ workflowId, onCloseModal }) {
  const [importWorkflowMutator, { isLoading: isPosting }] = useMutation(resolver.postImportWorkflow, {
    onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
  });

  const handleImportWorkflow = async (data, closeModal) => {
    const query = queryString.stringify({ update: true, flowTeamId: this.props.teamId });
    try {
      await importWorkflowMutator(resolver.post({ query, body: data }));
      notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Workflow successfully updated" />);
      closeModal();
    } catch { }
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
}
