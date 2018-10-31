//import SRD from "@boomerang/boomerang-dag";
import { DiagramEngine, DiagramModel } from "@boomerang/boomerang-dag";
import CustomTaskNodeFactory from "./customTaskNode/CustomTaskNodeFactory";
import StartEndNodeFactory from "./startEndNode/StartEndNodeFactory";
import StartEndNodeModel from "./startEndNode/StartEndNodeModel";
import StartEndPortModel from "./startEndNode/StartEndPortModel";
import SimplePortFactory from "./simplePort/SimplePortFactory";
import CustomTaskPortModel from "./customTaskNode/CustomTaskPortModel";
import CustomLinkFactory from "./customLink/CustomLinkFactory";

export default class Application {
  constructor({ serialization, modelIsLocked }) {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new CustomTaskNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(new SimplePortFactory("startend", config => new StartEndPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("custom", config => new CustomTaskPortModel()));

    //register new custom link
    this.diagramEngine.registerLinkFactory(new CustomLinkFactory(this.diagramEngine));

    this.newModel(serialization, modelIsLocked);
  }

  newModel(serialization, modelIsLocked) {
    this.activeModel = new DiagramModel();
    if (serialization) {
      this.activeModel.deSerializeDiagram(serialization, this.diagramEngine);
    } else {
      console.log("new");
      const EndNode = new StartEndNodeModel("Finish", "rgb(192,255,0)");
      EndNode.setPosition(1300, 400);

      const StartNode = new StartEndNodeModel("Start", "rgb(192,255,0)");
      StartNode.setPosition(300, 400);

      this.activeModel.addAll(StartNode, EndNode);
    }

    this.diagramEngine.setDiagramModel(this.activeModel);

    if (modelIsLocked) {
      this.activeModel.setLocked(true);
    }
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
