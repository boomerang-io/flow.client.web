import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as nodesActions } from "State/nodes";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { actions as workflowUpdateActions } from "State/workflow/update";
import { DiagramWidget } from "storm-react-diagrams";
import ActionBar from "./ActionBar";
import TaskTray from "./TaskTray";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "Utilities/DiagramApplication";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import keys from "lodash/keys";
import "./styles.scss";

class WorkflowEditorContainer extends Component {
  diagramApp = new DiagramApplication();

  componentDidMount() {
    const { match } = this.props;
    const { workflowId } = match.params;
    this.props.workflowConfigActions.fetch(`${BASE_SERVICE_URL}/taskconfiguration/workflow/${workflowId}`);
  }

  handleOnSave = () => {
    const serialization = this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
    /*console.log("we are saving");
    console.log(serialization);
    console.log(this.props.nodes.nodes);
    console.log(JSON.stringify(serialization));
    console.log(JSON.stringify(this.props.nodes.nodes));*/
    //placeholder for service call to export serialization and node configs

    /*
      TODO: create the task configuration structure to be passed back. 
      -need to turn object of objects into array of objects
      -grab workflow id

    */
    //let task_configurations = this.props.nodes.nodes;
    const task_configurations = Object.values(this.props.nodes.nodes.entities);
    const workflowId = this.diagramApp.getDiagramEngine().getDiagramModel().id;
    const task_configurations_output = { nodes: task_configurations, workflowId: workflowId };
    console.log(task_configurations_output);
    //task_configurations_output to be passed to service call

    console.log("task_configurations");
    console.log(task_configurations);
    console.log(task_configurations.map(({ id }) => ({ nodeId: id })));
  };

  createNode = event => {
    const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
    const nodesCount = keys(
      this.diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).length;

    const node = new CustomTaskNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type);

    //add node info to the state
    const { id, taskId } = node;
    this.props.nodesActions.addNode({ nodeId: id, taskId, config: {} });

    const points = this.diagramApp.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    console.log(
      JSON.stringify(
        this.diagramApp
          .getDiagramEngine()
          .getDiagramModel()
          .serializeDiagram()
      )
    );
  };

  render() {
    return (
      <>
        <ActionBar onSave={this.handleOnSave} />
        <TaskTray />
        <div className="content">
          <div
            className="diagram-layer"
            onDrop={this.createNode}
            onDragOver={event => {
              event.preventDefault();
            }}
          >
            <DiagramWidget
              className="srd-demo-canvas"
              diagramEngine={this.diagramApp.getDiagramEngine()}
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

const mapStateToProps = (state, ownProps) => ({
  workflowConfig: state.workflowConfig,
  workflowSerialization: state.workflow.fetch.data.find(workflow => workflow.id === ownProps.match.params.workflowId)
});

const mapDispatchToProps = dispatch => ({
  nodesActions: bindActionCreators(nodesActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch),
  workflowUpdateActions: bindActionCreators(workflowUpdateActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowEditorContainer);
