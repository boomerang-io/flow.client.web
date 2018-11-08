import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import ErrorDragon from "Components/ErrorDragon";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import Main from "./Main";
import "./styles.scss";

class WorkflowExecutionContainer extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    tasksActions: PropTypes.object.isRequired
    // workflow: PropTypes.object,
    // workflowConfigActions: PropTypes.object
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/tasktemplate`);
    this.props.workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${match.params.workflowId}/revision`);
  }

  fetchExecution() {
    this.props.workflowExecutionActions.fetch();
  }

  render() {
    const { status: tasksStatus } = this.props.tasks;
    const { fetchingStatus: workflowRevisionStatus } = this.props.workflowRevision;

    if (tasksStatus === REQUEST_STATUSES.FAILURE && workflowRevisionStatus === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (tasksStatus === REQUEST_STATUSES.SUCCESS && workflowRevisionStatus === REQUEST_STATUSES.SUCCESS) {
      return <Main workflowRevision={this.props.workflowRevision} />;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
