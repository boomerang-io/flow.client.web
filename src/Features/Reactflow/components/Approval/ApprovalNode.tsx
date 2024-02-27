import React from "react";
import { useEditorContext } from "Hooks";
import { useTeamContext } from "Hooks";
import { TemplateNode } from "../Template";
import { WorkflowEngineMode } from "Constants";
import { DataDrivenInput, WorkflowNodeProps } from "Types";

export default function ApprovalNode(props: WorkflowNodeProps) {
  const { mode } = useEditorContext();
  if (mode === WorkflowEngineMode.Executor) {
    return <ApprovalNodeExecution {...props} />;
  }

  return <ApprovalNodeDesigner {...props} />;
}

function ApprovalNodeDesigner(props: WorkflowNodeProps) {
  const { team } = useTeamContext();

  const options = team.approverGroups.map((approverGroup) => ({
    key: approverGroup.id,
    value: approverGroup.name,
  }));

  return <TemplateNode {...props} formInputsToMerge={[{ key: "approverGroupIds", options }]} />;
}

function ApprovalNodeExecution(props: any) {
  return <TemplateNode {...props} />;
}
