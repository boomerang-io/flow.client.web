import React from "react";
import { NodeProps } from "reactflow";
//import WorkflowCloseButton from "Components/WorkflowCloseButton";
//import WorkflowEditButton from "Components/WorkflowEditButton";
import BaseNode from "../Base/BaseNode";

// About: shows a simple use of the BaseNode component
export default function AcquireLock(props: NodeProps) {
  // use context to determine state of diagram
  // render the correct component based on the mode of the diagram
  return <AcquireLockDesigner {...props} />;
}

function AcquireLockDesigner(props: NodeProps) {
  return <BaseNode title="Acquire Lock" isConnectable={props.isConnectable} nodeProps={props} />;
}

function AcquireLockExecution(props: NodeProps) {
  return <div>TODO</div>;
}
