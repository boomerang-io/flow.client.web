import { NodeModel } from "storm-react-diagrams";
import { IngestCSVPortModel } from "./IngestCSVPortModel";

export class IngestCSVNodeModel extends NodeModel {
  constructor() {
    super("ingestcsv");
    this.addPort(new IngestCSVPortModel("left"));
    this.addPort(new IngestCSVPortModel("right"));
  }
}
