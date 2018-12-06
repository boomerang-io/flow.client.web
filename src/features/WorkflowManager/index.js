import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
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
import "./styles.scss";

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
    this.changeLogReason = "";
    this.overviewData = {};
  }

  componentDidMount() {
    this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`);

    // //axios call to pull in overview information
    // if (this.props.worflow) {
    //   axios
    //     .get(`${BASE_SERVICE_URL}/workflow/${this.props.workflow.data.id}/summary`)
    //     .then(response => {
    //       this.overviewData = response.data;
    //       return Promise.resolve();
    //     })
    //     .catch(err => {
    //       return Promise.reject();
    //     });
    // }
  }

  componentWillUnmount() {
    this.props.tasksActions.reset();
    this.props.workflowActions.reset();
    this.props.workflowRevisionActions.reset();
  }

  // handleOnOverviewChange = overviewData => {
  //   this.newOverviewData = {
  //     name: overviewData.name,
  //     shortDescription: overviewData.shortDescription,
  //     description: overviewData.description,
  //     icon: overviewData.icon,
  //     triggers: {
  //       scheduler: {
  //         enable: overviewData.schedulerEnable,
  //         schedule: overviewData.schedule
  //       },
  //       webhook: {
  //         enable: overviewData.webhookEnable,
  //         token: overviewData.token
  //       }
  //     }
  //   };
  //   console.log(this.newOverviewData);
  // };

  handleChangeLogReasonChange = changeLogReason => {
    this.changeLogReason = changeLogReason;
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
          <Notification type="success" title="Create Workflow" message="Succssfully created workflow and version" />
        );
        return Promise.resolve();
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

  render() {
    const { tasks } = this.props;
    if (tasks.isFetching) {
      return <LoadingAnimation theme="bmrg-white" />;
    }

    if (tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
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
                  updateWorkflow={this.updateWorkflow}
                  {...props}
                />
              )}
            />
          </Switch>
        </div>
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
