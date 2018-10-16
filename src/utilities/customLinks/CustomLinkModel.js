import { DefaultLinkModel } from "storm-react-diagrams";

export default class CustomLinkModel extends DefaultLinkModel {
  constructor() {
    super("customLink");
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
}
