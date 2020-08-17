import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import CustomTaskNodeDesigner from "Components/CustomTaskNodeDesigner";
import CustomTaskNodeExecution from "Components/CustomTaskNodeExecution";
import CustomTaskNodeModel from "./CustomTaskNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class CustomTaskNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.CustomTask);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new CustomTaskNodeModel({});
  }

  // generateReactWidget(diagramEngine: diagramEngineInterface, node: CustomTaskNodeModel) {
  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      // return <CustomTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
      return <CustomTaskNodeExecution node={node} />;
    } else {
      return <CustomTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
