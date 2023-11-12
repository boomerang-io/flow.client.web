import React from "react";
import { Button } from "@carbon/react";
import { useHistory, useParams } from "react-router-dom";
import { appLink } from "Config/appConfig";
import { Edit } from "@carbon/react/icons";
import type { Workflow } from "Types";
import styles from "./WorkflowActions.module.scss";

type Props = {
  workflow: Workflow;
};

function WorkflowActions({ workflow }: Props) {
  const { team } = useParams<{ team: string }>();
  const { id } = workflow;
  const history = useHistory();

  return (
    <div className={styles.container}>
      <p className={styles.messageText}>Read-only</p>
      <Button
        kind="ghost"
        size="md"
        onClick={() => history.push(appLink.editorCanvas({ team, workflowId: id }))}
        renderIcon={Edit}
      >
        Edit Workflow
      </Button>
    </div>
  );
}

export default WorkflowActions;
