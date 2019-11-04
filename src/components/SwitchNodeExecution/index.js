import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
import { Fork16 } from "@carbon/icons-react";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import styles from "./SwitchNodExecution.module.scss";

export class SwitchNodeExecution extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object.isRequired
  };

  static defaultProps = {
    node: {},
    nodeConfig: {}
  };

  render() {
    const { node } = this.props;
    const { steps, status } = this.props.workflowExecution.data;
    const step = Array.isArray(steps) ? steps.find(step => step.taskId === node.id) : {};
    const flowTaskStatus = step ? step.flowTaskStatus : "";

    let disabled = false;
    if (status === ACTIVITY_STATUSES.IN_PROGRESS) {
      const inProgressStep = steps.find(step => step.flowTaskStatus === ACTIVITY_STATUSES.IN_PROGRESS);
      if (step.order > inProgressStep.order && flowTaskStatus !== ACTIVITY_STATUSES.SKIPPED) {
        disabled = true;
      }
    }
    return (
      <WorkflowNode
        className={cx(styles.node, styles[flowTaskStatus], { [styles.disabled]: disabled })}
        icon={<Fork16 alt="Switch icon" />}
        node={node}
        subtitle={node.taskName}
        title={"Switch"}
        rightPortClass={styles.rightPort}
        subtitleClass={styles.subtitle}
      >
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Switch</p>
        </div>
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

export default connect(
  mapStateToProps,
  null
)(SwitchNodeExecution);
