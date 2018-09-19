//import SRD from "storm-react-diagrams";
import { DiagramEngine, DiagramModel, DefaultNodeModel, SimplePortFactory } from "storm-react-diagrams";

//ingestcsv files
//import { IngestCSVPortModel } from "../IngestCSV/IngestCSVPortModel";
import { IngestCSVNodeFactory } from "../IngestCSV/IngestCSVNodeFactory";
import { IngestCSVNodeModel } from "../IngestCSV/IngestCSVNodeModel";

//import { DiamondPortModel } from "../DiamondNode/DiamondPortModel";
import { DiamondNodeFactory } from "../DiamondNode/DiamondNodeFactory";
import { DiamondNodeModel } from "../DiamondNode/DiamondNodeModel";

/**
 * @author Dylan Vorster
 */
export class Application {
  //protected activeModel: SRD.DiagramModel;
  //protected diagramEngine: SRD.DiagramEngine;

  constructor() {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new IngestCSVNodeFactory());
    //this.diagramEngine.registerNodeFactory(new DiamondNodeFactory());

    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);

    //3-A) create a default node
    var node1 = new DefaultNodeModel("Start", "rgb(0,192,255)");
    let port = node1.addOutPort("Out");
    node1.setPosition(100, 100);

    //3-B) create another default node
    var node2 = new DefaultNodeModel("End", "rgb(192,255,0)");
    let port2 = node2.addInPort("In");
    node2.setPosition(400, 100);

    //test ingestcsvnode
    var node3 = new IngestCSVNodeModel("ingestcsv", "rgb(129,17,81)");
    node3.setPosition(200, 300);

    // link the ports
    //let link1 = port.link(port2);

    this.activeModel.addAll(node1, node2, node3);
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
