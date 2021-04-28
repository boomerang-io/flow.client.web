import React from "react";
import cx from "classnames";
import { Tile, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { taskIcons } from "Utils/taskIcons";
import { Bee16, Recommend16 } from "@carbon/icons-react";
import { TaskModel } from "Types";
import styles from "./task.module.scss";

const Task: React.FC<TaskModel> = ({ name, model, icon, verified, scope }) => {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const isTeamTask = scope === "team";
  const TaskIcon = taskIcons.find((currentIcon) => currentIcon.name === icon);
  return (
    <li>
      <Tile
        className={cx(styles.container, { [styles.globalTask]: !isTeamTask })}
        aria-selected={isDragActive}
        role="option"
        draggable={true}
        onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
          setIsDragActive(true);
          event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
        }}
        onDragEnd={() => setIsDragActive(false)}
        tabIndex="0"
      >
        <div className={styles.columnContainer}>
          <div className={styles.rowContainer}>
            {TaskIcon?.Icon ? (
              <TaskIcon.Icon className={cx(styles.taskIcon, { [styles.teamTask]: isTeamTask })} />
            ) : (
              <Bee16 className={cx(styles.taskIcon, { [styles.teamTask]: isTeamTask })} />
            )}
            <p className={styles.taskName}> {name} </p>
            {verified && (
              <TooltipHover
                className={cx(styles.tooltipHover, { [styles.teamTask]: isTeamTask })}
                direction="top"
                tooltipText={
                  <div className={styles.tooltipContainer}>
                    <strong>Verified</strong>
                    <p style={{ marginTop: "0.5rem" }}>
                      This task has been fully tested and verified right out of the box.
                    </p>
                  </div>
                }
              >
                <Recommend16 fill="#0072C3" style={{ willChange: "auto" }} />
              </TooltipHover>
            )}
          </div>

          {isTeamTask && <p className={styles.taskSubtext}>Team Task</p>}
        </div>
      </Tile>
    </li>
  );
};

export default Task;
