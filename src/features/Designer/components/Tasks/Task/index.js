import React from "react";
import PropTypes from "prop-types";
import { Tile } from "carbon-components-react";
import { taskIcons } from "Utilities/taskIcons";
import { Bee16 } from "@carbon/icons-react";
import styles from "./task.module.scss";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

function Task({ name, model, icon }) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const taskIcon = taskIcons.find(currentIcon => currentIcon.iconName === icon);
  return (
    <li>
      <Tile
        className={styles.container}
        aria-selected={isDragActive}
        role="option"
        draggable={true}
        onDragStart={event => {
          setIsDragActive(true);
          event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
        }}
        onDragEnd={() => setIsDragActive(false)}
        tabIndex="0"
      >
        {taskIcon ? <taskIcon.icon /> : <Bee16 />}
        <p className={styles.taskName}> {name} </p>
      </Tile>
    </li>
  );
}

export default Task;
