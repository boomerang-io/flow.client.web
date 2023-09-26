import React from "react";
import { TemplateNode } from "../Template";
import { WorkflowNodeProps } from "Types";
import { RunScheduledWorkflowForm } from "./RunScheduledWorkflowForm";

export default function RunScheduledWorkflowNode(props: WorkflowNodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <RunScheduledWorkflowDesigner {...props} />;
}

function RunScheduledWorkflowDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} TaskForm={RunScheduledWorkflowForm} />;
}
