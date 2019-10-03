import React from "react";
import PropTypes from "prop-types";
import { Button, ModalBody } from "carbon-components-react";
import "./styles.scss";

const WorkflowRunModalContent = ({ closeModal, executeWorkflow }) => {
  return (
    <form>
      <ModalBody>
        <div style={{ display: "flex", marginTop: "2rem", marginLeft: "10rem" }}>
          <Button
            size="field"
            kind="secondary"
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: false
              });
              closeModal();
            }}
            style={{ maxWidth: "10rem", marginRight: "1rem" }}
          >
            RUN
          </Button>
          <Button
            size="field"
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: true
              });
              closeModal();
            }}
            style={{ maxWidth: "10rem" }}
          >
            RUN & VIEW
          </Button>
        </div>
      </ModalBody>
    </form>
  );
};

WorkflowRunModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired
  //executeWorkflow: PropTypes.func.isRequired,
};

export default WorkflowRunModalContent;
