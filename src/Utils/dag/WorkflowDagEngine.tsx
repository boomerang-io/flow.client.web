// @ts-nocheck
import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import StartEndNodeModel from "./startEndNode/StartEndNodeModel";
import StartEndPortModel from "./startEndNode/StartEndPortModel";
import SwitchPortModel from "./switchNode/SwitchPortModel";
import TaskPortModel from "./taskPort/TaskPortModel";
import AcquireLockNodeFactory from "./acquireLockNode/acquireLockNodeFactory";
import CustomTaskNodeFactory from "./customTaskNode/CustomTaskNodeFactory";
import ManualApprovalNodeFactory from "./manualApprovalNode/ManualApprovalNodeFactory";
import ManualTaskNodeFactory from "./manualTaskNode/ManualTaskNodeFactory";
import ReleaseLockNodeFactory from "./releaseLockNode/releaseLockNodeFactory";
import RunScheduledWorkflowNodeFactory from "./runScheduledWorkflowNode/RunScheduledWorkflowNodeFactory";
import RunWorkflowNodeFactory from "./runWorkflowNode/RunWorkflowNodeFactory";
import ScriptNodeFactory from "./scriptNode/ScriptNodeFactory";
import SetPropertyNodeFactory from "./setPropertyNode/setPropertyNodeFactory";
import SetStatusNodeFactory from "./setStatusNode/setStatusNodeFactory";
import SimplePortFactory from "./simplePort/SimplePortFactory";
import StartEndNodeFactory from "./startEndNode/StartEndNodeFactory";
import SwitchLinkFactory from "./switchLink/SwitchLinkFactory";
import SwitchNodeFactory from "./switchNode/SwitchNodeFactory";
import TaskLinkFactory from "./taskLink/TaskLinkFactory";
import TemplateTaskNodeFactory from "./templateTaskNode/TemplateTaskNodeFactory";
import WaitNodeFactory from "./waitNode/waitNodeFactory";

import { NodeType, WorkflowDagEngineMode } from "Constants";

interface DagModel {
  dag: object | null;
  mode?: string;
}

export default class WorkflowDagEngine {
  activeModel: DiagramModel | undefined;
  diagramEngine: DiagramEngine;

  constructor({ dag, mode = WorkflowDagEngineMode.Editor }: DagModel) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new AcquireLockNodeFactory());
    this.diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new ManualApprovalNodeFactory());
    this.diagramEngine.registerNodeFactory(new ManualTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new ReleaseLockNodeFactory());
    this.diagramEngine.registerNodeFactory(new RunScheduledWorkflowNodeFactory());
    this.diagramEngine.registerNodeFactory(new RunWorkflowNodeFactory());
    this.diagramEngine.registerNodeFactory(new SetPropertyNodeFactory());
    this.diagramEngine.registerNodeFactory(new SetStatusNodeFactory());
    this.diagramEngine.registerNodeFactory(new ScriptNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    this.diagramEngine.registerNodeFactory(new SwitchNodeFactory());
    this.diagramEngine.registerNodeFactory(new TemplateTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new WaitNodeFactory());
    this.diagramEngine.mode = mode;

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(
      new SimplePortFactory(NodeType.StartEnd, () => new StartEndPortModel({ pos: "" }))
    );
    this.diagramEngine.registerPortFactory(new SimplePortFactory(NodeType.Task, () => new TaskPortModel()));
    this.diagramEngine.registerPortFactory(
      new SimplePortFactory(NodeType.Decision, () => new SwitchPortModel({ pos: "" }))
    );

    //register new custom link
    this.diagramEngine.registerLinkFactory(new TaskLinkFactory(this.diagramEngine));
    this.diagramEngine.registerLinkFactory(new SwitchLinkFactory(this.diagramEngine));

    let isModelLocked = false;
    if (mode === WorkflowDagEngineMode.Executor || mode === WorkflowDagEngineMode.Viewer) {
      isModelLocked = true;
    }

    this.diagramEngine.locked = isModelLocked;
    this.newModel(dag, isModelLocked, mode);
  }

  newModel(dag: object, modelIsLocked: boolean, mode: string) {
    this.activeModel = new DiagramModel();
    this.activeModel.mode = mode;
    if (dag) {
      this.activeModel.deSerializeDiagram(dag, this.diagramEngine);
    } else {
      const startNode = new StartEndNodeModel({ passedName: "Start" });
      startNode.setPosition(300, 400);

      const endNode = new StartEndNodeModel({ passedName: "End" });
      endNode.setPosition(1000, 400);

      this.activeModel.addAll(startNode, endNode);
    }

    this.diagramEngine.setDiagramModel(this.activeModel);

    if (modelIsLocked) {
      this.activeModel.setLocked(true);
    }

    // Register event listeners for linkUpdated
    // We are listening on the create event and deleting it if
    // it doesn't have a target port
    this.activeModel.addListener({
      linksUpdated: (event) => {
        if (event.isCreated) {
          document.addEventListener("mouseup", (e: MouseEvent) => {
            setTimeout(() => {
              if (!event.link.targetPort) {
                this?.activeModel?.removeLink(event.link);
                this.diagramEngine.repaintCanvas();
              }
            }, 0);
          });
        }
      },
    });
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}

export const createWorkflowRevisionBody = (
  diagramApp: WorkflowDagEngine,
  changeLogReason: string,
  workflowRevisionConfig = {}
) => {
  const dag = getDiagramSerialization(diagramApp);
  const config = formatWorkflowConfigNodes(workflowRevisionConfig);
  const changelog = {
    reason: changeLogReason,
  };
  return { dag, config, changelog };
};

const getDiagramSerialization = (diagramApp: WorkflowDagEngine): object => {
  return diagramApp.getDiagramEngine().getDiagramModel().serializeDiagram();
};

const formatWorkflowConfigNodes = (workflowRevisionConfig: object) => {
  return { nodes: Object.values(workflowRevisionConfig) };
};
