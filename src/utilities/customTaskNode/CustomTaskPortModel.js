import { PortModel } from "storm-react-diagrams";
import CustomLinkModel from "Utilities/customLink/CustomLinkModel";
import merge from "lodash/merge";

export default class CustomTaskPortModel extends PortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "customTaskNode");
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
