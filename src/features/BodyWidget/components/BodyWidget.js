import React from "react";
import _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "../Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";

import { IngestCSVNodeModel } from "../../IngestCSV/IngestCSVNodeModel";
import Navbar from "@boomerang/boomerang-components/lib/Navbar";

/**
 * @author Dylan Vorster
 */
export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let trayItems = this.props.tasks.data.map(task => (
      <TrayItemWidget model={{ type: task.id, name: task.name }} name={task.name} color="rgb(129,17,81)" />
    ));

    return (
      <div className="body">
        <div className="title">
          <Navbar
            navbarLinks={[]}
            //user={user}
            isAdmin={true}
            hasOnBoardingExperience={true}
            onboardingExperienceCharacter="?"
            handleOnOnboardingExperienceClick={{}}
          />
        </div>
        <div className="content">
          <TrayWidget>{trayItems}</TrayWidget>
          <div
            className="diagram-layer"
            onDrop={event => {
              var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
              var nodesCount = _.keys(
                this.props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getNodes()
              ).length;

              var node = null;
              //if (data.type === "in") {
              //  node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(192,255,0)");
              //  node.addInPort("In");
              //} else if (data.type === "out") {
              //  node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
              //  node.addOutPort("Out");
              //} else {
              // pass id as the third parameter
              node = new IngestCSVNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type, data.name);

              var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
              node.x = points.x;
              node.y = points.y;
              this.props.app
                .getDiagramEngine()
                .getDiagramModel()
                .addNode(node);
              this.forceUpdate();
            }}
            onDragOver={event => {
              event.preventDefault();
            }}
          >
            <DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
          </div>
        </div>
      </div>
    );
  }
}
