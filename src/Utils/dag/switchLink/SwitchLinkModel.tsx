import { DiagramEngine, DefaultLinkModel } from "@projectstorm/react-diagrams";
import { NodeType } from "Constants";

export default class SwitchLinkModel extends DefaultLinkModel {
  switchCondition: string | null;
  constructor() {
    super(NodeType.Decision);
    this.switchCondition = null;
  }

  serialize() {
    return {
      ...super.serialize(),
      linkId: this.id,
      switchCondition: this.switchCondition,
    };
  }

  deSerialize(data: { switchCondition: string }, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.switchCondition = data.switchCondition;
  }
}
