import React from "react";
import { queryCache, useMutation } from "react-query";
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
import { ApprovalStatus } from "Constants";
import { resolver } from "Config/servicesConfig";
import styles from "./ManualTask.module.scss";
import "Styles/markdown.css";

type ManualTaskProps = {
  action: any;
  handleCloseModal?: (args?: any) => any;
  modalTrigger: (args: any) => any;
  queryToRefetch: string;
};

function ManualTask({ action, handleCloseModal, modalTrigger, queryToRefetch }: ManualTaskProps) {
  const cancelRequestRef = React.useRef<any>();

  return (
    <ComposedModal
      modalTrigger={modalTrigger}
      composedModalProps={{ containerClassName: styles.actionManualTaskModalContainer, shouldCloseOnOverlayClick: true }}
      modalHeaderProps={{ title: "Action Manual Task", subtitle: action?.taskName }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
        handleCloseModal && handleCloseModal();
      }}
    >
      {(props: any) => (
        <Form
          action={action}
          cancelRequestRef={cancelRequestRef}
          queryToRefetch={queryToRefetch}
          {...props}
        />
      )}
    </ComposedModal>
  );

}

type FormProps = {
  action: any;
  cancelRequestRef: any;
  closeModal: () => void;
  queryToRefetch: string;
};

function Form({ action, cancelRequestRef, closeModal, queryToRefetch }: FormProps) {
  const { id, instructions, status } = action ?? {};

  const [approvalMutator, { isLoading: approvalsIsLoading, error: approvalsError }] = useMutation(
    (args: { body: { id: string; approved: boolean } }) => {
      const { promise, cancel } = resolver.putWorkflowAction(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(queryToRefetch);
      },
    }
  );

  const handleSubmit = async (approvalValue: boolean) => {
    const body = {
      id,
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

  if (status !== ApprovalStatus.Submitted) {
    return (
      <ModalForm>
        <ModalBody>
          <InlineNotification
            style={{ marginBottom: "0.5rem" }}
            lowContrast
            kind="info"
            title={`Manual task already ${status}.`}
          />
        </ModalBody>
      </ModalForm>
    )
  }

  return (
    <ModalForm>
      {approvalsIsLoading && <Loading />}
      <ModalBody>
        {instructions ? <ReactMarkdown className="markdown-body" source={instructions} /> : <p>No instructions.</p>}
        {Boolean(approvalsError) && (
          <InlineNotification
            style={{ marginBottom: "0.5rem" }}
            lowContrast
            kind="error"
            title={"Action Manual Task Failed"}
            subtitle={"Something's Wrong"}
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
