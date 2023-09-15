//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import RunWorkflowNodeDesigner from "Components/RunWorkflowNodeDesigner";
import RunWorkflowNodeExecution from "Components/RunWorkflowNodeExecution";
import RunWorkflowNodeModel from "./RunWorkflowNodeModel";
import { NodeType, WorkflowEngineMode } from "Constants";

export default class RunWorkflowNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.RunWorkflow);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new RunWorkflowNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowEngineMode.Executor) {
      return <RunWorkflowNodeExecution node={node} />;
    } else {
      return <RunWorkflowNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
