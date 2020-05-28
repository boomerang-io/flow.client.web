import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { useExecutionContext } from "Hooks";
import WorkflowNode from "Components/WorkflowNode";
import { ExecutionStatus } from "Constants";
import { ACTIVITY_STATUSES } from "Constants/activityStatuses";
import styles from "./TemplateTaskNodeExecution.module.scss";

TemplateTaskNodeExecution.propTypes = {
  node: PropTypes.object.isRequired,
};

TemplateTaskNodeExecution.defaultProps = {
  node: {},
};

export default function TemplateTaskNodeExecution({ node }) {
  const { tasks, workflowExecution } = useExecutionContext();
  const task = tasks.find((t) => t.id === node.taskId);
  const { steps } = workflowExecution;
  const step = Array.isArray(steps) ? steps.find((step) => step.taskId === node.id) : {};
  const flowTaskStatus = step?.flowTaskStatus ?? ExecutionStatus.Skipped;

  return (
    <WorkflowNode
      isExecution
      category={task?.category}
      className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ACTIVITY_STATUSES.NOT_STARTED })}
      icon={task?.icon}
      name={task?.name}
      node={node}
      subtitle={node.taskName}
      title={task?.name}
    >
      <div className={styles.progressBar} />
    </WorkflowNode>
  );
}
