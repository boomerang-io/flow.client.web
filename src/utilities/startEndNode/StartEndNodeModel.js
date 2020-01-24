import { NodeModel } from "@projectstorm/react-diagrams";
import StartEndPortModel from "./StartEndPortModel";
import NODE_TYPES from "Constants/nodeTypes";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(passedName, color) {
    super(NODE_TYPES.START_END);

    this.passedName = passedName;
    if (this.passedName === "End") {
      this.addPort(new StartEndPortModel("left", false));
    } else if (this.passedName === "Start") {
      this.addPort(new StartEndPortModel("right", true));
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
