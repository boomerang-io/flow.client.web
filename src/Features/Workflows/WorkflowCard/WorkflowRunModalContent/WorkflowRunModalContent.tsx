import React from "react";
import {
  Button,
  InlineNotification,
  ModalForm,
  ModalBody,
  ModalFooter,
} from "@boomerang-io/carbon-addons-boomerang-react";

interface WorkflowRunModalContentProps {
  closeModal: () => void;
  executeError: any;
  executeWorkflow: (closeModal: () => void, redirect: boolean) => void;
  isExecuting: boolean;
}

const WorkflowRunModalContent: React.FC<WorkflowRunModalContentProps> = ({
  closeModal,
  executeError,
  executeWorkflow,
  isExecuting,
}) => {
  return (
    <ModalForm>
      {executeError && (
        <ModalBody>
          <InlineNotification
            lowContrast
            kind="error"
            title="Something's Wrong"
            subtitle="Request to execute workflow failed"
          />
        </ModalBody>
      )}
      <ModalFooter>
        <Button kind="secondary" type="button" onClick={closeModal}>
          Cancel
        </Button>
        {isExecuting ? (
          <Button disabled style={{ flex: "0 1 115%" }}>
            Running...
          </Button>
        ) : (
          <>
            <Button
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                executeWorkflow(closeModal, false);
              }}
            >
              Run
            </Button>
            <Button
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                executeWorkflow(closeModal, true);
              }}
            >
              Run and View
            </Button>
          </>
        )}
      </ModalFooter>
    </ModalForm>
  );
};

export default WorkflowRunModalContent;
