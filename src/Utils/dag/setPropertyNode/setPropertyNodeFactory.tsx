//@ts-nocheck
import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import TemplateTaskNodeDesigner from "Components/TemplateTaskNodeDesigner";
import TemplateTaskNodeExecution from "Components/TemplateTaskNodeExecution";
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
      return <TemplateTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <TemplateTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
