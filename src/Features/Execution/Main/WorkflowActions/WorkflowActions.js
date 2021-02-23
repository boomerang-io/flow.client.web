import React from "react";
import PropTypes from "prop-types";
import { useAppContext } from "Hooks";

import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import { useHistory } from "react-router-dom";
import { appLink } from "Config/appConfig";
import { Edit32 } from "@carbon/icons-react";
import { allowedUserRoles } from "Constants";
import styles from "./WorkflowActions.module.scss";

WorkflowActions.propTypes = {
  workflow: PropTypes.object.isRequired,
};

function WorkflowActions({ workflow }) {
  let history = useHistory();
  const { id, scope } = workflow;
  const { user } = useAppContext();
  const { type } = user;
  const systemWorkflowsEnabled = allowedUserRoles.includes(type);

  //don't show the edit workflow button if the workflow has system scope and the user doesn't have permission
  const showEditWorkflow = scope === "team" || (scope === "system" && systemWorkflowsEnabled);

  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      {showEditWorkflow && (
        <Button
          kind="ghost"
          size="field"
          onClick={() => history.push(appLink.editorDesigner({ workflowId: id }))}
          renderIcon={Edit32}
        >
          Edit Workflow
        </Button>
      )}
    </div>
  );
}

export default WorkflowActions;
