import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowExecutionActions } from "State/workflowExecution";
import { actions as appActions } from "State/app";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import ErrorDragon from "Components/ErrorDragon";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import Main from "./Main";
import "./styles.scss";

export const ActivityIdContext = React.createContext("");

export class WorkflowExecutionContainer extends Component {
  static propTypes = {
    workflowExecution: PropTypes.object.isRequired,
    workflowExecutionActions: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    appActions: PropTypes.object,
    workflowRevision: PropTypes.object,
    workflowRevisionActions: PropTypes.object,
    workflowActions: PropTypes.object,
    tasksActions: PropTypes.object,
    tasks: PropTypes.object,
    workflow: PropTypes.object,
    match: PropTypes.object.isRequired
  };

  async componentDidMount() {
    const { match } = this.props;
    this.fetchExecution();
    this.executionInterval = setInterval(() => this.fetchExecution(), 5000);

    try {
      await Promise.all([
        this.props.workflowActions.fetch(`${BASE_SERVICE_URL}/workflow/${match.params.workflowId}/summary`),
        this.props.workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${match.params.workflowId}/revision`),
        this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`)
      ]);
    } catch (e) {
      // noop
    }
  }

  componentDidUpdate() {
    const { data: workflowExecutionData } = this.props.workflowExecution;
    if (
      workflowExecutionData.status && //need to check that it is no undefined
      workflowExecutionData.status !== EXECUTION_STATUSES.NOT_STARTED &&
      workflowExecutionData.status !== EXECUTION_STATUSES.IN_PROGRESS
    ) {
      clearInterval(this.executionInterval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.executionInterval);
    this.props.workflowExecutionActions.reset();
    this.props.workflowActions.reset();
    this.props.workflowRevisionActions.reset();
    this.props.tasksActions.reset();
  }

  fetchExecution = () => {
    const { match, workflowExecutionActions } = this.props;
    workflowExecutionActions.fetch(`${BASE_SERVICE_URL}/activity/${match.params.executionId}`).catch(err => {
      // noop
    });
  };

  updateActiveNode = nodeId => {
    this.props.appActions.updateActiveNode({
      workflowId: this.props.match.params.workflowId,
      nodeId
    });
  };

  render() {
    const { nodeId } = this.props.app.activeNode;
    const { data: workflowExecutionData, status: workflowExecutionStatus } = this.props.workflowExecution;
    const { fetchingStatus: workflowRevisionStatus } = this.props.workflowRevision;
    const { status: tasksStatus } = this.props.tasks;
    const { fetchingStatus: workflowStatus } = this.props.workflow;

    if (
      workflowExecutionStatus === REQUEST_STATUSES.FAILURE ||
      workflowRevisionStatus === REQUEST_STATUSES.FAILURE ||
      tasksStatus === REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (
      workflowExecutionStatus === REQUEST_STATUSES.SUCCESS &&
      workflowRevisionStatus === REQUEST_STATUSES.SUCCESS &&
      tasksStatus === REQUEST_STATUSES.SUCCESS &&
      workflowStatus === REQUEST_STATUSES.SUCCESS
    ) {
      let taskId = undefined;
      if (workflowExecutionData.steps && workflowExecutionData.steps.length) {
        const step = workflowExecutionData.steps
          .slice(0)
          .reverse()
          .find(step => step.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED);
        taskId = nodeId ? nodeId : step && step.taskId ? step.taskId : undefined;
      }

      return (
        <Main
          workflowData={this.props.workflow.data}
          dag={this.props.workflowRevision.dag}
          version={this.props.workflowRevision.version}
          workflowExecutionData={workflowExecutionData}
          taskId={taskId}
          updateActiveNode={this.updateActiveNode}
        />
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  app: state.app,
  tasks: state.tasks,
  workflow: state.workflow,
  workflowExecution: state.workflowExecution,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch),
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowExecutionActions: bindActionCreators(workflowExecutionActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
