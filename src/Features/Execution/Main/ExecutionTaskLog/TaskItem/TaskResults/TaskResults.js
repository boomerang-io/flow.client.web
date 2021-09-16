import React from "react";
import PropTypes from "prop-types";
import { Button, ComposedModal, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import ResultsTable from "./ResultsTable";
import styles from "./taskResults.module.scss";

function TaskResults({ flowTaskName, flowTaskResults }) {

  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.container, shouldCloseOnOverlayClick: true }}
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your changes will not be saved",
      }}
      modalHeaderProps={{
        title: "Task Results",
        label: `${flowTaskName}`,
      }}
      modalTrigger={({ openModal }) => (
        <Button kind="ghost" size="small" onClick={openModal}>
          View Results
        </Button>
      )}
    >
      {() => (
        <ModalForm>
          <ModalBody>
            <ResultsTable data={flowTaskResults} />
          </ModalBody>
        </ModalForm>
      )}
    </ComposedModal>
  );
}

TaskResults.propTypes = {
  flowTaskName: PropTypes.string.isRequired,
  flowTaskResults: PropTypes.object.isRequired,
};

export default TaskResults;
