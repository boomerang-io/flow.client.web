//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import WaitNodeDesigner from "Components/WaitNodeDesigner";
import WaitNodeExecution from "Components/WaitNodeExecution";
import WaitNodeModel from "./waitNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class WaitNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.Wait);
    //@ts-ignore
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    //@ts-ignore
    return new WaitNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <WaitNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <WaitNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
