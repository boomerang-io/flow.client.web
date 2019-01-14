import React from "react";
import { AbstractNodeFactory } from "@boomerang/boomerang-dag";
import SwitchNodeDesigner from "Components/SwitchNodeDesigner";
import SwitchNodeExecution from "Components/SwitchNodeExecution";
import SwitchNodeModel from "./SwitchNodeModel";

export default class SwitchNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super("decision");
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new SwitchNodeModel();
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.diagramModel.locked) {
      return <SwitchNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <SwitchNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
