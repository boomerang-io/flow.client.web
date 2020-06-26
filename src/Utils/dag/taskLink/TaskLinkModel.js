import { DefaultLinkModel } from "@projectstorm/react-diagrams";
import { NodeType } from "Constants";

export default class TaskLinkModel extends DefaultLinkModel {
  constructor() {
    super(NodeType.Task);
    this.executionCondition = "always";
  }

  serialize() {
    return {
      ...super.serialize(),
      executionCondition: this.executionCondition,
      linkId: this.id,
    };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    //this.id = data.linkId;
    this.executionCondition = data.executionCondition;
  }
}
