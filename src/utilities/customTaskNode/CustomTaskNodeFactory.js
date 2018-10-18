import React from "react";
import { AbstractNodeFactory } from "storm-react-diagrams";
import CustomTaskNode from "Features/WorkflowEditor/TaskNode";
import CustomTaskNodeModel from "./CustomTaskNodeModel";

export default class CustomTaskNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("custom");
  }

  generateReactWidget(diagramEngine, node) {
    diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    return <CustomTaskNode node={node} />;
  }

  getNewInstance() {
    return new CustomTaskNodeModel();
  }
}
