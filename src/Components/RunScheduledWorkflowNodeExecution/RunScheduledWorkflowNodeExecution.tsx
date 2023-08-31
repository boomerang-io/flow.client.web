import React from "react";
import cx from "classnames";
import { useExecutionContext } from "Hooks";
import WorkflowNode from "Components/WorkflowNode";
import { RunStatus } from "Types";
import styles from "./RunScheduledWorkflowNodeExecution.module.scss";

import RunScheduledWorkflowNodeModel from "Utils/dag/runScheduledWorkflowNode/RunScheduledWorkflowNodeModel";

interface RunScheduledWorkflowNodeExecutionProps {
  node: RunScheduledWorkflowNodeModel;
}

const RunScheduledWorkflowNodeExecution: React.FC<RunScheduledWorkflowNodeExecutionProps> = (props) => {
  const { tasks, workflowExecution } = useExecutionContext();
  const { id, taskId, taskName } = props.node;

  const task = tasks.find((task) => task.id === taskId);
  const stepTaskStatus = Array.isArray(workflowExecution?.steps)
    ? workflowExecution?.steps.find((step) => step.taskId === id)?.flowTaskStatus
    : null;
  const flowTaskStatus = stepTaskStatus ?? RunStatus.Skipped;

  return (
    <WorkflowNode
      category={task?.category}
      className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === RunStatus.NotStarted })}
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

export default React.memo(RunScheduledWorkflowNodeExecution);
