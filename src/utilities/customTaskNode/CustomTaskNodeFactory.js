import React from "react";
import { AbstractNodeFactory } from "@boomerang/boomerang-dag";
import CustomTaskNodeDesigner from "Components/TaskNode/designer.js";
import CustomTaskNodeExecution from "Components/TaskNode/execution.js";
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
    //console.log(diagramEngine.diagramModel.locked);
    if (diagramEngine.diagramModel.locked) {
      //console.log("rendering  TaskNode in Execution mode");
      return <CustomTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      //console.log("rendering  TaskNode in Designer mode");
      return <CustomTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
