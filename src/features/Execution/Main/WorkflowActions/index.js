import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Edit32 } from "@carbon/icons-react";
import styles from "./WorkflowActions.module.scss";

WorkflowActions.propTypes = {
  workflow: PropTypes.object.isRequired
};

function WorkflowActions({ workflow }) {
  let history = useHistory();
  const { id } = workflow;

  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      <button className={styles.editContainer} onClick={() => history.push(`/editor/${id}/designer`)}>
        <Edit32 className={styles.editIcon} />
        <p className={styles.editText}>Edit Workflow</p>
      </button>
    </div>
  );
}

export default WorkflowActions;
