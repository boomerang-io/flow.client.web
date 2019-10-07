import { PointModel } from "@projectstorm/react-diagrams";

export default class CustomPointModel extends PointModel {
  constructor() {
    super("customPoint");
    console.log("custom point called");
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
