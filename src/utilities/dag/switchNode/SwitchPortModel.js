import { PortModel } from "@projectstorm/react-diagrams";
import SwitchLinkModel from "Utilities/dag/switchLink/SwitchLinkModel";
import merge from "lodash/merge";
import { NodeType } from "Constants";

export default class SwitchPortModel extends PortModel {
  constructor(pos) {
    super(pos, NodeType.Decision);
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position,
      nodePortId: this.id,
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.position = data.position;
    this.id = data.nodePortId;
  }

  createLinkModel() {
    return new SwitchLinkModel();
  }

  canLinkToPort(target) {
    return target.position === "left" && this.position === "right";
  }

  link(port) {
    let link = this.createLinkModel();
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link;
  }
}
