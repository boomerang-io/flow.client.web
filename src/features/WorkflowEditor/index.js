import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as nodesActions } from "State/nodes";
import { actions as tasksActions } from "State/tasks";
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
  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication(props.workflowSerialization);
  }

  componentDidMount() {
    const { match } = this.props;
    const { workflowId } = match.params;
    this.props.workflowConfigActions.fetch(`${BASE_SERVICE_URL}/taskconfiguration/workflow/${workflowId}`);
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasks`);
  }

  handleOnSave = () => {
    const serialization = this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
    console.log(JSON.stringify(serialization));
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
    this.props.workflowConfigActions.addNode({ nodeId: id, taskId, config: {} });

    const points = this.diagramApp.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
  };

  render() {
    if (
      this.props.workflowConfig.fetch.status === REQUEST_STATUSES.SUCCESS &&
      this.props.tasks.status == REQUEST_STATUSES.SUCCESS
    ) {
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
    return null;
  }
}

const mapStateToProps = (state, ownProps) => ({
  tasks: state.tasks,
  workflowConfig: state.workflowConfig,
  workflowSerialization: state.workflow.fetch.data.find(workflow => workflow.id === ownProps.match.params.workflowId)
});

const mapDispatchToProps = dispatch => ({
  nodesActions: bindActionCreators(nodesActions, dispatch),
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch),
  workflowUpdateActions: bindActionCreators(workflowUpdateActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowEditorContainer);
