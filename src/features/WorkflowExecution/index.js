import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as tasksActions } from "State/tasks";
import { actions as workflowExecutionActions } from "State/workflowExecution";
import { actions as workflowRevisionActions } from "State/workflowRevision";
import ErrorDragon from "Components/ErrorDragon";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import Main from "./Main";
import "./styles.scss";

class WorkflowExecutionContainer extends Component {
  static propTypes = {
    workflowExecution: PropTypes.object.isRequired,
    workflowExecutionActions: PropTypes.object.isRequired,
    workflowExecutionActiveNode: PropTypes.object.isRequired,
    workflowRevision: PropTypes.object,
    workflowRevisionActions: PropTypes.object
  };

  componentDidMount() {
    const { match } = this.props;
    this.fetchExecution();
    this.executionInterval = setInterval(this.fetchExecution, 10000);
    this.props.workflowRevisionActions.fetch(`${BASE_SERVICE_URL}/workflow/${match.params.workflowId}/revision`);
    this.props.tasksActions.fetch(`${BASE_SERVICE_URL}/tasktemplate`);
  }

  componentWillUnmount() {
    clearInterval(this.executionInterval);
  }

  fetchExecution = () => {
    const { match, workflowExecutionActions } = this.props;
    workflowExecutionActions.fetch(`${BASE_SERVICE_URL}/activity/${match.params.executionId}`);
  };

  render() {
    const { nodeId } = this.props.workflowExecutionActiveNode.activeNode;
    const { data: workflowExecutionData, status: workflowExecutionStatus } = this.props.workflowExecution;
    const { fetchingStatus: workflowRevisionStatus } = this.props.workflowRevision;
    const { status: tasksStatus } = this.props.tasks;

    if (
      workflowExecutionStatus === REQUEST_STATUSES.FAILURE ||
      workflowRevisionStatus === REQUEST_STATUSES.FAILURE ||
      tasksStatus === REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon />;
    }

    if (
      workflowExecutionStatus === REQUEST_STATUSES.SUCCESS &&
      workflowRevisionStatus === REQUEST_STATUSES.SUCCESS &&
      tasksStatus === REQUEST_STATUSES.SUCCESS
    ) {
      return (
        <Main
          workflowRevision={this.props.workflowRevision}
          workflowExecution={workflowExecutionData}
          nodeId={nodeId}
        />
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  workflowExecution: state.workflowExecution,
  workflowExecutionActiveNode: state.workflowExecutionActiveNode,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  tasksActions: bindActionCreators(tasksActions, dispatch),
  workflowExecutionActions: bindActionCreators(workflowExecutionActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
