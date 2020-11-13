import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import ManualTaskNodeDesigner from "Components/ManualTaskNodeDesigner";
import ManualTaskNodeExecution from "Components/ManualTaskNodeExecution";
import ManualTaskNodeModel from "./ManualTaskNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class ManualTaskNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.Manual);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new ManualTaskNodeModel({});
  }

  // generateReactWidget(diagramEngine: diagramEngineInterface, node: ManualTaskNodeModel) {
  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <ManualTaskNodeExecution node={node} />;
    } else {
      return <ManualTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
