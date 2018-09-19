import { AbstractNodeFactory } from "storm-react-diagrams";
import { DiamonNodeWidget } from "./DiamondNodeWidget";
import { DiamondNodeModel } from "./DiamondNodeModel";
import React from "react";

export class DiamondNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("diamond");
  }

  generateReactWidget(diagramEngine, node) {
    return <DiamonNodeWidget node={node} />;
  }

  getNewInstance() {
    return new DiamondNodeModel();
  }
}
