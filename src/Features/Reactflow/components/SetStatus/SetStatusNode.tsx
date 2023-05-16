import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../Base/BaseNode";

// About: shows a simple use of the BaseNode component
export default function SetStatusNode(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <SetStatusNodeDesigner {...props} />;
}

function SetStatusNodeDesigner(props: NodeProps) {
  return <BaseNode title="Set Status" isConnectable={props.isConnectable} nodeProps={props} />;
}

function SetStatusNodeExecution(props: NodeProps) {
  return <div>TODO</div>;
}
