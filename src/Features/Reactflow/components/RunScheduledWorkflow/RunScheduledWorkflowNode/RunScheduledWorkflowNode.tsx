import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../../Base/BaseNode";
import styles from "./RunScheduledWorkflowNode.module.module.scss";

// About: shows a simple use of the BaseNode component
export default function RunScheduledWorkflowNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <RunScheduledWorkflowNodeDesigner {...props} />;
}

function RunScheduledWorkflowNodeDesigner(props: NodeProps) {
  return <BaseNode title="Run Scheduled Workflow Node" isConnectable={props.isConnectable} nodeProps={props} />;
}

function RunScheduledWorkflowExecution(props: NodeProps) {
  return <div>TODO</div>;
}
