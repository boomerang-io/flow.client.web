import { AbstractNodeFactory } from "storm-react-diagrams";
import StartEndNodeWidget from "./StartEndNodeWidget/index";
import StartEndNodeModel from "./StartEndNodeModel";
import React from "react";

export default class StartEndNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("startend");
  }

  generateReactWidget(diagramEngine, node) {
    //diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    return <StartEndNodeWidget node={node} />;
  }

  getNewInstance() {
    return new StartEndNodeModel();
  }
}
