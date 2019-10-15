import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Switch, Prompt, Redirect } from "react-router-dom";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { LoadingAnimation, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import EditorContainer from "./EditorContainer";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import CustomTaskNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utilities/switchNode/SwitchNodeModel";
import TASK_TYPES from "Constants/taskTypes";
import NODE_TYPES from "Constants/nodeTypes";
import styles from "./WorkflowManager.module.scss";

export class WorkflowManagerContainer extends Component {
  static propTypes = {
    activeTeamId: PropTypes.string,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object
  };

  changeLogReason = "Update workflow"; //default changelog value

  async componentDidMount() {
    try {
      await this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`);
    } catch (e) {
      // noop
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.url !== prevProps.match.url) {
      this.props.workflowActions.reset();
      this.props.workflowRevisionActions.reset();
    }
  }

  componentWillUnmount() {
    this.props.tasksActions.reset();
    this.props.workflowActions.reset();
    this.props.workflowRevisionActions.reset();
  }

  // Not updating state to prevent re-renders. Need a better approach here
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
          <ToastNotification
            kind="success"
            title="Create Workflow"
            subtitle="Successfully created workflow and version"
          />
        );
        this.props.history.push(`/editor/${workflowId}/designer`);
      })
      .catch(err => {
        notify(
          <ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create workflow and version" />
        );
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
        notify(
          <ToastNotification kind="success" title="Create Version" subtitle="Successfully created workflow version" />
        );
        return Promise.resolve();
      })
      .catch(() => {
        notify(
          <ToastNotification kind="error" title="Something's wrong" subtitle="Failed to create workflow version" />
        );
        return Promise.reject();
      })
      .then(() => {
        this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`).catch(err => {
          // noop
        });
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
        notify(<ToastNotification kind="success" title="Update Workflow" subtitle="Successfully updated workflow" />);
        workflowActions.setHasUnsavedWorkflowUpdates({ hasUpdates: false });
        return workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`);
      })
      .then(response => Promise.resolve(response))
      .catch(error => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle="Failed to update workflow" />);
        return Promise.reject(error);
      });
  };

  updateWorkflowProperties = ({
    title = "Update Inputs",
    message = "Successfully updated inputs",
    type = "update"
  }) => {
    const { workflow, workflowActions } = this.props;

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow/${workflow.data.id}/properties`, this.props.workflow.data.properties)
      .then(response => {
        notify(<ToastNotification kind="success" title={title} subtitle={message} />);
        return Promise.resolve(response);
      })
      .catch(error => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to ${type} input`} />);
        return Promise.reject(error);
      });
  };

  fetchWorkflowRevisionNumber = revision => {
    const { workflow, workflowRevisionActions } = this.props;
    const workflowId = workflow.data.id;
    workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision/${revision}`).catch(err => {
      // noop
    });
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
    const { taskData } = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));

    // For naming purposes
    const nodesOfSameTypeCount = Object.values(
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).filter(node => node.taskId === taskData.id).length;

    let node;
    let nodeType;

    //TODO: probably should be a case staement or an object that maps the type to the model to support more types and set that to a variable and only have one call
    if (taskData.key === TASK_TYPES.SWITCH) {
      nodeType = NODE_TYPES.SWITCH; //TODO: should this have to be manually set or should it be a part of the taskData? a part of a mapping?
      node = new SwitchNodeModel({
        taskId: taskData.id,
        taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`
      });
    } else {
      nodeType = NODE_TYPES.CUSTOM; //TODO: should this have to be manually set or should it be a part of the taskData? a part of a mapping?
      node = new CustomTaskNodeModel({
        taskId: taskData.id,
        taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`
      });
    }
    const { id, taskId } = node;

    // Create inputs object with empty string values by default for service to process easily
    const inputs =
      taskData.config && taskData.config.length
        ? taskData.config.reduce((accu, item) => {
            accu[item.key] = "";
            return accu;
          }, {})
        : {};

    this.props.workflowRevisionActions.addNode({ nodeId: id, taskId, inputs, type: nodeType });

    const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x - 110;
    node.y = points.y - 40;
    diagramApp
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
  };

  render() {
    const { tasks, teams } = this.props;
    if (tasks.isFetching || teams.isFetching) {
      return <LoadingAnimation centered message="Retrieving your workflow. Please hold." />;
    }

    if (tasks.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const { hasUnsavedWorkflowUpdates } = this.props.workflow;
      const { hasUnsavedWorkflowRevisionUpdates } = this.props.workflowRevision;
      return (
        <>
          <Prompt
            when={hasUnsavedWorkflowUpdates || hasUnsavedWorkflowRevisionUpdates}
            message={location =>
              location.pathname === this.props.match.url || location.pathname.includes("editor") //Return true to navigate if going to the same route we are currently on
                ? true
                : `Are you sure? You have unsaved changes that will be lost on:\n${
                    hasUnsavedWorkflowUpdates ? "- Overview\n" : ""
                  }${hasUnsavedWorkflowRevisionUpdates ? "- Design\n" : ""}`
            }
          />
          <div className={styles.container}>
            <Switch>
              <Route
                path="/editor/:workflowId"
                render={props => (
                  <EditorContainer
                    createNode={this.createNode}
                    createWorkflowRevision={this.createWorkflowRevision}
                    fetchWorkflowRevisionNumber={this.fetchWorkflowRevisionNumber}
                    handleChangeLogReasonChange={this.handleChangeLogReasonChange}
                    updateWorkflowProperties={this.updateWorkflowProperties}
                    updateWorkflow={this.updateWorkflow}
                    workflow={this.props.workflow}
                    {...props}
                  />
                )}
              />
              <Redirect from="/creator" to="/creator/overview" />
            </Switch>
          </div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  activeTeamId: state.app.activeTeamId,
  tasks: state.tasks,
  teams: state.teams,
  workflow: state.workflow,
  workflowRevision: state.workflowRevision
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
