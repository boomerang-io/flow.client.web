import React from "react";
import _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "../Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";

import { actions as nodeActions } from "../BodyWidgetContainer/reducer/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { IngestCSVNodeModel } from "../../IngestCSV/CustomTaskNodeModel";
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
    console.log(this.props);
    let trayItems = this.props.tasks.data.map(task => (
      <TrayItemWidget
        model={{ type: task.id, name: task.name, task_data: task }}
        name={task.name}
        color="rgb(129,17,81)"
      />
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
              node = new IngestCSVNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type, data.name);

              //want to create a new data structure to pass for node
              //need node.ID, task_data.key, config = {}
              let nodeObj = {
                id: node.getID(),
                type: data.task_data.key,
                config: []
              };
              console.log("new nodeObj");
              console.log(nodeObj);
              //add node info to the state
              this.props.nodeActions.addNode(nodeObj);
              //this.props.nodeActions.addNode(data.task_data);

              var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
              node.x = points.x;
              node.y = points.y;
              this.props.app
                .getDiagramEngine()
                .getDiagramModel()
                .addNode(node);
              this.forceUpdate();
              console.log(
                JSON.stringify(
                  this.props.app
                    .getDiagramEngine()
                    .getDiagramModel()
                    .serializeDiagram()
                )
              );
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

const mapStateToProps = state => {
  return { nodes: state };
};

const mapDispatchToProps = dispatch => ({
  nodeActions: bindActionCreators(nodeActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyWidget);
