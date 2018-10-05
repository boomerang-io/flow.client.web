import React from "react";
import CustomLinkModel from "./CustomLinkModel";
import { DefaultLinkFactory, DefaultLinkWidget } from "storm-react-diagrams";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";

export default class CustomLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "custom";
  }

  handleOnDelete = model => {
    model.remove();
  };

  getNewInstance = () => {
    return new CustomLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    console.log("generate Link Segment");

    //<CloseModalButton className="bmrg-deleteNode" onClick={this.handleOnDelete} model={model} />
    return super.generateLinkSegment(model, widget, selected, path);
  }
}
