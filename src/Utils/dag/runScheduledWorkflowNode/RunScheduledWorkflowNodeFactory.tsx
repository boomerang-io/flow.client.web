//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import RunScheduledWorkflowNodeDesigner from "Components/RunScheduledWorkflowNodeDesigner";
import RunScheduledWorkflowNodeExecution from "Components/RunScheduledWorkflowNodeExecution";
import RunScheduledWorkflowNodeModel from "./RunScheduledWorkflowNodeModel";
import { NodeType, WorkflowEngineMode } from "Constants";

export default class RunScheduledWorkflowNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.RunScheduledWorkflow);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new RunScheduledWorkflowNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowEngineMode.Executor) {
      return <RunScheduledWorkflowNodeExecution node={node} />;
    } else {
      return <RunScheduledWorkflowNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
