// @ts-nocheck
import React from "react";
import { Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import { taskIcons } from "Utils/taskIcons";
import { Bee16 } from "@carbon/icons-react";
import { TaskModel } from "Types";
import styles from "./task.module.scss";

const Task: React.FC<TaskModel> = ({ name, model, icon }) => {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const TaskIcon = taskIcons.find((currentIcon) => currentIcon.name === icon);
  return (
    <li>
      <Tile
        className={styles.container}
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
        {TaskIcon?.Icon ? <TaskIcon.Icon /> : <Bee16 />}
        <p className={styles.taskName}> {name} </p>
      </Tile>
    </li>
  );
};

export default Task;
