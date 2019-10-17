import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { Prompt } from "react-router-dom";
import { LoadingAnimation, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import Editor from "./Editor";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import CustomNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utilities/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utilities/templateTaskNode/TemplateTaskNodeModel";
import NODE_TYPES from "Constants/nodeTypes";
import styles from "./WorkflowManager.module.scss";

export class WorkflowManagerContainer extends Component {
  static propTypes = {
    activeTeamId: PropTypes.string,
    appActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    workflow: PropTypes.object,
    workflowActions: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object.isRequired,
    workflowRevisionActions: PropTypes.object.isRequired
  };

  changeLogReason = "Update workflow"; //default changelog value

  async componentDidMount() {
    const { activeTeamId, match } = this.props;
    const { workflowId } = match.params;

    if (!activeTeamId) {
      this.setActiveTeamId(workflowId);
    }
    try {
      await Promise.all([
        this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`),
        this.props.workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`),
        this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`)
      ]);
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

  /**
   * Find the matching team for the workflowId and set that to the active team
   * That path param is the only thing available to the app
   * @param {string} workflowId
   */
  setActiveTeamId(workflowId) {
    const { appActions, teams } = this.props;
    const activeTeam = teams.data.find(team => {
      return team.workflows.find(workflow => workflow.id === workflowId);
    });

    appActions.setActiveTeam({ teamId: activeTeam ? activeTeam.id : "" });
  }

  // Not updating state to prevent re-renders. Need a better approach here
  handleChangeLogReasonChange = changeLogReason => {
    this.changeLogReason = changeLogReason;
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
        return workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`);
      })
      .then(response => Promise.resolve(response))
      .catch(error => {
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

    const nodeObj = {
      taskId: taskData.id,
      taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`
    };

    let node;

    // eslint-disable-next-line default-case
    switch (taskData.nodeType) {
      case NODE_TYPES.DECISION:
        node = new SwitchNodeModel(nodeObj);
        break;
      case NODE_TYPES.TEMPLATE_TASK:
        node = new TemplateNodeModel(nodeObj);
        break;
      case NODE_TYPES.CUSTOM_TASK:
        node = new CustomNodeModel(nodeObj);
        break;
    }

    if (node) {
      const { id, taskId } = node;

      // Create inputs object with empty string values by default for service to process easily
      const inputs =
        taskData.config && taskData.config.length
          ? taskData.config.reduce((accu, item) => {
              accu[item.key] = "";
              return accu;
            }, {})
          : {};

      this.props.workflowRevisionActions.addNode({ nodeId: id, taskId, inputs, type: taskData.nodeType });

      const points = diagramApp.getDiagramEngine().getRelativeMousePoint(event);
      node.x = points.x - 110;
      node.y = points.y - 40;
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .addNode(node);
      this.forceUpdate();
    }
  };

  render() {
    const { tasks, workflow, workflowRevision } = this.props;
    if (tasks.isFetching || workflow.isFetching || workflowRevision.isFetching) {
      return <LoadingAnimation centered message="Retrieving your workflow. Please hold." />;
    }

    if (
      tasks.status === REQUEST_STATUSES.FAILURE ||
      workflow.fetchingStatus === REQUEST_STATUSES.FAILURE ||
      workflowRevision.fetchingStatus === REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon />;
    }

    if (
      tasks.status === REQUEST_STATUSES.SUCCESS &&
      workflow.fetchingStatus === REQUEST_STATUSES.SUCCESS &&
      workflowRevision.fetchingStatus === REQUEST_STATUSES.SUCCESS
    ) {
      const { hasUnsavedWorkflowRevisionUpdates } = this.props.workflowRevision;
      return (
        <>
          <Prompt
            when={hasUnsavedWorkflowRevisionUpdates}
            message={location =>
              location.pathname === this.props.match.url || location.pathname.includes("editor") //Return true to navigate if going to the same route we are currently on
                ? true
                : "Are you sure? You have unsaved changes to your workflow that will be lost."
            }
          />
          <div className={styles.container}>
            <Editor
              createNode={this.createNode}
              createWorkflowRevision={this.createWorkflowRevision}
              fetchWorkflowRevisionNumber={this.fetchWorkflowRevisionNumber}
              handleChangeLogReasonChange={this.handleChangeLogReasonChange}
              isModalOpen={this.props.isModalOpen}
              tasks={this.props.tasks}
              teams={this.props.teams}
              updateWorkflow={this.updateWorkflow}
              updateWorkflowProperties={this.updateWorkflowProperties}
              workflow={this.props.workflow}
              workflowRevision={this.props.workflowRevision}
            />
          </div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  activeTeamId: state.app.activeTeamId,
  isModalOpen: state.app.isModalOpen,
  tasks: state.tasks,
  teams: state.teams,
  workflow: state.workflow,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowManagerContainer);
