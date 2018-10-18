import merge from "lodash/merge";
import { PortModel } from "@boomerang/boomerang-dag";
import CustomLinkModel from "Utilities/customLink/CustomLinkModel";

export default class StartEndPortModel extends PortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "startend");
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position,
      portId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.position = data.position;
    this.id = data.portId;
  }

  createLinkModel() {
    //return new DefaultLinkModel();
    return new CustomLinkModel();
  }
}
