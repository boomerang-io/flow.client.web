import React from "react";
import PropTypes from "prop-types";
import { useExecutionContext } from "Hooks";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import styles from "./SwitchNodeExecution.module.scss";

SwitchNodeExecution.propTypes = {
  node: PropTypes.object.isRequired
};

SwitchNodeExecution.defaultProps = {
  node: {}
};

export default function SwitchNodeExecution({ node }) {
  const { tasks, workflowExecution } = useExecutionContext();
  const task = tasks.find(t => t.id === node.taskId);
  const { steps } = workflowExecution;
  const step = Array.isArray(steps) ? steps.find(step => step.taskId === node.id) : {};
  const flowTaskStatus = step?.flowTaskStatus ?? EXECUTION_STATUSES.SKIPPED;

  return (
    <WorkflowNode
      isExecution
      className={cx(styles.node, styles[flowTaskStatus], {
        [styles.disabled]: flowTaskStatus === ACTIVITY_STATUSES.NOT_STARTED
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
