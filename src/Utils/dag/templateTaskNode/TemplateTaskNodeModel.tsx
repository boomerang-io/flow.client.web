import { DiagramEngine } from "@projectstorm/react-diagrams";
import { DiagramModel, NodeModel, NodeModelListener } from "@projectstorm/react-diagrams";
import TaskPortModel from "Utils/dag/taskPort/TaskPortModel";
import merge from "lodash/merge";
import { NodeType } from "Constants";

interface nodeInterface extends NodeModel<NodeModelListener> {
  index: number;
  id: string;
  taskId: string;
  taskName: string;
}

interface nodesInterface {
  [key: string]: nodeInterface;
}

interface diagramEngineInterface extends DiagramEngine {
  getDiagramModel: () => diagramModelInterface;
  // getDiagramModel: () => string;
}

interface diagramModelInterface extends DiagramModel {
  getNodes: () => nodesInterface;
  // getNodes: () => nodeInterface
}

export default class TemplateTaskNodeModel extends NodeModel {
  taskId: string;
  taskName: string;
  currentVersion: number;

  constructor({ taskId, taskName, taskVersion }: { taskId: string; taskName: string; taskVersion: number }) {
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

  deSerialize(
    data: { taskId: string; nodeId: string; taskName: string; taskVersion: number; currentVersion: number },
    engine: diagramEngineInterface
  ) {
    super.deSerialize(data, engine);
    this.taskId = data.taskId;
    this.id = data.nodeId;
    this.taskName = data.taskName;
    this.currentVersion = data.taskVersion || data.currentVersion;
  }
}
