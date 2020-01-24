import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import StartEndNode from "Components/StartEndNode";
import StartEndNodeModel from "Utilities/startEndNode/StartEndNodeModel";
import NODE_TYPES from "Constants/nodeTypes";
import React from "react";

export default class StartEndNodeFactory extends AbstractNodeFactory {
  constructor() {
    super(NODE_TYPES.START_END);
  }

  generateReactWidget(diagramEngine, node) {
    //diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    return <StartEndNode isLocked={diagramEngine.diagramModel.locked} node={node} />;
  }

  getNewInstance() {
    return new StartEndNodeModel();
  }
}
