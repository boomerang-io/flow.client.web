//import SRD from "storm-react-diagrams";
import { DiagramEngine, DiagramModel, DefaultNodeModel, SimplePortFactory } from "storm-react-diagrams";

//ingestcsv files
//import { IngestCSVPortModel } from "../IngestCSV/IngestCSVPortModel";
import { IngestCSVNodeFactory } from "../IngestCSV/IngestCSVNodeFactory";
import { IngestCSVNodeModel } from "../IngestCSV/IngestCSVNodeModel";

/**
 * @author Dylan Vorster
 */
export class Application {
  constructor() {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new IngestCSVNodeFactory());

    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);

    //3-A) create a default node
    var node1 = new DefaultNodeModel("Start", "rgb(0,192,255)");
    let port = node1.addOutPort("Out");
    node1.setPosition(400, 100);

    //3-B) create another default node
    var node2 = new DefaultNodeModel("End", "rgb(192,255,0)");
    let port2 = node2.addInPort("In");
    node2.setPosition(800, 100);

    this.activeModel.addAll(node1, node2);

    console.log("serialized diagram:");
    console.log(JSON.stringify(this.activeModel.serializeDiagram()));
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
