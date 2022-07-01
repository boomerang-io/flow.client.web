import React from "react";
import { useQueryClient, useMutation } from "react-query";
import ReactMarkdown from "react-markdown";
import {
  Button,
  ComposedModal,
  InlineNotification,
  Loading,
  ModalForm,
  ModalBody,
  ModalFooter,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyGraphic from "Components/EmptyState/EmptyGraphic";
import { resolver } from "Config/servicesConfig";
import { Action, ApprovalStatus, ComposedModalChildProps, ModalTriggerProps } from "Types";
import styles from "./ManualTask.module.scss";
import "Styles/markdown.css";

type ManualTaskProps = {
  action: Action;
  handleCloseModal?: () => void;
  modalTrigger: (args: ModalTriggerProps) => React.ReactNode;
  queryToRefetch: string;
};

function ManualTask({ action, handleCloseModal, modalTrigger, queryToRefetch }: ManualTaskProps) {
  const cancelRequestRef = React.useRef<any>();

  return (
    <ComposedModal
      modalTrigger={modalTrigger}
      composedModalProps={{
        containerClassName: styles.actionManualTaskModalContainer,
        shouldCloseOnOverlayClick: true,
      }}
      modalHeaderProps={{ title: "Action Manual Task", subtitle: action?.taskName }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
        handleCloseModal && handleCloseModal();
      }}
    >
      {(props: ComposedModalChildProps) => (
        <Form action={action} cancelRequestRef={cancelRequestRef} queryToRefetch={queryToRefetch} {...props} />
      )}
    </ComposedModal>
  );
}

type FormProps = {
  action: Action;
  cancelRequestRef: React.MutableRefObject<any>;
  closeModal: () => void;
  queryToRefetch: string;
};

function Form({ action, cancelRequestRef, closeModal, queryToRefetch }: FormProps) {
  const queryClient = useQueryClient();
  const { id, instructions, status } = action ?? {};

  const { mutateAsync: approvalMutator, isLoading: approvalsIsLoading, error: approvalsError } = useMutation(
    (args: { body: { id: string; approved: boolean } }) => {
      const { promise, cancel } = resolver.putWorkflowAction(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryToRefetch);
      },
    }
  );

  const handleSubmit = async (isApproved: boolean) => {
    const body = {
      id,
      approved: isApproved,
    };
    try {
      await approvalMutator({ body });
      notify(
        <ToastNotification
          kind="success"
          title="Manual Task"
          subtitle="Successfully submitted manual task completion request"
        />
      );
      closeModal();
    } catch (err) {
      // noop
    }
  };

  if (status !== ApprovalStatus.Submitted) {
    return (
      <ModalForm>
        <ModalBody>
          <p>
            Manual task was previously <strong>{status}</strong>. There's nothing to do here.
          </p>
          <EmptyGraphic style={{ width: "28rem" }} />
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" type="button" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalForm>
    );
  }

  return (
    <ModalForm>
      {approvalsIsLoading && <Loading />}
      <ModalBody>
        {instructions ? <ReactMarkdown className="markdown-body" source={instructions} /> : <p>No instructions.</p>}
        {Boolean(approvalsError) && (
          <InlineNotification
            lowContrast
            kind="error"
            title="Something's Wrong"
            subtitle="Failed to action manual task"
            style={{ marginBottom: "0.5rem" }}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button disabled={approvalsIsLoading} type="submit" kind="danger" onClick={() => handleSubmit(false)}>
          Complete Unsuccessfully
        </Button>
        <Button disabled={approvalsIsLoading} type="submit" onClick={() => handleSubmit(true)}>
          Complete Successfully
        </Button>
      </ModalFooter>
    </ModalForm>
  );
}

export default ManualTask;
