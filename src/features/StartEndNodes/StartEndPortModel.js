import merge from "lodash/merge";
import { LinkModel, DiagramEngine, PortModel, DefaultLinkModel } from "storm-react-diagrams";
import CustomLink from "../BodyWidget/components/CustomLink";

export default class StartEndPortModel extends PortModel {
  //position: string | "top" | "bottom" | "left" | "right";

  constructor(pos) {
    super(pos, "startend");
    this.position = pos;
  }

  serialize() {
    return merge(super.serialize(), {
      position: this.position
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.position = data.position;
  }

  createLinkModel() {
    return new DefaultLinkModel();
    //return new CustomLink();
  }
}
