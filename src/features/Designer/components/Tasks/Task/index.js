import React from "react";
import PropTypes from "prop-types";
import { Tile } from "carbon-components-react";
import mapTaskNametoIcon from "Utilities/taskIcons";
import styles from "./task.module.scss";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

function Task({ name, model }) {
  const [isDragActive, setIsDragActive] = React.useState(false);
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
        {mapTaskNametoIcon(model.taskData.name, model.taskData.category).iconImg}
        <p className={styles.taskName}> {name} </p>
      </Tile>
    </li>
  );
}

export default Task;
