import React from "react";
import { queryCache, useMutation } from "react-query";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import {
  Button,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";

function TaskApprovalModal({ approvalId, executionId, closeModal, instructions }) {
  const cancelRequestRef = React.useRef();

  const [approvalMutator, { isLoading: approvalsIsLoading, error: approvalsError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.putWorkflowApproval(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(serviceUrl.getWorkflowExecution({ executionId }));
      },
    }
  );

  const handleSubmit = async (approvalValue) => {
    const body = {
      id: approvalId,
      approved: approvalValue,
    };
    try {
      await approvalMutator({ body });
      notify(
        <ToastNotification
          kind="success"
          title="Manual Task"
          subtitle={"Successfully submitted manual task completion request"}
        />
      );
      closeModal();
    } catch (err) {
      // noop
    }
  };

  return (
    <>
      <ModalBody>
        {approvalsIsLoading ? <Loading /> : <ReactMarkdown plugins={[gfm]} children={instructions} />}

        {Boolean(approvalsError) && (
          <InlineNotification
            style={{ marginBottom: "0.5rem" }}
            lowContrast
            kind="error"
            title={"Manual Task Failed"}
            subtitle={"Something's Wrong"}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button disabled={approvalsIsLoading} type="submit" kind="danger" onClick={() => handleSubmit(false)}>
          Unsuccessfully Completed
        </Button>
        <Button disabled={approvalsIsLoading} type="submit" onClick={() => handleSubmit(true)}>
          Successfully Completed
        </Button>
      </ModalFooter>
    </>
  );
}

export default TaskApprovalModal;
