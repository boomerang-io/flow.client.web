import React from "react";
import { TemplateNode } from "../../Template";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import styles from "./DecisionNode.module.scss";

export default function DecisionsNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Executor) {
    return <DecisionNodeExecution {...props} />;
  }
  return <DecisionNodeDesigner {...props} />;
}

function DecisionNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} />;
}

function DecisionNodeExecution(props: any) {
  return <div>hello</div>;
}
