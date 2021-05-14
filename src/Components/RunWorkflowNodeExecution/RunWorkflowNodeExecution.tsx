import React from "react";
// import PropTypes from "prop-types";
import cx from "classnames";
import { useExecutionContext } from "Hooks";
import { ExecutionStatus } from "Constants";
import WorkflowNode from "Components/WorkflowNode";
import styles from "./RunWorkflowNodeExecution.module.scss";

import RunWorkflowNodeModel from "Utils/dag/runWorkflowNode/RunWorkflowNodeModel";

interface RunWorkflowNodeExecutionProps {
  node: RunWorkflowNodeModel;
}

const RunWorkflowNodeExecution: React.FC<RunWorkflowNodeExecutionProps> = (props) => {
  const { tasks, workflowExecution } = useExecutionContext();
  const { id, taskId, taskName } = props.node;
  const task = tasks.find((task) => task.id === taskId);
  // const { steps } = workflowExecution;
  const stepTaskStatus = Array.isArray(workflowExecution.steps)
    ? workflowExecution.steps.find((step) => step.taskId === id)?.runWorkflowActivityStatus
    : null;
  // const flowTaskStatus = stepTaskStatus ?? ExecutionStatus.Skipped;
  const flowTaskStatus = stepTaskStatus ? stepTaskStatus : ExecutionStatus.Skipped;

  return (
    <WorkflowNode
      category={task?.category}
      className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ExecutionStatus.NotStarted })}
      icon={task?.icon}
      isExecution
      name={task?.name}
      node={props.node}
      subtitle={taskName}
      title={task?.name}
    >
      <div className={styles.progressBar} />
      <div className={styles.badgeContainer}>
        <p className={styles.badgeText}>System</p>
      </div>
      <div className={styles.progressBar} />
    </WorkflowNode>
  );
};

export default React.memo(RunWorkflowNodeExecution);
