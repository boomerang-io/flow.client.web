import React from "react";
import { TemplateNode } from "../Template";
import { WorkflowNodeProps } from "Types";
import { RunWorkflowForm } from "./RunWorkflowForm";

export default function RunWorkFlowNode(props: WorkflowNodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <RunWorkflowDesigner {...props} />;
}

function RunWorkflowDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} TaskForm={RunWorkflowForm} />;
}
