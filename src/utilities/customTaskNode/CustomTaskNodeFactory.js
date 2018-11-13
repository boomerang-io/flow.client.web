import React from "react";
import { AbstractNodeFactory } from "@boomerang/boomerang-dag";
import CustomTaskNodeDesigner from "Components/TaskNodeDesigner";
import CustomTaskNodeExecution from "Components/TaskNodeExecution";
import CustomTaskNodeModel from "./CustomTaskNodeModel";

export default class CustomTaskNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super("custom");
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new CustomTaskNodeModel();
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.diagramModel.locked) {
      return <CustomTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <CustomTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
