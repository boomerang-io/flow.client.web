import { NodeModel } from "storm-react-diagrams";
import CustomTaskPortModel from "./CustomTaskPortModel";
import merge from "lodash/merge";

export class IngestCSVNodeModel extends NodeModel {
  //list all three params
  constructor(name, color, taskId) {
    super("ingestcsv");
    this.addPort(new CustomTaskPortModel("left"));
    this.addPort(new CustomTaskPortModel("right"));
    this.taskId = taskId;
    //this.taskName = taskName;
  }

  serialize() {
    return merge(super.serialize(), {
      taskId: this.taskId
      //taskName: this.taskName
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    //this.taskName = data.taskName;
  }
}
