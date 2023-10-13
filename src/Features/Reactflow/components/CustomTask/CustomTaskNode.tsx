import React from "react";
import { TemplateNode } from "../Template";
import { useEditorContext } from "Hooks";
import { WorkflowNodeProps } from "Types";
import { CustomTaskForm } from "./CustomTaskForm";
import { WorkflowEngineMode } from "Constants";
import styles from "./CustomTaskNode.module.scss";

export default function CustomTaskNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Executor) {
    return <CustomTaskNodeExection {...props} />;
  }

  return <CustomTaskNodeDesigner {...props} />;
}

function CustomTaskNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} TaskForm={CustomTaskForm} />;
}

function CustomTaskNodeExection(props: any) {
  return <div>hello</div>;
}
