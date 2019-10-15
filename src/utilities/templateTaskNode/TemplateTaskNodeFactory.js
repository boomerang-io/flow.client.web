import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import CustomNodeDesigner from "Components/TemplateTaskNodeDesigner";
import CustomNodeExecution from "Components/TemplateTaskNodeExecution";
import TemplateTaskNodeModel from "./TemplateTaskNodeModel";

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
    if (diagramEngine.diagramModel.locked) {
      return <CustomNodeExecution node={node} diagramEngine={diagramEngine} />;
    } else {
      return <CustomNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
