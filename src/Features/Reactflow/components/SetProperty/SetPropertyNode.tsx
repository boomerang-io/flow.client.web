import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../Base/BaseNode";

// About: shows a simple use of the BaseNode component
export default function SetPropertyNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <SetPropertyNodeDesigner {...props} />;
}

function SetPropertyNodeDesigner(props: NodeProps) {
  return <BaseNode title="Set Property" isConnectable={props.isConnectable} />;
}

function SetPropertyNodeExecution(props: NodeProps) {
  return <div>TODO</div>;
}
