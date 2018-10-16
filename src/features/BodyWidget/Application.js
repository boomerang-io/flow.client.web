//import SRD from "storm-react-diagrams";
import { DiagramEngine, DiagramModel, DefaultNodeModel } from "storm-react-diagrams";

//ingestcsv files
//import { IngestCSVPortModel } from "../IngestCSV/IngestCSVPortModel";
import { IngestCSVNodeFactory } from "../IngestCSV/customTaskNodeFactory";
import { IngestCSVNodeModel } from "../IngestCSV/CustomTaskNodeModel";
import StartEndNodeFactory from "../StartEndNodes/StartEndNodeFactory";
import StartEndNodeModel from "../StartEndNodes/StartEndNodeModel";

import StartEndPortModel from "../StartEndNodes/StartEndPortModel";
import { SimplePortFactory } from "../IngestCSV/SimplePortFactory";
import CustomTaskPortModel from "../IngestCSV/CustomTaskPortModel";
import CustomLinkFactory from "./components/CustomLinkFactory";

/**
 * @author Dylan Vorster
 */
export class Application {
  constructor() {
    this.diagramEngine = new DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.diagramEngine.registerNodeFactory(new IngestCSVNodeFactory());
    this.diagramEngine.registerNodeFactory(new StartEndNodeFactory());

    //need to find a way to register port factory
    this.diagramEngine.registerPortFactory(new SimplePortFactory("startend", config => new StartEndPortModel()));
    this.diagramEngine.registerPortFactory(new SimplePortFactory("ingestcsv", config => new CustomTaskPortModel()));

    //register new custom link
    this.diagramEngine.registerLinkFactory(new CustomLinkFactory());

    this.newModel();
  }

  newModel() {
    this.activeModel = new DiagramModel();

    //test for deserialization
    /*let str = {
      id: "4169aabb-6e89-4a51-9598-80074b05614e",
      offsetX: 0,
      offsetY: 0,
      zoom: 100,
      gridSize: 0,
      links: [],
      nodes: [
        {
          id: "91009467-bf9d-49d2-8606-be3a5cabdcd6",
          type: "startend",
          selected: false,
          x: 300,
          y: 400,
          extras: {},
          ports: [
            {
              id: "1036aa15-5349-40f3-b111-65b30fc1f841",
              type: "startend",
              selected: false,
              name: "right",
              parentNode: "91009467-bf9d-49d2-8606-be3a5cabdcd6",
              links: [],
              position: "right"
            }
          ],
          passed_name: "Start"
        },
        {
          id: "4fc95243-3138-44ff-bb7e-db0c064aa6f0",
          type: "startend",
          selected: false,
          x: 1300,
          y: 400,
          extras: {},
          ports: [
            {
              id: "1f17988e-9292-4858-b742-3c1b31d9b2b7",
              type: "startend",
              selected: false,
              name: "left",
              parentNode: "4fc95243-3138-44ff-bb7e-db0c064aa6f0",
              links: [],
              position: "left"
            }
          ],
          passed_name: "End"
        },
        {
          id: "39bb3bce-b7e1-4cbd-9213-3ab304281828",
          type: "ingestcsv",
          selected: false,
          x: 862,
          y: 205,
          extras: {},
          ports: [
            {
              id: "3db0100b-a8af-473b-a436-d846a6227b21",
              type: "ingestcsv",
              selected: false,
              name: "left",
              parentNode: "39bb3bce-b7e1-4cbd-9213-3ab304281828",
              links: [],
              position: "left"
            },
            {
              id: "01b3f7b3-6479-4100-b725-a6a04e56e9df",
              type: "ingestcsv",
              selected: false,
              name: "right",
              parentNode: "39bb3bce-b7e1-4cbd-9213-3ab304281828",
              links: [],
              position: "right"
            }
          ],
          taskId: "5b92f794844d0700016ea214",
          taskName: "Download File"
        }
      ]
    };
    this.activeModel.deSerializeDiagram(str, this.diagramEngine);*/

    this.diagramEngine.setDiagramModel(this.activeModel);

    var EndNode = new StartEndNodeModel("Finish", "rgb(192,255,0)");
    EndNode.setPosition(1300, 400);
    var StartNode = new StartEndNodeModel("Start", "rgb(192,255,0)");
    StartNode.setPosition(300, 400);

    this.activeModel.addAll(StartNode, EndNode);
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
