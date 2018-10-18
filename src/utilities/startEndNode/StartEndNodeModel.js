import { NodeModel } from "@boomerang/boomerang-dag";
import StartEndPortModel from "./StartEndPortModel";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(passedName, color) {
    super("startend");
    //console.log("startend props");
    //console.log(this.props);
    this.passedName = passedName;
    if (this.passedName === "Finish") {
      this.addPort(new StartEndPortModel("left"));
      //this.addInPort("left");
      console.log("adding left");
    } /*else {
      this.addPort(new StartEndPortModel("right"));
      //this.addOutPort("left");
      console.log("adding right");
    }*/ else if (
      this.passedName === "Start"
    ) {
      this.addPort(new StartEndPortModel("right"));
      //this.addInPort("left");
      console.log("adding right");
    }
  }

  serialize() {
    return merge(super.serialize(), {
      passedName: this.passedName,
      nodeId: this.id
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.passedName = data.passedName;
    this.id = data.nodeId;
  }
}
