import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import StepSideInfo from "./StepSideInfo";
import ErrorDragon from "Components/ErrorDragon";
import TimeProgressBar from "Components/TimeProgressBar";
import DiagramApplication from "Utilities/DiagramApplication";
import { DiagramWidget } from "@boomerang/boomerang-dag";
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
    this.props.tasksActions.fetchTasks(`${BASE_SERVICE_URL}/activity/${this.props.match.params.workflowId}`);
  }

  fetchExecution() {
    this.props.workflowExecutionActions.fetch();
  }

  render() {
    const { status, data } = this.props.tasks;

    if (status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (status === REQUEST_STATUSES.SUCCESS) {
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
  tasksActions: bindActionCreators(tasksActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
