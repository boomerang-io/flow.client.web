import React from "react";
import { DefaultLinkFactory, DefaultLinkWidget } from "storm-react-diagrams";
import CustomLinkModel from "./CustomLinkModel";
import CloseModalButton from "@boomerang/boomerang-components/lib/CloseModalButton";
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

  // {super.generateLinkSegment(model, widget, selected, path)}
  //<CloseModalButton className="bmrg-deleteLink" onClick={() => this.handleOnDelete(model)} />

  generateLinkSegment(model, widget, selected, path) {
    console.log("generate Link Segment");
    return (
      <g>
        <CustomLink model={model} path={path} />
      </g>
    );
  }
}
