import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import { executionStatusIcon, ExecutionStatusCopy } from "Constants";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskExecutionLog from "./TaskExecutionLog";
import styles from "./taskItem.module.scss";

TaskItem.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
};

function TaskItem({ flowActivityId, hidden, task }) {
  const { duration, flowTaskStatus, id, outputs, startTime, taskId, taskName } = task;
  const Icon = executionStatusIcon[flowTaskStatus];
  const statusClassName = styles[flowTaskStatus];

  return (
    <li key={id} className={`${styles.taskitem} ${statusClassName}`}>
      <div className={styles.progressBar} />
      <section className={styles.header}>
        <div className={styles.title}>
          <Icon aria-label={flowTaskStatus} className={styles.taskIcon} />
          <p title={taskName} data-testid="taskitem-name">
            {taskName}
          </p>
        </div>
        <div className={`${styles.status} ${statusClassName}`}>
          <Icon aria-label={flowTaskStatus} className={styles.statusIcon} />
          <p>{ExecutionStatusCopy[flowTaskStatus]}</p>
        </div>
      </section>
      <section className={styles.data}>
        {/* <p className={styles.subtitle}>Subtitle</p> */}
        <div className={styles.time}>
          <p className={styles.timeTitle}>Start time</p>
          <time className={styles.timeValue}>{moment(startTime).format("hh:mm:ss A")}</time>
        </div>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Duration</p>
          <time className={styles.timeValue}>{getHumanizedDuration(Math.round(parseInt(duration / 1000), 10))}</time>
        </div>
      </section>
      {!hidden && (
        <section className={styles.data}>
          <TaskExecutionLog flowActivityId={flowActivityId} flowTaskId={taskId} flowTaskName={taskName} />
          {outputs && Object.keys(outputs).length > 0 && (
            <OutputPropertiesLog flowTaskName={taskName} flowTaskOutputs={outputs} />
          )}
        </section>
      )}
    </li>
  );
}

export default TaskItem;
