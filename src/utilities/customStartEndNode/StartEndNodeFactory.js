import { AbstractNodeFactory } from "storm-react-diagrams";
import StartEndNode from "Components/DiagramStartEndNode";
import StartEndNodeModel from "Utilities/customStartEndNode/StartEndNodeModel";
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
