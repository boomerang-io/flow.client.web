import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { appLink } from "Config/appConfig";
import { Edit32 } from "@carbon/icons-react";
import styles from "./WorkflowActions.module.scss";

WorkflowActions.propTypes = {
  workflow: PropTypes.object.isRequired,
};

function WorkflowActions({ workflow }) {
  let history = useHistory();
  const { id, flowTeamId } = workflow;

  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      <button
        className={styles.editContainer}
        onClick={() => history.push(appLink.editorDesigner({ teamId: flowTeamId, workflowId: id }))}
      >
        <Edit32 className={styles.editIcon} />
        <p className={styles.editText}>Edit Workflow</p>
      </button>
    </div>
  );
}

export default WorkflowActions;
