import merge from "lodash/merge";
import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";
import CustomLinkModel from "Utils/dag/taskLink/TaskLinkModel";
import { NodeType } from "Constants";

export default class StartEndPortModel extends PortModel {
  position: string;
  constructor({ pos }: { pos: string }) {
    super(pos, NodeType.StartEnd);
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

  canLinkToPort(target: any) {
    if (this.position === "right" && target.position === "left") {
      return true;
    }
    return false;
  }

  createLinkModel() {
    return new CustomLinkModel();
  }
}
