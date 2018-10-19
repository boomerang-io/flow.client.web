import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import { DiagramWidget } from "@boomerang/boomerang-dag";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import TaskTray from "Components/TaskTray";
import ActionBar from "./ActionBar";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "Utilities/DiagramApplication";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import keys from "lodash/keys";
import "./styles.scss";

class WorkflowEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication(props.workflowSerialization);
    this.state = {
      hasCreated: false
    }
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasktemplate`);
  }

  handleOnAction = () => {
    if(this.state.hasCreated) {
      this.handleOnSave();
    } else {
      this.handleOnCreate();
    }
  }

  handleOnCreate = () => {
    const serialization = this.getDiagramSerialization();
    console.log(JSON.stringify(serialization));

    axios.post(`${BASE_SERVICE_URL}/workflow`,serialization).then(response => {
    const workflowConfigObj = {
      workflowId: response.data.id,
      nodes: this.formatWorkflowConfigNodes()
    }
    return axios.post(`${BASE_SERVICE_URL}/taskconfiguration`, workflowConfigObj)})
    .then(response => {
      notify(<Notification type="success" title="Create Workflow" message="Succssfully saved workflow" />);
      this.setState({
        hasCreated: true
      })
    }).catch(error => {
      console.error("Create workflow error:", error);
      notify(<Notification type="error" title="Something's wrong" message="Failed to saved workflow" />)
    })
  };

  handleOnSave = () => {
    const serialization = this.getDiagramSerialization();
    axios.put(`${BASE_SERVICE_URL}/workflow`,serialization).then(response => {
          const workflowConfigObj = {
      id: this.props.workflowConfig.id,
      workflowId: this.props.workflowConfig.workflowId,
      nodes: this.formatWorkflowConfigNodes()
    }
    return axios.post(`${BASE_SERVICE_URL}/taskconfiguration`, workflowConfigObj)}).
    then(() => {
      notify(<Notification type="success" title="Update Workflow" message="Succssfully updated workflow" />);
    }).catch(error => {
      console.error("Create workflow error:", error);
      notify(<Notification type="error" title="Something's wrong" message="Failed to update workflow" />)
    })
  }

  getDiagramSerialization() {
    return this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
  }

  formatWorkflowConfigNodes(){
      return Object.values(this.props.workflowConfig.nodes);
  }

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
    return (
      <>
        <ActionBar actionButtonText={this.state.hasCreated ? "Save" : "Create"} onClick={this.handleOnAction} />
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

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflowConfig: state.workflowConfig.fetch
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowEditorContainer);
