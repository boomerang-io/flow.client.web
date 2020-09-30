import React, { useState } from "react";
import PropTypes from "prop-types";
import { SkeletonPlaceholder, TooltipIcon } from "@boomerang-io/carbon-addons-boomerang-react";
import TaskItem from "./TaskItem";
import orderBy from "lodash/orderBy";
import { getSimplifiedDuration } from "Utils/timeHelper";
import { QueryStatus } from "Constants";
import { executionStatusIcon, ExecutionStatusCopy } from "Constants";
import { Arrows32, ChevronLeft32 } from "@carbon/icons-react";
import styles from "./executionTaskLog.module.scss";

ExecutionTaskLog.propTypes = {
  workflowExecution: PropTypes.object.isRequired,
};

function ExecutionTaskLog({ workflowExecution }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasksSort, setTasksSort] = useState("desc");

  const { id, duration, status, steps } = workflowExecution.data;
  const Icon = executionStatusIcon[status];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSort = () => {
    setTasksSort(tasksSort === "desc" ? "asc" : "desc");
  };

  const sortedTasks = steps ? orderBy(steps, (step) => step.order, [tasksSort]) : [];

  return (
    <aside className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}>
      {workflowExecution.status === QueryStatus.Success ? (
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
              <p className={styles.value}>{status ? ExecutionStatusCopy[status] : "--"}</p>
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
            className={styles.taskbarButton}
            id="sort-tooltip"
            data-testid="taskbar-button"
            direction="top"
            onClick={toggleSort}
            tooltipText="Change sort direction (by start time)"
          >
            <Arrows32 className={styles.taskbarArrows} />
          </TooltipIcon>
        )}
      </section>
      <ul className={styles.tasklog}>
        {workflowExecution.status === QueryStatus.Success ? (
          sortedTasks.map((step) => (
            <TaskItem
              key={step.id}
              flowActivityId={id}
              hidden={isCollapsed}
              task={step}
              executionId={workflowExecution.data.id}
            />
          ))
        ) : (
          <SkeletonPlaceholder className={styles.taskLogSkeleton} />
        )}
      </ul>
    </aside>
  );
}

export default ExecutionTaskLog;
