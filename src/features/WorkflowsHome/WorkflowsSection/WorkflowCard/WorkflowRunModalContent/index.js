import React from "react";
import PropTypes from "prop-types";
import { Button, ModalFooter } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import "./styles.scss";

const WorkflowRunModalContent = ({ closeModal, executeWorkflow }) => {
  return (
    <ModalFlowForm>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            executeWorkflow({
              redirect: false
            });
            closeModal();
          }}
        >
          Run
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            executeWorkflow({
              redirect: true
            });
            closeModal();
          }}
        >
          Run and View
        </Button>
      </ModalFooter>
    </ModalFlowForm>
  );
};

WorkflowRunModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  executeWorkflow: PropTypes.func.isRequired
};

export default WorkflowRunModalContent;
