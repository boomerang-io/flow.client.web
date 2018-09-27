import React from "react";
import { AbstractNodeFactory } from "storm-react-diagrams";
import IngestCSVNodeWidget from "./CustomTaskNodeWidget";
import { IngestCSVNodeModel } from "./CustomTaskNodeModel";

export class IngestCSVNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("ingestcsv");
  }

  generateReactWidget(diagramEngine, node) {
    diagramEngine.registerNodeFactory(new IngestCSVNodeFactory());
    return <IngestCSVNodeWidget node={node} />;
  }

  getNewInstance() {
    return new IngestCSVNodeModel();
  }
}
