import { DefaultLinkModel } from "@boomerang/boomerang-dag";
import merge from "lodash/merge";

export default class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super("custom");
    this.state = 0;
  }

  /*remove() {
    if (this.getSourcePort() != null) {
      console.log("removing source port");
      this.getSourcePort().removeLink(this);
    }
    if (this.getTargetPort() != null) {
      console.log("removing target port");
      this.getTargetPort().removeLink(this);
    }
    //super.remove();
  }*/

  serialize() {
    return merge(super.serialize(), {
      linkId: this.id,
      state: this.state
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.id = data.linkId;
    this.state = data.state;
  }
}
