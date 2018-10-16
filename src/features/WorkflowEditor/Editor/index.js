import React, { Component } from "react";
import { actions as nodeActions } from "State/nodes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DiagramWidget } from "storm-react-diagrams";
import TaskTray from "./TaskTray";
import DiagramTaskNode from "Components/DiagramTaskNode";
import keys from "lodash/keys";

export class Editor extends Component {
  state = {};

  render() {
    return (
      <>
        <TaskTray />
        <div className="content">
          <div
            className="diagram-layer"
            onDrop={event => {
              var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
              var nodesCount = keys(
                this.props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getNodes()
              ).length;

              var node = null;
              node = new DiagramTaskNode("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type); //, data.name);

              //add node info to the state
              const { id, type, taskId, taskName } = node;
              //this.props.nodeActions.addNode({ id, type, taskId, taskName, config: {} });
              this.props.nodeActions.addNode({ nodeId: id, taskId, config: {} });

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
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.props.app.getDiagramEngine()}
              maxNumberPointsPerLink={0}
              //smartRouting={true}
              deleteKeys={[]}
            />
          </div>
        </div>
      </>
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
)(Editor);
