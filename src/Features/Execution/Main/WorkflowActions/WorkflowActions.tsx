import React from "react";
import { useAppContext } from "Hooks";
import { Button } from "@carbon/react";
import { useHistory } from "react-router-dom";
import { appLink } from "Config/appConfig";
import { Edit } from "@carbon/react/icons";
import { elevatedUserRoles } from "Constants";
import { WorkflowSummary } from "Types";
import styles from "./WorkflowActions.module.scss";

type Props = {
  workflow: WorkflowSummary;
};

function WorkflowActions({ workflow }: Props) {
  const { id } = workflow;
  const history = useHistory();

  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      <Button
        kind="ghost"
        size="md"
        onClick={() => history.push(appLink.editorDesigner({ workflowId: id }))}
        renderIcon={Edit}
      >
        Edit Workflow
      </Button>
    </div>
  );
}

export default WorkflowActions;
