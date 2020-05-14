import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useExecutionContext } from "Hooks";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import WorkflowNode from "Components/WorkflowNode";
import styles from "./CustomTaskNodeExecution.module.scss";

CustomTaskNodeExecution.propTypes = {
  node: PropTypes.object.isRequired
};

CustomTaskNodeExecution.applydefaultProps = {
  node: {}
};

export default function CustomTaskNodeExecution({ node }) {
  const { tasks, workflowExecution } = useExecutionContext();
  const task = tasks.find(t => t.id === node.taskId);
  const { steps } = workflowExecution;
  const step = Array.isArray(steps) ? steps.find(step => step.taskId === node.id) : {};
  const flowTaskStatus = step?.flowTaskStatus ?? EXECUTION_STATUSES.SKIPPED;

  return (
    <WorkflowNode
      isExecution
      category={task.category}
      className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ACTIVITY_STATUSES.NOT_STARTED })}
      icon={task.icon}
      name={task.name}
      node={node}
      subtitle={node.taskName}
      title={task.name}
    >
      <div className={styles.progressBar} />
      <div className={styles.badgeContainer}>
        <p className={styles.badgeText}>Custom</p>
      </div>
      <div className={styles.progressBar} />
    </WorkflowNode>
  );
}
