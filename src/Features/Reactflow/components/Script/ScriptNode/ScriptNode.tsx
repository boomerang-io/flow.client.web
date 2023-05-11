import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../../Base/BaseNode";
import styles from "./ScripNode.module.scss";

// About: shows a simple use of the BaseNode component
export default function ScripNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <ScripNodeDesigner {...props} />;
}

function ScripNodeDesigner(props: NodeProps) {
  return <BaseNode title="Script" isConnectable={props.isConnectable} nodeProps={props} />;
}

function ScripNodeExecution(props: NodeProps) {
  return <div>TODO</div>;
}
