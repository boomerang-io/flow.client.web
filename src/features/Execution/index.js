import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowActions } from "State/workflow";
import { actions as workflowExecutionActions } from "State/workflowExecution";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import Loading from "Components/Loading";
import ErrorDragon from "Components/ErrorDragon";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import Main from "./Main";

export const ActivityIdContext = React.createContext("");

export class WorkflowExecutionContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    tasks: PropTypes.object,
    tasksActions: PropTypes.object,
    workflow: PropTypes.object,
    workflowActions: PropTypes.object,
    workflowExecution: PropTypes.object.isRequired,
    workflowExecutionActions: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object,
    workflowRevisionActions: PropTypes.object
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

  render() {
    const { tasks, workflowExecution, workflowRevision, workflow } = this.props;

    if (tasks.isFetching || workflowRevision.isFetching) {
      return <Loading />;
    }

    if (
      workflow.fetchingStatus === REQUEST_STATUSES.FAILURE ||
      workflowExecution.status === REQUEST_STATUSES.FAILURE ||
      workflowRevision.fetchingStatus === REQUEST_STATUSES.FAILURE ||
      tasks.status === REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon />;
    }

    if (workflowRevision.fetchingStatus === REQUEST_STATUSES.SUCCESS && tasks.status === REQUEST_STATUSES.SUCCESS) {
      return (
        <Main
          dag={workflowRevision.dag}
          workflowExecution={this.props.workflowExecution}
          workflow={this.props.workflow}
        />
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflow: state.workflow,
  workflowExecution: state.workflowExecution,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowActions: bindActionCreators(workflowActions, dispatch),
  workflowExecutionActions: bindActionCreators(workflowExecutionActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
