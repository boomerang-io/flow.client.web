import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import orderBy from "lodash/orderBy";
import { Arrows32, ChevronLeft32 } from "@carbon/icons-react";
import TaskItem from "./TaskItem";
import { ACTIVITY_STATUSES_TO_ICON, ACTIVITY_STATUSES_TO_TEXT } from "Constants/activityStatuses";
import { getSimplifiedDuration } from "Utilities/timeHelper";
import styles from "./executionTaskLog.module.scss";

ExecutionTaskLog.propTypes = {
  workflowExecutionData: PropTypes.object.isRequired
};

function ExecutionTaskLog({ workflowExecutionData }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasksSort, setTasksSort] = useState("desc");

  const { id, duration, status, steps } = workflowExecutionData;
  const Icon = ACTIVITY_STATUSES_TO_ICON[status];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSort = () => {
    setTasksSort(tasksSort === "desc" ? "asc" : "desc");
  };

  const sortedTasks = orderBy(steps, step => moment(step.startTime).unix(), [tasksSort]);

  return (
    <aside className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}>
      <section className={`${styles.statusBlock} ${styles[status]}`}>
        <div className={styles.duration}>
          <p className={styles.title}>Duration</p>
          <time className={styles.value}>{getSimplifiedDuration(duration / 1000)}</time>
        </div>
        <div className={styles.status}>
          <p className={styles.title}>Status</p>
          <div className={styles.statusData}>
            <Icon aria-label={status} className={styles.statusIcon} />
            <p className={styles.value}>{ACTIVITY_STATUSES_TO_TEXT[status]}</p>
          </div>
        </div>
        <button className={styles.collapseButton} onClick={toggleCollapse}>
          <ChevronLeft32 className={styles.chevron} />
        </button>
      </section>
      <section className={styles.taskbar}>
        <p className={styles.taskbarTitle}>Task log</p>
        <button className={styles.taskbarButton} onClick={toggleSort}>
          <Arrows32 className={styles.taskbarArrows} />
        </button>
      </section>
      <section className={styles.tasklog}>
        {sortedTasks.map(step => (
          <TaskItem flowActivityId={id} task={step} />
        ))}
      </section>
    </aside>
  );
}

export default ExecutionTaskLog;
