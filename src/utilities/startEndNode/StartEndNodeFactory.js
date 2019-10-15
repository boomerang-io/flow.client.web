import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import StartEndNode from "Components/StartEndNode";
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
