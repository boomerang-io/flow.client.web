import { NodeModel, DefaultPortModel } from "storm-react-diagrams";
import StartEndPortModel from "./StartEndPortModel";
import React, { Component } from "react";
import merge from "lodash/merge";

export default class StartEndNodeModel extends NodeModel {
  //list all three params
  constructor(passed_name, color) {
    //console.log("startend props");
    //console.log(this.props);
    super("startend");
    if (passed_name === "End") {
      this.addPort(new StartEndPortModel("left"));
      //this.addInPort("left");
      console.log("a left port has been added");
    } else {
      this.addPort(new StartEndPortModel("right"));
      //this.addOutPort("left");
      console.log("a right port has been added");
    }
    this.passed_name = passed_name;
  }

  serialize() {
    return merge(super.serialize(), {
      passed_name: this.passed_name
    });
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.passed_name = data.passed_name;
  }
}
