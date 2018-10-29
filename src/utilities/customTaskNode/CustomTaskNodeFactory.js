import React from "react";
import { AbstractNodeFactory } from "@boomerang/boomerang-dag";
import CustomTaskNode from "Components/TaskNode";
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
    return <CustomTaskNode node={node} diagramEngine={diagramEngine} />;
  }
}
