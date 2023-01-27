//@ts-nocheck
import PropTypes from "prop-types";
import cx from "classnames";
import { useExecutionContext } from "Hooks";
import WorkflowNode from "Components/WorkflowNode";
import { ExecutionStatusMap } from "Constants";
import styles from "./TemplateTaskNodeExecution.module.scss";

TemplateTaskNodeExecution.propTypes = {
  node: PropTypes.object.isRequired,
};

TemplateTaskNodeExecution.defaultProps = {
  node: {},
};

export default function TemplateTaskNodeExecution({ node }) {
  const { tasks, workflowExecution } = useExecutionContext();
  const task = tasks.find((task) => task.id === node.taskId);
  const { steps } = workflowExecution;
  const step = Array.isArray(steps) ? steps.find((step) => step.taskId === node.id) : {};
  const flowTaskStatus = step?.flowTaskStatus ?? ExecutionStatusMap.Skipped;

  const scrollToTask = () => {
    const taskLogItem = document.getElementById(`task-${node.id}`);
    if (taskLogItem) {
      taskLogItem.scrollIntoView();
      taskLogItem.focus();
    }
  };

  return (
    <WorkflowNode
      isExecution
      category={task?.category}
      className={cx(styles[flowTaskStatus], { [styles.disabled]: flowTaskStatus === ExecutionStatusMap.NotStarted })}
      icon={task?.icon}
      name={task?.name}
      node={node}
      subtitle={node.taskName}
      title={task?.name}
      onClick={scrollToTask}
    >
      <div className={styles.progressBar} />
    </WorkflowNode>
  );
}
