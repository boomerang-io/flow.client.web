import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import Creator from "./Creator";
import EditorContainer from "./EditorContainer";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import keys from "lodash/keys";

class WorkflowManagerContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.newOverviewData = {};
  }

  componentDidMount() {
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasktemplate`);
  }

  componentWillUnmount() {
    this.props.tasksActions.reset();
    this.props.workflowActions.reset();
    this.props.workflowRevisionActions.reset();
  }

  handleOnOverviewChange = overviewData => {
    this.newOverviewData = overviewData;
  };

  createWorkflow = diagramApp => {
    const { workflowActions, workflowRevisionActions, activeTeamId } = this.props;

    return workflowActions
      .create(`${BASE_SERVICE_URL}/workflow`, { ...this.newOverviewData, flowTeamId: activeTeamId })
      .then(response => {
        const dagProps = this.createWorkflowRevisionBody(diagramApp);
        const workflowId = response.data.id;

        const workflowRevision = {
          ...dagProps,
          workflowId
        };

        return workflowRevisionActions.create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, workflowRevision);
      })
      .then(() => {
        notify(
          <Notification type="success" title="Create Workflow" message="Succssfully created workflow and revision" />
        );
        return Promise.resolve();
      })
      .catch(err => {
        console.log(err);
        notify(
          <Notification type="error" title="Something's wrong" message="Failed to create workflow and revision" />
        );
        return Promise.reject();
      });
  };

  createWorkflowRevision = diagramApp => {
    const { workflow, workflowRevisionActions } = this.props;

    const workflowId = workflow.data.id;
    const body = this.createWorkflowRevisionBody(diagramApp);

    workflowRevisionActions
      .create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, body)
      .then(() => {
        notify(
          <Notification
            type="success"
            title="Create Workflow Revision"
            message="Succssfully created workflow revision"
          />
        );
      })
      .catch(() => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow revision" />);
      });
  };

  updateWorkflow = () => {
    const { workflow, workflowActions } = this.props;
    const workflowId = workflow.data.id;

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow`, { ...this.newOverviewData, id: workflowId })
      .then(response => {
        notify(<Notification type="success" title="Update Workflow" message="Succssfully updated workflow" />);
        return Promise.resolve(response);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to update workflow" />);
        return Promise.reject(error);
      });
  };

  createWorkflowRevisionBody(diagramApp) {
    const dagProps = {};
    dagProps["dag"] = this.getDiagramSerialization(diagramApp);
    dagProps["config"] = this.formatWorkflowConfigNodes();
    return dagProps;
  }

  getDiagramSerialization(diagramApp) {
    return diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .serializeDiagram();
  }

  formatWorkflowConfigNodes() {
    return { nodes: Object.values(this.props.workflowRevision.config) };
  }

  createNode = (diagramApp, event) => {
    const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
    const nodesCount = keys(
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).length;

    const node = new CustomTaskNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)", data.type);

    //add node info to the state
    const { id, taskId } = node;
    this.props.workflowRevisionActions.addNode({ nodeId: id, taskId, inputs: {} });

    const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    diagramApp
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
            path="/creator"
            render={props => (
              <Creator
                workflow={this.props.workflow.data}
                createNode={this.createNode}
                createWorkflow={this.createWorkflow}
                createWorkflowRevision={this.createWorkflowRevision}
                updateWorkflow={this.updateWorkflow}
                handleOnOverviewChange={this.handleOnOverviewChange}
                {...props}
              />
            )}
          />
          <Route
            path="/editor/:workflowId"
            render={props => (
              <EditorContainer
                workflow={this.props.workflow.data}
                createNode={this.createNode}
                createWorkflowRevision={this.createWorkflowRevision}
                updateWorkflow={this.updateWorkflow}
                handleOnOverviewChange={this.handleOnOverviewChange}
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

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflow: state.workflow,
  workflowRevision: state.workflowRevision,
  activeTeamId: state.teams.activeTeamId
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowManagerContainer);
