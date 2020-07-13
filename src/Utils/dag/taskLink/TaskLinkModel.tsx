import { DefaultLinkModel, DiagramEngine } from "@projectstorm/react-diagrams";
import { NodeType } from "Constants";

export default class TaskLinkModel extends DefaultLinkModel {
  executionCondition: string;
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

  deSerialize(data: { executionCondition: string }, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.executionCondition = data.executionCondition;
  }
}
