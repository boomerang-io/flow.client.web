import React from "react";
import queryString from "query-string";
import { notify, ToastNotification, ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import ImportWorkflowContent from "./ImportWorkflowContent";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useMutation, useQueryClient } from "react-query";
import { Workflow } from "Types";
import styles from "./updateWorkflow.module.scss";

interface UpdateWorkflowProps {
  teamName: string | null;
  workflowId: string;
  onCloseModal: () => void;
  type: string;
}

const UpdateWorkflow: React.FC<UpdateWorkflowProps> = ({ teamName, workflowId, onCloseModal, type }) => {
  const queryClient = useQueryClient();

  //TODO - update the query and mutator as post endpoint different
  const { mutateAsync: importWorkflowMutator, isLoading: isPosting } = useMutation(resolver.postImportWorkflow);
  const handleImportWorkflow = async (data: Workflow, closeModal: () => void) => {
    let query;
    if (teamName) {
      query = queryString.stringify({ update: true, flowTeamId: teamName });
    } else query = queryString.stringify({ update: true });

    try {
      await importWorkflowMutator({ query, body: data });
      queryClient.invalidateQueries(serviceUrl.getMyTeams());
      notify(<ToastNotification kind="success" title={`Update ${type}`} subtitle={`${type} successfully updated`} />);
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
        title: `Update ${type}`,
      }}
      onCloseModal={onCloseModal}
    >
      <ImportWorkflowContent
        confirmButtonText={isPosting ? "Updating..." : "Update"}
        handleImportWorkflow={handleImportWorkflow}
        isLoading={isPosting}
        title={`Select the ${type} JSON file you want to update the current ${type} with. The ${type} id must match.`}
        workflowId={workflowId}
        type={type}
      />
    </ModalFlow>
  );
};

export default UpdateWorkflow;
