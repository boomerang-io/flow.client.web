import { DiagramEngine, PortModel } from "@projectstorm/react-diagrams";
import TaskLinkModel from "Utils/dag/taskLink/TaskLinkModel";
import merge from "lodash/merge";

export default class TemplatePortModel extends PortModel {
  position: string;

  constructor({ position }: { position: string }) {
    super(position, "template");
    this.position = position;
  }

  serialize() {
    return merge(super.serialize(), {
      nodePortId: this.id,
      position: this.position,
    });
  }

  deSerialize(data: { nodePortId: string; position: string }, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.id = data.nodePortId;
    this.position = data.position;
  }

  createLinkModel() {
    return new TaskLinkModel();
  }

  //TODO: narrow down and import the specific port models
  canLinkToPort(target: any) {
    return target.position === "left" && this.position === "right";
  }
}
