import React from "react";
import { DefaultLinkFactory } from "@boomerang/boomerang-dag";
import SwitchLinkModel from "./SwitchLinkModel";
import SwitchLink from "Components/SwitchLink";

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
    return (
      <g>
        <SwitchLink model={model} path={path} handleRemove={this.handleOnRemove} diagramEngine={this.diagramEngine} />
      </g>
    );
  }
}
