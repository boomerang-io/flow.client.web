import React from "react";
import { DefaultLinkFactory } from "@boomerang/boomerang-dag";
import CustomLinkModel from "./CustomLinkModel";
import CustomLink from "Components/WorkflowLink";

export default class CustomLinkFactory extends DefaultLinkFactory {
  constructor() {
    super();
    this.type = "custom";
  }

  /*handleOnDelete = model => {
    model.remove();
  };*/

  getNewInstance = () => {
    return new CustomLinkModel();
  };

  generateLinkSegment(model, widget, selected, path) {
    console.log("generate Link Segment");
    return (
      <g>
        <CustomLink model={model} path={path} />
      </g>
    );
  }
}
