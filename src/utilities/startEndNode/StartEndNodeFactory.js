import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import StartEndNode from "Components/StartEndNode";
import StartEndNodeModel from "Utilities/startEndNode/StartEndNodeModel";
import { NodeType } from "Constants";
import React from "react";

export default class StartEndNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(NodeType.StartEnd);
  }

  generateReactWidget(diagramEngine, node) {
    //diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    return <StartEndNode isLocked={diagramEngine.diagramModel.locked} node={node} />;
  }

  getNewInstance() {
    return new StartEndNodeModel();
  }
}
