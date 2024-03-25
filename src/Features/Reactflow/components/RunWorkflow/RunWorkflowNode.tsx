import React from "react";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { TemplateNode } from "../Template";
import { RunWorkflowForm } from "./RunWorkflowForm";

export default function RunWorkFlowNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Runner) {
    return <RunWorkflowExecution {...props} />;
  }
  return <RunWorkflowDesigner {...props} />;
}

function RunWorkflowDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} TaskForm={RunWorkflowForm} />;
}

function RunWorkflowExecution(props: WorkflowNodeProps) {
  return <TemplateNode {...props} />;
}
