import React from "react";
import { useEditorContext } from "Hooks";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";
import { TemplateNode } from "../Template";
import { RunScheduledWorkflowForm } from "./RunScheduledWorkflowForm";

export default function RunScheduledWorkflowNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Runner) {
    return <RunScheduledWorkflowExecution {...props} />;
  }
  return <RunScheduledWorkflowDesigner {...props} />;
}

function RunScheduledWorkflowDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} TaskForm={RunScheduledWorkflowForm} />;
}

function RunScheduledWorkflowExecution(props: any) {
  return <TemplateNode {...props} TaskForm={RunScheduledWorkflowForm} />;
}
