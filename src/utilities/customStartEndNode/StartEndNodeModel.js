import { NodeModel, DefaultPortModel } from "storm-react-diagrams";
import StartEndPortModel from "./StartEndPortModel";
import React, { Component } from "react";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(passedName, color) {
    //console.log("startend props");
    //console.log(this.props);
    super("startend");
    if (passedName === "Finish") {
      this.addPort(new StartEndPortModel("left"));
      //this.addInPort("left");
      console.log("a left port has been added");
    } else {
      this.addPort(new StartEndPortModel("right"));
      //this.addOutPort("left");
      console.log("a right port has been added");
    }
    this.passedName = passedName;
  }

  serialize() {
    return merge(super.serialize(), {
      passedName: this.passedName
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.passedName = data.passedName;
  }
}
