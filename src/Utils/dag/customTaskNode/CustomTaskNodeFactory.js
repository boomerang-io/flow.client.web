import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import CustomTaskNodeDesigner from "Components/CustomTaskNodeDesigner";
import CustomTaskNodeExecution from "Components/CustomTaskNodeExecution";
import CustomTaskNodeModel from "./CustomTaskNodeModel";
import { NodeType } from "Constants";

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
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.diagramModel.locked) {
      // return <CustomTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
      return <CustomTaskNodeExecution node={node} />;
    } else {
      return <CustomTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
