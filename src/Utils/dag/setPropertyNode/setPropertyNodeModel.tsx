import { DiagramEngine } from "@projectstorm/react-diagrams";
import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utils/dag/taskPort/TaskPortModel";
import merge from "lodash/merge";
import { NodeType } from "Constants";

export default class SetPropertyNodeModel extends NodeModel {
  taskId: string;
  taskName: string;
  currentVersion: number;

  constructor({ taskId, taskName, taskVersion }: { taskId: string; taskName: string; taskVersion: number }) {
    super(NodeType.SetProperty);
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

  deSerialize(
    data: { taskId: string; nodeId: string; taskName: string; taskVersion: number; currentVersion: number },
    engine: DiagramEngine
  ) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    this.id = data.nodeId;
    this.taskName = data.taskName;
    this.currentVersion = data.taskVersion || data.currentVersion;
  }
}
