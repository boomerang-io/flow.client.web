import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./SwitchNodeExecution.module.scss";

export class SwitchNodeExecution extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    workflowExecution: PropTypes.object.isRequired,
  };

  static defaultProps = {
    node: {},
    nodeConfig: {},
  };

  render() {
    const { node, task } = this.props;
    const { steps } = this.props.workflowExecution.data;
    const step = Array.isArray(steps) ? steps.find((step) => step.taskId === node.id) : {};
    const flowTaskStatus = step?.flowTaskStatus ?? EXECUTION_STATUSES.SKIPPED;

    return (
      <WorkflowNode
        isExecution
        className={cx(styles.node, styles[flowTaskStatus], {
          [styles.disabled]: flowTaskStatus === ACTIVITY_STATUSES.NOT_STARTED,
        })}
        icon={task?.icon}
        node={node}
        rightPortClass={styles.rightPort}
        subtitle={node.taskName}
        subtitleClass={styles.subtitle}
        title="Switch"
      >
        <div className={styles.progressBar} />
        <div className={styles.badgeContainer}>
          <p className={styles.badgeText}>Switch</p>
        </div>
      </WorkflowNode>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    task: state.tasks.data.find((task) => task.id === ownProps.node.taskId),
    nodeConfig: state.workflowRevision.config[ownProps.node.id],
    workflowExecution: state.workflowExecution,
  };
};

export default connect(mapStateToProps, null)(SwitchNodeExecution);
