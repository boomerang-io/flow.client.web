//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import SetStatusNodeDesigner from "Components/SetPropertyNodeDesigner";
import SetStatusNodeExecution from "Components/SetPropertyNodeExecution";
import SetStatusNodeModel from "./setStatusNodeModel";
import { NodeType, WorkflowEngineMode } from "Constants";

export default class SetStatusNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.SetStatus);
    //@ts-ignore
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    //@ts-ignore
    return new SetStatusNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowEngineMode.Executor) {
      return <SetStatusNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <SetStatusNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
