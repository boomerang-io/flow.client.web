//@ts-nocheck
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import StartEndNodeDesigner from "Components/StartEndNodeDesigner";
import StartEndNodeExecution from "Components/StartEndNodeExecution";
import StartEndNodeModel from "Utils/dag/startEndNode/StartEndNodeModel";
import { NodeType, WorkflowEngineMode } from "Constants";
import React from "react";

export default class StartEndNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(NodeType.StartEnd);
  }

  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowEngineMode.Executor) {
      return <StartEndNodeExecution isLocked={true} node={node} />;
    } else {
      return <StartEndNodeDesigner isLocked={false} node={node} />;
    }
  }

  getNewInstance() {
    return new StartEndNodeModel({ passedName: "" });
  }
}
