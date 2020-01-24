import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import NODE_TYPES from "Constants/nodeTypes";

export default class TaskLinkModel extends DefaultLinkModel {
  constructor() {
    super(NODE_TYPES.TASK);
    this.executionCondition = "always";
  }

  serialize() {
    return {
      ...super.serialize(),
      executionCondition: this.executionCondition,
      linkId: this.id
    };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    //this.id = data.linkId;
    this.executionCondition = data.executionCondition;
  }
}
