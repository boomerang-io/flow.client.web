import React from "react";
import PropTypes from "prop-types";
import { iconMapping } from "Constants/taskIcons";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

// TODO: confirm use of Carbon <Icon /> below
function Task({ name, model }) {
  console.log(model);
  console.log("sep");
  console.log(name);
  return (
    <div
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
      }}
      className="b-task-template"
    >
      <div className="b-task-template__img">
        {iconMapping(model.taskData.name, model.taskData.category) && (
          <img
            src={iconMapping(model.taskData.name, model.taskData.category)}
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
