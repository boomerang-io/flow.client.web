import React from "react";
import PropTypes from "prop-types";
import { useExecutionContext } from "Hooks";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
import { ExecutionStatus } from "Constants";
import styles from "./SwitchNodeExecution.module.scss";

const SwitchNodeExecution = React.memo(function SwitchNodeExecution({ node }) {
  const { tasks, workflowExecution } = useExecutionContext();
  const task = tasks.find((t) => t.id === node.taskId);
  const { steps } = workflowExecution;
  const step = Array.isArray(steps) ? steps.find((step) => step.taskId === node.id) : {};
  const flowTaskStatus = step?.flowTaskStatus ?? ExecutionStatus.Skipped;

  return (
    <WorkflowNode
      isExecution
      className={cx(styles.node, styles[flowTaskStatus], {
        [styles.disabled]: flowTaskStatus === ExecutionStatus.NotStarted,
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
});

SwitchNodeExecution.propTypes = {
  node: PropTypes.object.isRequired,
};

SwitchNodeExecution.defaultProps = {
  node: {},
};

export default SwitchNodeExecution;
