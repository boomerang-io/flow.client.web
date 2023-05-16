import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../../Base/BaseNode";
import styles from "./RunWorkflowNode.module.scss";

// About: shows a simple use of the BaseNode component
export default function RunWorkflowNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <RunWorkflowNodeDesigner {...props} />;
}

function RunWorkflowNodeDesigner(props: NodeProps) {
  return <BaseNode title="Manual" isConnectable={props.isConnectable} nodeProps={props} />;
}

function RunWorkflowNodeExecution(props: NodeProps) {
  return <div>TODO</div>;
}
