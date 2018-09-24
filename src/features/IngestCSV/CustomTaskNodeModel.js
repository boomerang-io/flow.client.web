import { NodeModel } from "storm-react-diagrams";
import { IngestCSVPortModel } from "./CustomTaskPortModel";

export class IngestCSVNodeModel extends NodeModel {
  //list all three params
  constructor(name, color, taskId, taskName) {
    super("ingestcsv");
    this.addPort(new IngestCSVPortModel("left"));
    this.addPort(new IngestCSVPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
  }
}
