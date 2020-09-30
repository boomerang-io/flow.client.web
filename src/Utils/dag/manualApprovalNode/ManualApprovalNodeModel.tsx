import { DiagramEngine } from "@projectstorm/react-diagrams";
import { NodeModel } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utils/dag/taskPort/TaskPortModel";
import { NodeType } from "Constants/index";
import merge from "lodash/merge";

export default class ManualApprovalNodeModel extends NodeModel {
  taskId: string;
  taskName: string;
  currentVersion: number;

  //list all three params
  constructor({ taskId, taskName, taskVersion }: { taskId: string; taskName: string; taskVersion: number }) {
    super(NodeType.Approval);
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

  deSerialize(
    data: { taskId: string; nodeId: string; taskName: string; taskVersion: number; currentVersion: number },
    engine: DiagramEngine
  ) {
    super.deSerialize(data, engine);
    this.id = data.nodeId;
    this.taskId = data.taskId;
    this.taskName = data.taskName;
    this.currentVersion = data.taskVersion || data.currentVersion;
  }
}
