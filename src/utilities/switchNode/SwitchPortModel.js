import { PortModel } from "@boomerang/boomerang-dag";
import SwitchLinkModel from "Utilities/switchLink/SwitchLinkModel";
import merge from "lodash/merge";

export default class SwitchPortModel extends PortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "decision");
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
    return new SwitchLinkModel();
  }
}
