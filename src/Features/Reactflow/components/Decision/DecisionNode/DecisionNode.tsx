import React from "react";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { TemplateNode } from "../../Template";
import styles from "./DecisionNode.module.scss";

export default function DecisionsNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Runner) {
    return <DecisionNodeExecution {...props} />;
  }
  return <DecisionNodeDesigner {...props} />;
}

function DecisionNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} />;
}

function DecisionNodeExecution(props: any) {
  return <TemplateNode {...props} className={styles.node} />;
}
