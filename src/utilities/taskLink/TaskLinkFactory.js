import React from "react";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import TaskLinkModel from "./TaskLinkModel";
import TaskLink from "Components/TaskLink";

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
    return (
      <g>
        <TaskLink model={model} path={path} diagramEngine={this.diagramEngine} />
      </g>
    );
  }
}
