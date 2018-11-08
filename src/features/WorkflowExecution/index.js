import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
  }

  componentWillUnmount() {
    clearInterval(this.executionInterval);
  }

  fetchExecution = () => {
    const { match, workflowExecutionActions } = this.props;
    workflowExecutionActions.fetch(`${BASE_SERVICE_URL}/activity/${match.params.workflowId}`);
  }

  render() {
    const { nodeId } = this.props.workflowExecutionActiveNode.activeNode;
    const { data: workflowExecutionData, status: workflowExecutionStatus } = this.props.workflowExecution;
    const { fetchingStatus: workflowRevisionStatus } = this.props.workflowRevision;

    if (workflowExecutionStatus === REQUEST_STATUSES.FAILURE && workflowRevisionStatus === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (workflowExecutionStatus === REQUEST_STATUSES.SUCCESS && workflowRevisionStatus === REQUEST_STATUSES.SUCCESS) {
      return <Main workflowRevision={this.props.workflowRevision} workflowExecution={workflowExecutionData} nodeId={nodeId} />;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  workflowExecution: state.workflowExecution,
  workflowExecutionActiveNode: state.workflowExecutionActiveNode,
  workflowRevision: state.workflowRevision
});

const mapDispatchToProps = dispatch => ({
  workflowExecutionActions: bindActionCreators(workflowExecutionActions, dispatch),
  workflowRevisionActions: bindActionCreators(workflowRevisionActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowExecutionContainer);
