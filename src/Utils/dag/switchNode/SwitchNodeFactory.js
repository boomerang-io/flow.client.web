import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import SwitchNodeDesigner from "Components/SwitchNodeDesigner";
import SwitchNodeExecution from "Components/SwitchNodeExecution";
import SwitchNodeModel from "./SwitchNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class SwitchNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.Decision);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new SwitchNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <SwitchNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <SwitchNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
