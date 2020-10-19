import React from "react";
import PropTypes from "prop-types";
import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
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
      <Button
        kind="ghost"
        size="field"
        onClick={() => history.push(appLink.editorDesigner({ teamId: flowTeamId, workflowId: id }))}
        renderIcon={Edit32}
      >
        Edit Workflow
      </Button>
    </div>
  );
}

export default WorkflowActions;
