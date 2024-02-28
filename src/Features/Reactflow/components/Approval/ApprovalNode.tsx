import React from "react";
import { useEditorContext } from "Hooks";
import { useTeamContext } from "Hooks";
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
  const { team } = useTeamContext();

  const options = team.approverGroups.map((approverGroup) => ({
    key: approverGroup.id,
    value: approverGroup.name,
  }));

  const formInputsToMerge =
    options.length > 0
      ? [{ key: "approverGroupId", options }]
      : [{ key: "approverGroupId", disabled: true, description: "No approver groups configured for this team." }];

  return <TemplateNode {...props} formInputsToMerge={formInputsToMerge} />;
}

function ApprovalNodeExecution(props: any) {
  return <TemplateNode {...props} />;
}
