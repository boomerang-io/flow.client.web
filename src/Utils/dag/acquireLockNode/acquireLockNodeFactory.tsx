//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import TemplateTaskNodeDesigner from "Components/TemplateTaskNodeDesigner";
import TemplateTaskNodeExecution from "Components/TemplateTaskNodeExecution";
import AcquireLockNodeModel from "./AcquireLockNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class acquireLockNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.Acquirelock);
    //@ts-ignore
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    //@ts-ignore
    return new AcquireLockNodeModel({});
  }

  generateReactWidget(diagramEngine, node) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <TemplateTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <TemplateTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
