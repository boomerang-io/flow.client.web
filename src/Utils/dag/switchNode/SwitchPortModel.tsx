import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";
import SwitchLinkModel from "Utils/dag/switchLink/SwitchLinkModel";
import merge from "lodash/merge";
import { NodeType } from "Constants";

export default class SwitchPortModel extends PortModel {
  position?: string;
  constructor({ pos }: { pos: string }) {
    super(pos, NodeType.Decision);
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position,
      nodePortId: this.id,
    });
  }

  deSerialize(data: { position: string; nodePortId: string }, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.position = data.position;
    this.id = data.nodePortId;
  }

  createLinkModel() {
    return new SwitchLinkModel();
  }

  //TODO: narrow down and import the specific port models
  canLinkToPort(target: any) {
    return target.position === "left" && this.position === "right";
  }

  //TODO: narrow down and import the specific port models
  link(port: any) {
    let link = this.createLinkModel();
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link;
  }
}
