import React from "react";
import { TemplateNode } from "../../Template";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { ScriptForm } from "./ScriptForm";
import styles from "./ScripNode.module.scss";

export default function CustomTaskNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Executor) {
    return <ScriptNodeExecution {...props} />;
  }
  return <CustomTaskNodeDesigner {...props} />;
}

function CustomTaskNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} className={styles.node} TaskForm={ScriptForm} />;
}

function ScriptNodeExecution(props: any) {
  return <div>script</div>;
}
