import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import NODE_TYPES from "Constants/nodeTypes";

export default class SwitchLinkModel extends DefaultLinkModel {
  constructor() {
    super(NODE_TYPES.DECISION);
    this.switchCondition = null;
  }

  serialize() {
    return {
      ...super.serialize(),
      linkId: this.id,
      switchCondition: this.switchCondition
    };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    //this.id = data.linkId;
    this.switchCondition = data.switchCondition;
  }
}
