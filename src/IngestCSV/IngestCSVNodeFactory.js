import { AbstractNodeFactory } from "storm-react-diagrams";
import { IngestCSVNodeWidget } from "./IngestCSVNodeWidget";
import { IngestCSVNodeModel } from "./IngestCSVNodeModel";
import React from "react";

export class IngestCSVNodeFactory extends AbstractNodeFactory {
  constructor() {
    super("ingestcsv");
  }

  generateReactWidget(diagramEngine, node) {
    return <IngestCSVNodeWidget node={node} />;
  }

  getNewInstance() {
    return new IngestCSVNodeModel();
  }
}
