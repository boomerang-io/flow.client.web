import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Edit32 } from "@carbon/icons-react";
import styles from "./WorkflowActions.module.scss";

WorkflowActions.propTypes = {
  history: PropTypes.object.isRequired,
  setActiveTeam: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired
};

function WorkflowActions(props) {
  function setActiveTeamAndRedirect() {
    const { id, flowTeamId } = props.workflow;

    props.setActiveTeam(flowTeamId);
    props.history.push(`/editor/${id}/designer`);
  }
  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      <button className={styles.editContainer} onClick={setActiveTeamAndRedirect}>
        <Edit32 className={styles.editIcon} />
        <p className={styles.editText}>Edit Workflow</p>
      </button>
    </div>
  );
}

export default withRouter(WorkflowActions);
