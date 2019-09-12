//import SRD from "@projectstorm/react-diagrams";
import { DiagramEngine, DiagramModel } from "@projectstorm/react-diagrams";
import CustomTaskNodeFactory from "./customTaskNode/CustomTaskNodeFactory";
import StartEndNodeFactory from "./startEndNode/StartEndNodeFactory";
import StartEndNodeModel from "./startEndNode/StartEndNodeModel";
import StartEndPortModel from "./startEndNode/StartEndPortModel";
import SimplePortFactory from "./simplePort/SimplePortFactory";
import CustomTaskPortModel from "./customTaskNode/CustomTaskPortModel";
import CustomLinkFactory from "./customLink/CustomLinkFactory";
import SwitchLinkFactory from "./switchLink/SwitchLinkFactory";
import SwitchNodeFactory from "./switchNode/SwitchNodeFactory";
import SwitchPortModel from "./switchNode/SwitchPortModel";

export default class Application {
  constructor({ dag, modelIsLocked }) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());
    this.diagramEngine.registerNodeFactory(new SwitchNodeFactory());

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(new SimplePortFactory("startend", config => new StartEndPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("custom", config => new CustomTaskPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("decision", config => new SwitchPortModel()));

    //register new custom link
    this.diagramEngine.registerLinkFactory(new CustomLinkFactory(this.diagramEngine));
    this.diagramEngine.registerLinkFactory(new SwitchLinkFactory(this.diagramEngine));

    this.newModel(dag, modelIsLocked);
  }

  newModel(dag, modelIsLocked) {
    this.activeModel = new DiagramModel();
    if (dag) {
      this.activeModel.deSerializeDiagram(dag, this.diagramEngine);
    } else {
      const EndNode = new StartEndNodeModel("Finish", "rgb(192,255,0)");
      EndNode.setPosition(1000, 400);

      const StartNode = new StartEndNodeModel("Start", "rgb(192,255,0)");
      StartNode.setPosition(300, 400);

      this.activeModel.addAll(StartNode, EndNode);
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
            console.log(event);
            if (!event.link.targetPort) {
              this.activeModel.removeLink(event.link);
              this.diagramEngine.repaintCanvas();
              document.removeEventListener("mouseup", null);
            }
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
