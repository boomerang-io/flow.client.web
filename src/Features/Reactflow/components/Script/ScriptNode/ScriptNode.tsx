import React from "react";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { TemplateNode } from "../../Template";
import styles from "./ScripNode.module.scss";
import { ScriptForm } from "./ScriptForm";

export default function CustomTaskNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Runner) {
    return <ScriptNodeExecution {...props} />;
  }
  return <CustomTaskNodeDesigner {...props} />;
}

function CustomTaskNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} TaskForm={ScriptForm} />;
}

function ScriptNodeExecution(props: any) {
  return <TemplateNode {...props} className={styles.node} TaskForm={ScriptForm} />;
}
