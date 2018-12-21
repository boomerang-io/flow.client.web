import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch, Prompt } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { actions as teamsActions } from "State/teams";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
import Creator from "./Creator";
import EditorContainer from "./EditorContainer";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import keys from "lodash/keys";
import "./styles.scss";

export class WorkflowManagerContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object
  };

  state = {
    isValidOverview: false
  };

  changeLogReason = "";

  componentDidMount() {
    this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.workflow.data.id !== this.props.workflow.data.id) {
      this.setState({
        isValidOverview: !!this.props.workflow.data.name
      });
    }
  }

  componentWillUnmount() {
    this.props.tasksActions.reset();
    this.props.workflowActions.reset();
    this.props.workflowRevisionActions.reset();
  }

  setIsValidOveriew = isValid => {
    this.setState({
      isValidOverview: isValid
    });
  };

  handleChangeLogReasonChange = changeLogReason => {
    this.changeLogReason = changeLogReason;
  };

  createWorkflow = diagramApp => {
    const { workflowActions, workflowRevisionActions, activeTeamId } = this.props;
    let workflowId;
    return workflowActions
      .create(`${BASE_SERVICE_URL}/workflow`, { ...this.props.workflow.data, flowTeamId: activeTeamId }) //update all instances of using newOverviewData - probably just need to use workflow.data object
      .then(response => {
        const dagProps = this.createWorkflowRevisionBody(diagramApp);
        workflowId = response.data.id;

        const workflowRevision = {
          ...dagProps,
          workflowId
        };
        workflowActions.setHasUnsavedWorkflowUpdates({ hasUpdates: false });
        return workflowRevisionActions.create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, workflowRevision);
      })
      .then(() => {
        notify(
          <Notification type="success" title="Create Workflow" message="Succssfully created workflow and version" />
        );
        this.props.history.push(`/editor/${workflowId}/designer`);
      })
      .catch(err => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow and version" />);
        return Promise.reject();
      });
  };

  createWorkflowRevision = diagramApp => {
    const { workflow, workflowRevisionActions } = this.props;

    const workflowId = workflow.data.id;
    const body = this.createWorkflowRevisionBody(diagramApp);

    return workflowRevisionActions
      .create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, body)
      .then(response => {
        notify(<Notification type="success" title="Create Version" message="Succssfully created workflow version" />);
        return Promise.resolve();
      })
      .catch(() => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to create workflow version" />);
        return Promise.reject();
      })
      .then(() => {
        this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`);
      });
  };

  updateWorkflow = () => {
    const { workflow, workflowActions } = this.props;
    const workflowId = workflow.data.id;
    const workflowData = { ...this.props.workflow.data };
    delete workflowData.properties; //delete properties property so its not updated - for situation where user updates inputs, but doesn't save them

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow`, { ...this.props.workflow.data, id: workflowId })
      .then(response => {
        notify(<Notification type="success" title="Update Workflow" message="Succssfully updated workflow" />);
        workflowActions.setHasUnsavedWorkflowUpdates({ hasUpdates: false });
        return Promise.resolve(response);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to update workflow" />);
        return Promise.reject(error);
      });
  };

  updateInputs = () => {
    const { workflow, workflowActions } = this.props;

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow/${workflow.data.id}/properties`, this.props.workflow.data.properties)
      .then(response => {
        notify(<Notification type="success" title="Update Inputs" message="Succssfully updated inputs" />);
        workflowActions.setHasUnsavedInputUpdates({ hasUpdates: false });
        return Promise.resolve(response);
      })
      .catch(error => {
        notify(<Notification type="error" title="Something's wrong" message="Failed to update inputs" />);
        return Promise.reject(error);
      });
  };

  fetchWorkflowRevisionNumber = revision => {
    const { workflow, workflowRevisionActions } = this.props;
    const workflowId = workflow.data.id;
    workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision/${revision}`);
  };

  createWorkflowRevisionBody(diagramApp) {
    const dagProps = {};
    dagProps["dag"] = this.getDiagramSerialization(diagramApp);
    dagProps["config"] = this.formatWorkflowConfigNodes();
    dagProps["changelog"] = {
      reason: this.changeLogReason
    };
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

  determineChangesString() {}

  render() {
    const { tasks, teams } = this.props;
    if (tasks.isFetching || teams.isFetching) {
      return <LoadingAnimation theme="bmrg-white" />;
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const { hasUnsavedWorkflowUpdates, hasUnsavedInputUpdates } = this.props.workflow;
      const { hasUnsavedWorkflowRevisionUpdates } = this.props.workflowRevision;
      return (
        <>
          <Prompt
            when={hasUnsavedWorkflowUpdates || hasUnsavedWorkflowRevisionUpdates || hasUnsavedInputUpdates}
            message={location =>
              location.pathname.includes("editor")
                ? true
                : `Are you sure? You have unsaved changes that will be lost for:\n ${
                    hasUnsavedWorkflowUpdates ? "Overview\n" : ""
                  } ${hasUnsavedWorkflowRevisionUpdates ? "Design\n" : ""} ${hasUnsavedInputUpdates ? "Input\n" : ""}`
            }
          />
          <div className="c-workflow-designer">
            <Switch>
              <Route
                path="/creator"
                render={props => (
                  <Creator
                    workflow={this.props.workflow}
                    workflowRevision={this.props.workflowRevision}
                    createNode={this.createNode}
                    createWorkflow={this.createWorkflow}
                    createWorkflowRevision={this.createWorkflowRevision}
                    fetchWorkflowRevisionNumber={this.fetchWorkflowRevisionNumber}
                    updateWorkflow={this.updateWorkflow}
                    handleChangeLogReasonChange={this.handleChangeLogReasonChange}
                    setIsValidOveriew={this.setIsValidOveriew}
                    isValidOverview={this.state.isValidOverview}
                    {...props}
                  />
                )}
              />
              <Route
                path="/editor/:workflowId"
                render={props => (
                  <EditorContainer
                    workflow={this.props.workflow}
                    createNode={this.createNode}
                    createWorkflowRevision={this.createWorkflowRevision}
                    fetchWorkflowRevisionNumber={this.fetchWorkflowRevisionNumber}
                    handleChangeLogReasonChange={this.handleChangeLogReasonChange}
                    updateInputs={this.updateInputs}
                    updateWorkflow={this.updateWorkflow}
                    setIsValidOveriew={this.setIsValidOveriew}
                    isValidOverview={this.state.isValidOverview}
                    {...props}
                  />
                )}
              />
            </Switch>
          </div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  teams: state.teams,
  workflow: state.workflow,
  workflowRevision: state.workflowRevision,
  activeTeamId: state.teams.activeTeamId
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowManagerContainer);
