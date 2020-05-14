import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utilities/taskPort/TaskPortModel";
import { NodeType } from "Constants";
import merge from "lodash/merge";

export default class CustomTaskNodeModel extends NodeModel {
  //list all three params
  constructor({ taskId, taskName, taskVersion }) {
    super(NodeType.CustomTask);
    this.addPort(new TaskPortModel("left"));
    this.addPort(new TaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
    this.currentVersion = taskVersion;
  }

  serialize() {
    return merge(super.serialize(), {
      nodeId: this.id,
      taskId: this.taskId,
      taskName: this.taskName,
      taskVersion: this.currentVersion,
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.nodeId;
    this.taskId = data.taskId;
    this.taskName = data.taskName;
    this.currentVersion = data.taskVersion || data.currentVersion;
  }
}
