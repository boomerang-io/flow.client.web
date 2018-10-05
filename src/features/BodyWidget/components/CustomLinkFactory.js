import React from "react";
import CustomLinkModel from "./CustomLinkModel";
import { DefaultLinkFactory, DefaultLinkWidget } from "storm-react-diagrams";
import CustomLinkWidget from "./CustomLinkWidget";

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
    return (
      <g>
        <CustomLinkWidget model={model} path={path} />
      </g>
    );
  }
}
