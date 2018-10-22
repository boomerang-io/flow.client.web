import { DefaultLinkModel } from "@boomerang/boomerang-dag";

export default class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super("custom");
    this.executionCondition = "always";
  }

  serialize() {
    return {
      ...super.serialize(),
      linkId: this.id,
      executionCondition: this.executionCondition
    };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.linkId;
    this.executionCondition = data.executionCondition;
  }
}
