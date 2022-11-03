import React, { useState } from "react";
import { SkeletonPlaceholder } from "@carbon/react";
import { TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { UseQueryResult } from "react-query";
import TaskItem from "./TaskItem";
import orderBy from "lodash/orderBy";
import { getSimplifiedDuration } from "Utils/timeHelper";
import { QueryStatus } from "Constants";
import { executionStatusIcon, ExecutionStatusCopy } from "Constants";
import { WorkflowExecution } from "Types";
import { ArrowsVertical, ChevronLeft } from "@carbon/react/icons";
import styles from "./executionTaskLog.module.scss";

type Props = {
  workflowExecution: UseQueryResult<WorkflowExecution, Error>;
};

function ExecutionTaskLog({ workflowExecution }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tasksSort, setTasksSort] = useState<boolean | "desc" | "asc">("desc");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSort = () => {
    setTasksSort(tasksSort === "desc" ? "asc" : "desc");
  };

  if (workflowExecution.status !== QueryStatus.Success) {
    return (
      <aside className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}>
        <section className={styles.statusBlock}>
          <SkeletonPlaceholder className={styles.statusBlockSkeleton} />
        </section>
        <section className={styles.taskbar}>
          <p className={styles.taskbarTitle}>Task log</p>
          {!isCollapsed && (
            <TooltipIco
              disabled
              align="center"
              className={styles.taskbarButton}
              id="sort-tooltip"
              data-testid="taskbar-button"
            >
              <ArrowsVertical size={32} className={styles.taskbarArrows} />
            </TooltipIco>
          )}
        </section>
        <ul className={styles.tasklog}>
          <SkeletonPlaceholder className={styles.taskLogSkeleton} />
        </ul>
      </aside>
    );
  }

  const { id, duration, status, steps } = workflowExecution.data;
  const Icon = executionStatusIcon[status];
  const sortedTasks = steps ? orderBy(steps, (step: any) => step.order, [tasksSort]) : [];

  return (
    <aside className={`${styles.container} ${isCollapsed ? styles.collapsed : ""}`}>
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
          <ChevronLeft size={32} className={styles.chevron} />
        </button>
      </section>
      <section className={styles.taskbar}>
        <p className={styles.taskbarTitle}>Task log</p>
        {!isCollapsed && (
          <TooltipHover
            align="center"
            className={styles.taskbarButton}
            id="sort-tooltip"
            data-testid="taskbar-button"
            direction="top"
            onClick={toggleSort}
            tooltipText="Change sort direction (by start time)"
          >
            <ArrowsVertical size={32} className={styles.taskbarArrows} />
          </TooltipHover>
        )}
      </section>
      <ul className={styles.tasklog}>
        {sortedTasks.map((step) => (
          <TaskItem
            key={step.id}
            flowActivityId={id}
            hidden={isCollapsed}
            task={step}
            executionId={workflowExecution.data.id}
          />
        ))}
      </ul>
    </aside>
  );
}

export default ExecutionTaskLog;
