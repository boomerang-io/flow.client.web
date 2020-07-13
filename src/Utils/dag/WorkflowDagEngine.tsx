import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import CustomTaskNodeFactory from "./customTaskNode/CustomTaskNodeFactory";
import SimplePortFactory from "./simplePort/SimplePortFactory";
import StartEndNodeFactory from "./startEndNode/StartEndNodeFactory";
import StartEndNodeModel from "./startEndNode/StartEndNodeModel";
import StartEndPortModel from "./startEndNode/StartEndPortModel";
import SwitchLinkFactory from "./switchLink/SwitchLinkFactory";
import SwitchNodeFactory from "./switchNode/SwitchNodeFactory";
import SwitchPortModel from "./switchNode/SwitchPortModel";
import TaskLinkFactory from "./taskLink/TaskLinkFactory";
import TaskPortModel from "./taskPort/TaskPortModel";
import TemplateTaskNodeFactory from "./templateTaskNode/TemplateTaskNodeFactory";
import { NodeType } from "Constants";

interface IDagModel {
  dag: object;
  isModelLocked: boolean;
}

export default class WorkflowDagEngine {
  activeModel: DiagramModel | undefined;
  diagramEngine: DiagramEngine;

  constructor({ dag, isModelLocked }: IDagModel) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    this.diagramEngine.registerNodeFactory(new TemplateTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new SwitchNodeFactory());

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

    this.newModel(dag, isModelLocked);
  }

  newModel(dag: object, modelIsLocked: boolean) {
    this.activeModel = new DiagramModel();
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
                this.activeModel?.removeLink(event.link);
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
