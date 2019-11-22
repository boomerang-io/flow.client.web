import React from "react";
import { DefaultLinkFactory } from "@projectstorm/react-diagrams";
import SwitchLinkModel from "./SwitchLinkModel";
import SwitchLinkDesigner from "Components/SwitchLinkDesigner";
import SwitchLinkExecution from "Components/SwitchLinkExecution";

export default class SwitchLinkFactory extends DefaultLinkFactory {
  constructor(diagramEngine) {
    super();
    this.type = "decision";
    this.diagramEngine = diagramEngine;
  }

  getNewInstance = () => {
    return new SwitchLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    if (this.diagramEngine.diagramModel.locked) {
      return (
        <g>
          <SwitchLinkExecution model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    } else {
      return (
        <g>
          <SwitchLinkDesigner model={model} path={path} diagramEngine={this.diagramEngine} />
        </g>
      );
    }
  }
}
