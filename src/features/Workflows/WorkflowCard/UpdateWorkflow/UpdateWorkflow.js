import React from "react";
import queryString from "query-string";
import { notify, ToastNotification, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import styles from "./updateWorkflow.module.scss";

import { QueryStatus } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useMutation, queryCache } from "react-query";

export default function UpdateWorkflow({ workflowId, onCloseModal }) {
  const [importWorkflowMutator, { status: importWorkflowStatus }] = useMutation(resolver.postImportWorkflow, {
    onSuccess: () => queryCache.refetchQueries(serviceUrl.getTeams()),
  });

  const isPosting = importWorkflowStatus === QueryStatus.Loading;

  const handleImportWorkflow = async (data, closeModal) => {
    const query = queryString.stringify({ update: true, flowTeamId: this.props.teamId });
    try {
      await importWorkflowMutator(resolver.post({ query, body: data }));
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
}
