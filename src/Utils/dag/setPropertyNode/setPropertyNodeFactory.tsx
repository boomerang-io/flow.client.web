//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import SetPropertyNodeDesigner from "Components/SetPropertyNodeDesigner";
import SetPropertyNodeExecution from "Components/SetPropertyNodeExecution";
import SetPropertyNodeModel from "./setPropertyNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class SetPropertyNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.SetProperty);
    //@ts-ignore
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    //@ts-ignore
    return new SetPropertyNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <SetPropertyNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <SetPropertyNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
