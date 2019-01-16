import { DefaultLinkModel } from "@boomerang/boomerang-dag";

export default class SwitchLinkModel extends DefaultLinkModel {
  constructor() {
    super("decision");
    this.switchCondition = "default";
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
    this.id = data.linkId;
    this.switchCondition = data.switchCondition;
  }
}
