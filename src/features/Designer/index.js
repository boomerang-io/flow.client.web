import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import { Formik } from "formik";
import { Prompt } from "react-router-dom";
import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import Loading from "Components/Loading";
import { notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import Editor from "./Editor";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import sortBy from "lodash/sortBy";
import CustomNodeModel from "Utilities/customTaskNode/CustomTaskNodeModel";
import SwitchNodeModel from "Utilities/switchNode/SwitchNodeModel";
import TemplateNodeModel from "Utilities/templateTaskNode/TemplateTaskNodeModel";
import NODE_TYPES from "Constants/nodeTypes";
import WORKFLOW_PROPERTY_UPDATE_TYPES from "Constants/workflowPropertyUpdateTypes";
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
    workflowRevisionActions: PropTypes.object.isRequired,
  };

  changeLogReason = "Update workflow"; //default changelog value

  async componentDidMount() {
    const { activeTeamId, match } = this.props;
    const { workflowId } = match.params;

    if (!activeTeamId) {
      this.findActiveTeamIdOnMount();
    }
    try {
      await Promise.all([
        this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`),
        this.props.workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`),
        this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`),
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
   */
  findActiveTeamIdOnMount() {
    const { appActions, match, teams } = this.props;
    const { workflowId } = match.params;
    const activeTeam = teams.data.find((team) => {
      return team.workflows.find((workflow) => workflow.id === workflowId);
    });

    appActions.setActiveTeam({ teamId: activeTeam?.id ?? "" });
  }

  // Not updating state to prevent re-renders. Need a better approach here
  handleChangeLogReasonChange = (changeLogReason) => {
    this.changeLogReason = changeLogReason;
  };

  createWorkflowRevision = (diagramApp) => {
    const { workflow, workflowRevisionActions } = this.props;

    const workflowId = workflow.data.id;
    const body = this.createWorkflowRevisionBody(diagramApp);

    return workflowRevisionActions
      .create(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision`, body)
      .then((response) => {
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
        return this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/summary`).catch((err) => {
          // noop
        });
      });
  };

  updateWorkflow = (formikValues) => {
    const { activeTeamId, appActions, workflow, workflowActions } = this.props;
    const flowTeamId = formikValues?.selectedTeam?.id;
    const updatedWorkflow = { ...workflow.data, ...formikValues, flowTeamId };

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow`, updatedWorkflow)
      .then(() => {
        // If the team has changed
        if (flowTeamId && activeTeamId !== flowTeamId) {
          appActions.setActiveTeam({ teamId: flowTeamId });
        }
      })
      .catch((error) => {});
  };

  updateWorkflowProperties = ({ property, title, message, type }) => {
    const { workflow, workflowActions } = this.props;

    let properties = [...this.props.workflow.data.properties];
    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.UPDATE) {
      const propertyToUpdateIndex = properties.findIndex((currentProp) => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1, property);
    }

    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.DELETE) {
      const propertyToUpdateIndex = properties.findIndex((currentProp) => currentProp.key === property.key);
      properties.splice(propertyToUpdateIndex, 1);
    }

    if (type === WORKFLOW_PROPERTY_UPDATE_TYPES.CREATE) {
      properties.push(property);
    }

    return workflowActions
      .update(`${BASE_SERVICE_URL}/workflow/${workflow.data.id}/properties`, properties)
      .then((response) => {
        notify(
          <ToastNotification
            kind="success"
            title={`${capitalize(type)} property`}
            subtitle={`Successfully performed operation`}
          />
        );
        return Promise.resolve(response);
      })
      .catch((error) => {
        notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to ${type} property`} />);
        return Promise.reject(error);
      });
  };

  fetchWorkflowRevisionNumber = (revision) => {
    const { workflow, workflowRevisionActions } = this.props;
    const workflowId = workflow.data.id;
    workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${workflowId}/revision/${revision}`).catch((err) => {
      // noop
    });
  };

  createWorkflowRevisionBody(diagramApp) {
    const dagProps = {};
    dagProps["dag"] = this.getDiagramSerialization(diagramApp);
    dagProps["config"] = this.formatWorkflowConfigNodes();
    dagProps["changelog"] = {
      reason: this.changeLogReason,
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
    console.log(this.props.workflowRevision.config, "ahhhh");
    const normilzedConfig = Object.values(this.props.workflowRevision.config).map((config) => ({
      ...config,
      currentVersion: undefined,
      taskVersion: config.currentVersion || config.taskVersion,
    }));
    return { nodes: Object.values(normilzedConfig) };
  }

  createNode = (diagramApp, event) => {
    const { taskData } = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
    // For naming purposes
    const nodesOfSameTypeCount = Object.values(
      diagramApp
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).filter((node) => node.taskId === taskData.id).length;

    const nodeObj = {
      taskId: taskData.id,
      taskName: `${taskData.name} ${nodesOfSameTypeCount + 1}`,
      taskVersion: taskData.currentVersion,
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
      const { id, taskId, currentVersion } = node;
      const currentTaskConfig = taskData.revisions?.find((revision) => revision.version === currentVersion) ?? {};
      // Create inputs object with empty string values by default for service to process easily
      const inputs =
        currentTaskConfig.config && currentTaskConfig.config.length
          ? currentTaskConfig.config.reduce((accu, item) => {
              accu[item.key] = "";
              return accu;
            }, {})
          : {};
      this.props.workflowRevisionActions.addNode({
        nodeId: id,
        taskId,
        inputs,
        type: taskData.nodeType,
        taskVersion: currentVersion,
      });
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
    const { activeTeamId, tasks, teams, workflow, workflowRevision } = this.props;

    if (tasks.isFetching || workflow.isFetching || workflowRevision.isFetching) {
      return <Loading />;
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
            message={(location) =>
              location.pathname === this.props.match.url || location.pathname.includes("editor") //Return true to navigate if going to the same route we are currently on
                ? true
                : "Are you sure? You have unsaved changes to your workflow that will be lost."
            }
          />
          <div className={styles.container}>
            <Formik
              enableReinitialize
              initialValues={{
                description: workflow?.data?.description ?? "",
                enableACCIntegration: workflow?.data?.enableACCIntegration ?? false,
                enablePersistentStorage: workflow?.data?.enablePersistentStorage ?? false,
                icon: workflow?.data?.icon ?? "",
                name: workflow?.data?.name ?? "",
                selectedTeam: teams.data.find((team) => team.id === activeTeamId),
                shortDescription: workflow?.data?.shortDescription ?? "",
                triggers: {
                  event: {
                    enable: workflow?.data?.triggers?.event?.enable ?? false,
                    topic: workflow?.data?.triggers?.event?.topic ?? "",
                  },
                  scheduler: {
                    enable: workflow?.data?.triggers?.scheduler?.enable ?? false,
                    schedule: workflow?.data?.triggers?.scheduler?.schedule ?? "0 18 * * *",
                    timezone: workflow?.data?.triggers?.scheduler?.timezone ?? false,
                    advancedCron: workflow?.data?.triggers?.scheduler?.advancedCron ?? false,
                  },
                  webhook: {
                    enable: workflow?.data?.triggers?.webhook?.enable ?? false,
                    token: workflow?.data?.triggers?.webhook?.token ?? false,
                  },
                },
              }}
              validationSchema={Yup.object().shape({
                description: Yup.string().max(250, "Description must not be greater than 250 characters"),
                enableACCIntegration: Yup.boolean(),
                enablePersistentStorage: Yup.boolean(),
                icon: Yup.string(),
                name: Yup.string()
                  .required("Name is required")
                  .max(64, "Name must not be greater than 64 characters"),
                selectedTeam: Yup.object().shape({ name: Yup.string().required("Team is required") }),
                shortDescription: Yup.string().max(128, "Summary must not be greater than 128 characters"),
                triggers: Yup.object().shape({
                  event: Yup.object().shape({
                    enable: Yup.boolean(),
                    topic: Yup.string(),
                  }),
                  scheduler: Yup.object().shape({
                    enable: Yup.boolean(),
                    schedule: Yup.string(),
                    timezone: Yup.mixed(),
                    advancedCron: Yup.boolean(),
                  }),
                  webhook: Yup.object().shape({
                    enable: Yup.boolean(),
                    token: Yup.mixed(),
                  }),
                }),
              })}
            >
              {(formikProps) => (
                <>
                  <Editor
                    createNode={this.createNode}
                    createWorkflowRevision={this.createWorkflowRevision}
                    fetchWorkflowRevisionNumber={this.fetchWorkflowRevisionNumber}
                    handleChangeLogReasonChange={this.handleChangeLogReasonChange}
                    isModalOpen={this.props.isModalOpen}
                    tasks={this.props.tasks}
                    teams={sortBy(this.props.teams.data, "name")}
                    updateWorkflow={this.updateWorkflow}
                    updateWorkflowProperties={this.updateWorkflowProperties}
                    workflow={this.props.workflow}
                    workflowFormikProps={formikProps}
                    workflowRevision={this.props.workflowRevision}
                  />
                </>
              )}
            </Formik>
          </div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => ({
  activeTeamId: state.app.activeTeamId,
  isModalOpen: state.app.isModalOpen,
  tasks: state.tasks,
  teams: state.teams,
  workflow: state.workflow,
  workflowRevision: state.workflowRevision,
});

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowManagerContainer);
