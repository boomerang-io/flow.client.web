import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utilities/taskPort/TaskPortModel";
import NODE_TYPES from "Constants/nodeTypes";
import merge from "lodash/merge";

export default class CustomTaskNodeModel extends NodeModel {
  //list all three params
  constructor({ taskId, taskName }) {
    super(NODE_TYPES.CUSTOM_TASK);
    this.addPort(new TaskPortModel("left"));
    this.addPort(new TaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
  }

  serialize() {
    return merge(super.serialize(), {
      nodeId: this.id,
      taskId: this.taskId,
      taskName: this.taskName
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.nodeId;
    this.taskId = data.taskId;
    this.taskName = data.taskName;
  }
}
