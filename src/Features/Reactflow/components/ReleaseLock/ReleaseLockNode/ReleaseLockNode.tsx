import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../../Base/BaseNode";
import styles from "./ReleaseLockNode.module.scss";

// About: shows a simple use of the BaseNode component
export default function ReleaseLockNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <ReleaseLockNodeDesigner {...props} />;
}

function ReleaseLockNodeDesigner(props: NodeProps) {
  return <BaseNode title="Release Lock" isConnectable={props.isConnectable} nodeProps={props} />;
}

function ReleaseLockNodeExecution(props: NodeProps) {
  return <div>TODO</div>;
}
