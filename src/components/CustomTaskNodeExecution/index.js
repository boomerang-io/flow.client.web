import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as appActions } from "State/app";
import WorkflowNode from "Components/WorkflowNode";
import isAccessibleEvent from "@boomerang/boomerang-utilities/lib/isAccessibleEvent";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import styles from "./CustomTaskNodeExecution.module.scss";

export class CustomTaskNodeExecution extends Component {
  static propTypes = {
    appActions: PropTypes.object.isRequired,
    diagramEngine: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object,
    task: PropTypes.object.isRequired
  };

  static defaultProps = {
    node: {},
    nodeConfig: {},
    task: {}
  };

  handleOnActivityClick = () => {
    this.props.appActions.updateActiveNode({
      workflowId: this.props.diagramEngine.id,
      nodeId: this.props.node.id
    });
  };

  render() {
    const { task, node } = this.props;
    const { steps, status } = this.props.workflowExecution.data;
    const step = Array.isArray(steps) ? steps.find(step => step.taskId === node.id) : {};
    const flowTaskStatus = step ? step.flowTaskStatus : "";

    let taskNodeStyling = "";
    if (status === ACTIVITY_STATUSES.IN_PROGRESS) {
      taskNodeStyling = flowTaskStatus === ACTIVITY_STATUSES.IN_PROGRESS ? ACTIVITY_STATUSES.IN_PROGRESS : "disabled";
    } else if (status === ACTIVITY_STATUSES.FAILURE) {
      taskNodeStyling = flowTaskStatus === ACTIVITY_STATUSES.FAILURE ? ACTIVITY_STATUSES.FAILURE : "normal";
    } else {
      taskNodeStyling = "normal";
    }

    return (
      <WorkflowNode
        category={task.category}
        className={styles[taskNodeStyling]}
        name={task.name}
        node={node}
        onClick={e => isAccessibleEvent(e) && this.handleOnActivityClick()}
        style={{ cursor: "pointer" }}
        subtitle={node.taskName}
        title={task.name}
      >
        <div className={styles.progressBar} />
      </WorkflowNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find(task => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    workflowExecution: state.workflowExecution
  };
};

const mapDispatchToProps = dispatch => ({
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTaskNodeExecution);
