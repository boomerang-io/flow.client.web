import React from "react";
import PropTypes from "prop-types";
import mapTaskNametoIcon from "Utilities/taskIcons";
import { Icon } from "carbon-components-react";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

// TODO: confirm use of Carbon <Icon /> below
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
        {mapTaskNametoIcon(model.taskData.name, model.taskData.category) && (
          <Icon
            fill="#40D5BB"
            name={mapTaskNametoIcon(model.taskData.name, model.taskData.category)}
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
