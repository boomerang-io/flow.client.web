import { NodeModel } from "storm-react-diagrams";
import CustomTaskPortModel from "./CustomTaskPortModel";

export class IngestCSVNodeModel extends NodeModel {
  //list all three params
  constructor(name, color, taskId, taskName) {
    super("ingestcsv");
    this.addPort(new CustomTaskPortModel("left"));
    this.addPort(new CustomTaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
  }
}
