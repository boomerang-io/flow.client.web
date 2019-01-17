import merge from "lodash/merge";
import { DefaultPortModel } from "@boomerang/boomerang-dag";
import CustomLinkModel from "Utilities/customLink/CustomLinkModel";

export default class StartEndPortModel extends DefaultPortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "startend");
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
    //return new DefaultLinkModel();
    return new CustomLinkModel();
  }
}
