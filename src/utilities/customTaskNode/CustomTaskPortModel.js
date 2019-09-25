import { PortModel } from "@projectstorm/react-diagrams";
import CustomLinkModel from "Utilities/customLink/CustomLinkModel";
import merge from "lodash/merge";

export default class CustomTaskPortModel extends PortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "custom");
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position,
      nodePortId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.position = data.position;
    this.id = data.nodePortId;
  }

  createLinkModel() {
    return new CustomLinkModel();
  }

  canLinkToPort(target) {
    return target.position === "left" && this.position === "right";
  }
}
