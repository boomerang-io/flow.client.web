import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowConfigActions } from "State/workflowConfig/fetch";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import Creator from "./Creator";
import Editor from "./Editor";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import DiagramApplication from "Utilities/DiagramApplication";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import keys from "lodash/keys";

class WorkflowManagerContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    workflow: PropTypes.object,
    workflowConfigActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.diagramApp = new DiagramApplication(props.workflow);
  }

  componentDidMount() {
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasktemplate`);
  }

  componentWillUnmount() {
    this.props.tasksActions.reset();
    this.props.workflowConfigActions.reset();
  }

  //TODO: should use combined redux store for this
  handleOnCreate = () => {
    const serialization = this.getDiagramSerialization();
    console.log("Workflow serialization:", serialization);

    return axios
      .post(`${BASE_SERVICE_URL}/workflow`, serialization)
      .then(response => {
        const workflowConfigObj = {
          workflowId: response.data.id, //workflowId
          nodes: this.formatWorkflowConfigNodes()
        };
        return axios.post(`${BASE_SERVICE_URL}/taskconfiguration`, workflowConfigObj);
      })
      .then(response => {
        notify(<Notification type="success" title="Create Workflow" message="Succssfully created workflow" />);
        return Promise.resolve(response.data.id); //workflowConfigId
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow" />);
        return Promise.reject(error);
      });
  };

  //TODO: should use combined redux store for this
  handleOnUpdate = ({ workflowConfigId }) => {
    const serialization = this.getDiagramSerialization();
    console.log("Workflow serialization:", serialization);
    return axios
      .put(`${BASE_SERVICE_URL}/workflow`, serialization)
      .then(response => {
        const workflowConfigObj = {
          id: workflowConfigId,
          workflowId: response.data.id, //workflowId
          nodes: this.formatWorkflowConfigNodes()
        };
        return axios.put(`${BASE_SERVICE_URL}/taskconfiguration`, workflowConfigObj);
      })
      .then(response => {
        notify(<Notification type="success" title="Update Workflow" message="Succssfully updated workflow" />);
        return Promise.resolve(response);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to update workflow" />);
        return Promise.reject(error);
      });
  };

  getDiagramSerialization() {
    return this.diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
  }

  formatWorkflowConfigNodes() {
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
    if (this.props.tasks.isFetching) {
      return <LoadingAnimation theme="bmrg-white" />;
    }

    if (this.props.tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <Switch>
          <Route
            path="/editor/:workflowId"
            render={props => (
              <Editor
                createNode={this.createNode}
                diagramApp={this.diagramApp}
                handleOnUpdate={this.handleOnUpdate}
                {...props}
              />
            )}
          />
          <Route
            path="/editor"
            render={props => (
              <Creator
                createNode={this.createNode}
                diagramApp={this.diagramApp}
                handleOnCreate={this.handleOnCreate}
                handleOnUpdate={this.handleOnUpdate}
                {...props}
              />
            )}
          />
        </Switch>
      );
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => ({
  tasks: state.tasks,
  workflowConfig: state.workflowConfig.fetch,
  workflow: state.workflow.fetch.data.find(workflow => workflow.id === ownProps.match.params.workflowId)
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowConfigActions: bindActionCreators(workflowConfigActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowManagerContainer);
