import React from "react";
import { useEditorContext } from "Hooks";
import { TemplateNode } from "../Template";
import { WorkflowEngineMode } from "Constants";
import { WorkflowNodeProps } from "Types";

export default function ApprovalNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Executor) {
    return <ApprovalNodeExecution {...props} />;
  }

  return <ApprovalNodeDesigner {...props} />;
}

function ApprovalNodeDesigner(props: WorkflowNodeProps) {
  return <TemplateNode {...props} />;
}

function ApprovalNodeExecution(props: any) {
  return <TemplateNode {...props} />;
}
