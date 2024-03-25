import React from "react";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { TemplateNode } from "../Template";
import { CustomTaskForm } from "./CustomTaskForm";
import styles from "./CustomTaskNode.module.scss";

export default function CustomTaskNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Runner) {
    return <CustomTaskNodeExection {...props} />;
  }

  return <CustomTaskNodeDesigner {...props} />;
}

function CustomTaskNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} TaskForm={CustomTaskForm} />;
}

function CustomTaskNodeExection(props: any) {
  return <TemplateNode {...props} className={styles.node} />;
}
