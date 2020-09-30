import React from "react";
import { AbstractNodeFactory } from "@projectstorm/react-diagrams";
import ManualApprovalNodeDesigner from "Components/ManualApprovalNodeDesigner";
import ManualApprovalNodeExecution from "Components/ManualApprovalNodeExecution";
import ManualApprovalNodeModel from "./ManualApprovalNodeModel";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class ManualApprovalNodeFactory extends AbstractNodeFactory {
  constructor(diagramEngine) {
    super(NodeType.Approval);
    this.diagramEngine = diagramEngine;
  }

  getNewInstance() {
    return new ManualApprovalNodeModel({});
  }

  // generateReactWidget(diagramEngine: diagramEngineInterface, node: ManualApprovalNodeModel) {
  generateReactWidget(diagramEngine, node) {
    if (diagramEngine.mode === WorkflowDagEngineMode.Executor) {
      return <ManualApprovalNodeExecution node={node} />;
    } else {
      return <ManualApprovalNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
