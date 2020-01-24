import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utilities/taskPort/TaskPortModel";
import merge from "lodash/merge";
import NODE_TYPES from "Constants/nodeTypes";

export default class TemplateTaskNodeModel extends NodeModel {
  constructor({ taskId, taskName }) {
    super(NODE_TYPES.TEMPLATE_TASK);
    this.addPort(new TaskPortModel("left"));
    this.addPort(new TaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
  }

  serialize() {
    return merge(super.serialize(), {
      taskId: this.taskId,
      nodeId: this.id,
      taskName: this.taskName
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    this.id = data.nodeId;
    this.taskName = data.taskName;
  }
}
