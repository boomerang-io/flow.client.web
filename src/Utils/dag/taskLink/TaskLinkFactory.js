import React from "react";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import TaskLinkModel from "./TaskLinkModel";
import TaskLinkDesigner from "Components/TaskLinkDesigner";
import TaskLinkExecution from "Components/TaskLinkExecution";
import StartEndLinkDesigner from "Components/StartEndLinkDesigner";
import StartEndLinkExecution from "Components/StartEndLinkExecution";
import { NodeType, WorkflowDagEngineMode } from "Constants";

export default class TaskLinkFactory extends DefaultLinkFactory {
  constructor(diagramEngine) {
    super();
    this.diagramEngine = diagramEngine;
    this.type = NodeType.Task;
  }

  getNewInstance = () => {
    return new TaskLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    // If diagram model is locked we can infer that the app is viewing the activity execution
    const sourcePortType = model?.sourcePort?.type;
    const isExecutionMode = this.diagramEngine.mode === WorkflowDagEngineMode.Executor;
    if (sourcePortType === NodeType.StartEnd) {
      if (isExecutionMode) {
        return (
          <g>
            <StartEndLinkExecution model={model} path={path} diagramEngine={this.diagramEngine} />
          </g>
        );
      }
      return (
        <g>
          <StartEndLinkDesigner model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    }

    if (isExecutionMode) {
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
