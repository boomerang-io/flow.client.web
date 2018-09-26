import { NodeModel } from "storm-react-diagrams";
import StartEndPortModel from "./StartEndPortModel";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(name, color) {
    super("startend");
    if (name === "End") {
      this.addPort(new StartEndPortModel("left"));
      console.log("a left port has been added");
    } else {
      this.addPort(new StartEndPortModel("right"));
      console.log("a right port has been added");
    }
    this.passed_name = name;
  }
}
