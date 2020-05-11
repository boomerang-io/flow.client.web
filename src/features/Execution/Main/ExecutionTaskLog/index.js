import React, { useState } from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import { Arrows32, ChevronLeft32 } from "@carbon/icons-react";
import { SkeletonPlaceholder, TooltipIcon } from "carbon-components-react";
import TaskItem from "./TaskItem";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import { ACTIVITY_STATUSES_TO_ICON, ACTIVITY_STATUSES_TO_TEXT } from "Constants/activityStatuses";
import { getSimplifiedDuration } from "Utilities/timeHelper";
import styles from "./executionTaskLog.module.scss";

ExecutionTaskLog.propTypes = {
  workflowExecution: PropTypes.object.isRequired
};

function ExecutionTaskLog({ workflowExecution }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasksSort, setTasksSort] = useState("desc");

  const { id, duration, status, steps } = workflowExecution.data;
  const Icon = ACTIVITY_STATUSES_TO_ICON[status];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSort = () => {
    setTasksSort(tasksSort === "desc" ? "asc" : "desc");
  };

  const sortedTasks = steps ? orderBy(steps, step => step.order, [tasksSort]) : [];

  return (
    <aside className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}>
      {workflowExecution.status === REQUEST_STATUSES.SUCCESS ? (
        <section className={`${styles.statusBlock} ${styles[status]}`}>
          <div className={styles.duration}>
            <p className={styles.title}>Duration</p>
            <time className={styles.value}>
              {typeof duration === "number" ? getSimplifiedDuration(duration / 1000) : "--"}
            </time>
          </div>
          <div className={styles.status}>
            <p className={styles.title}>Status</p>
            <div className={styles.statusData}>
              {Icon && <Icon aria-label={status} className={styles.statusIcon} />}
              <p className={styles.value}>{status ? ACTIVITY_STATUSES_TO_TEXT[status] : "--"}</p>
            </div>
          </div>
          <button className={styles.collapseButton} onClick={toggleCollapse}>
            <ChevronLeft32 className={styles.chevron} />
          </button>
        </section>
      ) : (
        <section className={styles.statusBlock}>
          <SkeletonPlaceholder className={styles.statusBlockSkeleton} />
        </section>
      )}
      <section className={styles.taskbar}>
        <p className={styles.taskbarTitle}>Task log</p>
        {!isCollapsed && (
          <TooltipIcon
            align="center"
            direction="top"
            tooltipText="Change sort direction (by start time)"
          >
            <button onClick={toggleSort} className={styles.taskbarButton} data-testid="taskbar-button">
              <Arrows32 className={styles.taskbarArrows} />
            </button>
          </TooltipIcon>
        )}
      </section>
      <ul className={styles.tasklog}>
        {workflowExecution.status === REQUEST_STATUSES.SUCCESS ? (
          sortedTasks.map(step => <TaskItem key={step.id} flowActivityId={id} hidden={isCollapsed} task={step} />)
        ) : (
          <SkeletonPlaceholder className={styles.taskLogSkeleton} />
        )}
      </ul>
    </aside>
  );
}

export default ExecutionTaskLog;
