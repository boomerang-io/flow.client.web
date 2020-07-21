import React from "react";
import { DiagramEngine, DiagramModel, AbstractNodeFactory } from "@projectstorm/react-diagrams";
import CustomTaskNodeDesigner from "Components/CustomTaskNodeDesigner";
import CustomTaskNodeExecution from "Components/CustomTaskNodeExecution";
import CustomTaskNodeModel from "./CustomTaskNodeModel";
import { NodeType } from "Constants";

interface nodeInterface extends CustomTaskNodeModel {
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
}

interface diagramModelInterface extends DiagramModel {
  getNodes: () => nodesInterface;
  // getNodes: () => nodeInterface
}

export default class CustomTaskNodeFactory extends AbstractNodeFactory {
  // constructor(diagramEngine) {
  //   super(NodeType.CustomTask);
  //   this.diagramEngine = diagramEngine;
  // }

  constructor() {
    super(NodeType.CustomTask);
  }

  getNewInstance() {
    return new CustomTaskNodeModel({ taskId: "", taskName: "", taskVersion: 0 });
  }

  generateReactWidget(diagramEngine: diagramEngineInterface, node: CustomTaskNodeModel) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (diagramEngine.diagramModel.locked) {
      // return <CustomTaskNodeExecution node={node} diagramEngine={diagramEngine} />;
      return <CustomTaskNodeExecution node={node} />;
    } else {
      return <CustomTaskNodeDesigner node={node} diagramEngine={diagramEngine} />;
    }
  }
}
