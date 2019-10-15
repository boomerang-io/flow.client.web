//import SRD from "@projectstorm/react-diagrams";
import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import TaskLinkFactory from "./taskLink/TaskLinkFactory";
import TemplateTaskNodeFactory from "./templateTaskNode/TemplateTaskNodeFactory";
import TaskPortModel from "./taskPort/TaskPortModel";
import StartEndNodeFactory from "./startEndNode/StartEndNodeFactory";
import StartEndNodeModel from "./startEndNode/StartEndNodeModel";
import StartEndPortModel from "./startEndNode/StartEndPortModel";
import SimplePortFactory from "./simplePort/SimplePortFactory";
import SwitchLinkFactory from "./switchLink/SwitchLinkFactory";
import SwitchNodeFactory from "./switchNode/SwitchNodeFactory";
import SwitchPortModel from "./switchNode/SwitchPortModel";

export default class Application {
  constructor({ dag, modelIsLocked }) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new TemplateTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    this.diagramEngine.registerNodeFactory(new SwitchNodeFactory());

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(new SimplePortFactory("startend", config => new StartEndPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("task", config => new TaskPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("decision", config => new SwitchPortModel()));

    //register new custom link
    this.diagramEngine.registerLinkFactory(new TaskLinkFactory(this.diagramEngine));
    this.diagramEngine.registerLinkFactory(new SwitchLinkFactory(this.diagramEngine));

    this.newModel(dag, modelIsLocked);
  }

  newModel(dag, modelIsLocked) {
    this.activeModel = new DiagramModel();
    if (dag) {
      this.activeModel.deSerializeDiagram(dag, this.diagramEngine);
    } else {
      const startNode = new StartEndNodeModel("Start");
      startNode.setPosition(300, 400);

      const endNode = new StartEndNodeModel("End");
      endNode.setPosition(1000, 400);

      this.activeModel.addAll(startNode, endNode);
    }

    this.diagramEngine.setDiagramModel(this.activeModel);

    if (modelIsLocked) {
      this.activeModel.setLocked(true);
    }

    // Register event listeners for linkUpdated
    // We are listenigng on the create event and deleting it if
    // it doesn't have a target port
    this.activeModel.addListener({
      linksUpdated: event => {
        if (event.isCreated) {
          document.addEventListener("mouseup", e => {
            setTimeout(() => {
              if (!event.link.targetPort) {
                this.activeModel.removeLink(event.link);
                this.diagramEngine.repaintCanvas();
                document.removeEventListener("mouseup", null);
              }
            }, 0);
          });
        }
      }
    });
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}

export const createWorkflowRevisionBody = (diagramApp, changeLogReason, workflowRevisionConfig = {}) => {
  const dagProps = {};
  dagProps["dag"] = getDiagramSerialization(diagramApp);
  dagProps["config"] = formatWorkflowConfigNodes(workflowRevisionConfig);
  dagProps["changelog"] = {
    reason: changeLogReason
  };
  return dagProps;
};

const getDiagramSerialization = diagramApp => {
  return diagramApp
    .getDiagramEngine()
    .getDiagramModel()
    .serializeDiagram();
};

const formatWorkflowConfigNodes = workflowRevisionConfig => {
  return { nodes: Object.values(workflowRevisionConfig) };
};
