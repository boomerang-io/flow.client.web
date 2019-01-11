import { NodeModel } from "@boomerang/boomerang-dag";
import CustomTaskPortModel from "./CustomTaskPortModel";
import merge from "lodash/merge";

export default class CustomTaskNodeModel extends NodeModel {
  //list all three params
  constructor(name, color, taskId, taskName) {
    super("custom");
    this.addPort(new CustomTaskPortModel("left"));
    this.addPort(new CustomTaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = "";
  }

  serialize() {
    return merge(super.serialize(), {
      taskId: this.taskId,
      nodeId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    this.id = data.nodeId;
  }
}
