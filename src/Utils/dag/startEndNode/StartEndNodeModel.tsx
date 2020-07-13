import { DiagramEngine, NodeModel } from "@projectstorm/react-diagrams";
import StartEndPortModel from "./StartEndPortModel";
import { NodeType } from "Constants";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  passedName: string;
  //list all three params
  constructor({ passedName = "" }: { passedName: string }) {
    super(NodeType.StartEnd);

    this.passedName = passedName;
    if (this.passedName === "End") {
      // this.addPort(new StartEndPortModel("left", false));
      this.addPort(new StartEndPortModel({ pos: "left" }));
    } else if (this.passedName === "Start") {
      // this.addPort(new StartEndPortModel("right", true));
      this.addPort(new StartEndPortModel({ pos: "right" }));
    }
  }

  serialize() {
    return merge(super.serialize(), {
      passedName: this.passedName,
      nodeId: this.id,
    });
  }

  deSerialize(data: { passedName: string; nodeId: string }, engine: DiagramEngine) {
    super.deSerialize(data, engine);
    this.passedName = data.passedName;
    this.id = data.nodeId;
  }
}
