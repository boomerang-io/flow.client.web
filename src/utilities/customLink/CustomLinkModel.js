import { DefaultLinkModel } from "@boomerang/boomerang-dag";

export default class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super("custom");
    this.executionCondition = "ALWAYS";
  }

  serialize() {
    return {
      ...super.serialize(),
      linkId: this.id,
      state: this.state,
      executionCondition: this.executionCondition
    };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.linkId;
    this.state = data.state;
    this.executionCondition = data.executionCondition;
  }
}
