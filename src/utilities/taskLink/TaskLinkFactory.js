import React from "react";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import TaskLinkModel from "./TaskLinkModel";
import TaskLinkDesigner from "Components/TaskLinkDesigner";
import TaskLinkExecution from "Components/TaskLinkExecution";

export default class TaskLinkFactory extends DefaultLinkFactory {
  constructor(diagramEngine) {
    super();
    this.diagramEngine = diagramEngine;
    this.type = "task";
  }

  getNewInstance = () => {
    return new TaskLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    if (this.diagramEngine.diagramModel.locked) {
      return (
        <g>
          <TaskLinkExecution model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    }
    return (
      <g>
        <TaskLinkDesigner model={model} path={path} diagramEngine={this.diagramEngine} />
      </g>
    );
  }
}
