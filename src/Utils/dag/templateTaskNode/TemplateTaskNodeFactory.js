import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import TemplateTaskNodeDesigner from "Components/TemplateTaskNodeDesigner";
import TemplateTaskNodeExecution from "Components/TemplateTaskNodeExecution";
import TemplateTaskNodeModel from "./TemplateTaskNodeModel";
import { WorkflowDagEngineMode } from "Constants";

export default class TemplateTaskNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super("templateTask");
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new TemplateTaskNodeModel({});
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
