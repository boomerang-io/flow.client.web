import { AbstractNodeFactory } from "@boomerang/boomerang-dag";
import StartEndNode from "Components/WorkflowStartEndNode";
import StartEndNodeModel from "Utilities/startEndNode/StartEndNodeModel";
import React from "react";

export default class StartEndNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("startend");
  }

  generateReactWidget(diagramEngine, node) {
    //diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    return <StartEndNode node={node} />;
  }

  getNewInstance() {
    return new StartEndNodeModel();
  }
}
