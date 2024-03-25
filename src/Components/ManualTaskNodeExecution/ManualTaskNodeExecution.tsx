import React from "react";
import cx from "classnames";
import WorkflowNode from "Components/WorkflowNode";
import { useExecutionContext } from "Hooks";
import ManualTaskNodeModel from "Utils/dag/manualTaskNode/ManualTaskNodeModel";
import { RunStatus } from "Types";
import styles from "./ManualTaskNodeExecution.module.scss";

interface ManualTaskNodeExecutionProps {
  node: ManualTaskNodeModel;
}

const ManualTaskNodeExecution: React.FC<ManualTaskNodeExecutionProps> = (props) => {
  const { tasks, workflowExecution } = useExecutionContext();
  const { id, taskId, taskName } = props.node;
  const task = tasks.find((task) => task.id === taskId);
  // const { steps } = workflowExecution;
  const stepTaskStatus = Array.isArray(workflowExecution?.steps)
    ? workflowExecution?.steps.find((step) => step.taskId === id)?.flowTaskStatus
    : null;
  const flowTaskStatus = stepTaskStatus ? stepTaskStatus : RunStatus.Skipped;

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
      onClick={scrollToTask}
    >
      <div className={styles.progressBar} />
      <div className={styles.badgeContainer}>
        <p className={styles.badgeText}>System</p>
      </div>
      <div className={styles.progressBar} />
    </WorkflowNode>
  );
};

export default React.memo(ManualTaskNodeExecution);
