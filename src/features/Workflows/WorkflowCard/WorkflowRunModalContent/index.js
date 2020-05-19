import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  InlineNotification,
  ModalForm,
  ModalBody,
  ModalFooter,
} from "@boomerang/carbon-addons-boomerang-react";

WorkflowRunModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  executeError: PropTypes.object,
  executeWorkflow: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired,
};

function WorkflowRunModalContent({ closeModal, executeError, executeWorkflow, isExecuting }) {
  return (
    <ModalForm>
      {executeError && (
        <ModalBody>
          <InlineNotification kind="error" title="Something's Wrong" subtitle="Request to execute workflow failed" />
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
              onClick={(e) => {
                e.preventDefault();
                executeWorkflow({
                  closeModal,
                  redirect: false,
                });
              }}
            >
              Run
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                executeWorkflow({
                  closeModal,
                  redirect: true,
                });
              }}
            >
              Run and View
            </Button>
          </>
        )}
      </ModalFooter>
    </ModalForm>
  );
}

export default WorkflowRunModalContent;
