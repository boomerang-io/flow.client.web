import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utilities/dag/taskPort/TaskPortModel";
import merge from "lodash/merge";
import { NodeType } from "Constants";

export default class TemplateTaskNodeModel extends NodeModel {
  constructor({ taskId, taskName, taskVersion }) {
    super(NodeType.TemplateTask);
    this.addPort(new TaskPortModel("left"));
    this.addPort(new TaskPortModel("right"));
    this.taskId = taskId;
    this.taskName = taskName;
    this.currentVersion = taskVersion;
  }

  serialize() {
    return merge(super.serialize(), {
      taskId: this.taskId,
      nodeId: this.id,
      taskName: this.taskName,
      taskVersion: this.currentVersion,
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    this.id = data.nodeId;
    this.taskName = data.taskName;
    this.currentVersion = data.taskVersion || data.currentVersion;
  }
}
