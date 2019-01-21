import React from "react";
import PropTypes from "prop-types";
import { TASK_KEYS_TO_ICON } from "Constants/taskIcons";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

function Task({ name, model }) {
  return (
    <div
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
      }}
      className="b-task-template"
    >
      <div className="b-task-template__img">
        {TASK_KEYS_TO_ICON[model.task_data.category] && (
          <img
            src={TASK_KEYS_TO_ICON[model.task_data.category]}
            alt={`Task ${name}`}
            className="b-task-template__img-svg"
          />
        )}
      </div>

      <div className="b-task-template__name"> {name} </div>
    </div>
  );
}

export default Task;
