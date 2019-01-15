import React from "react";
import PropTypes from "prop-types";
import downloadIMG from "Assets/svg/install.svg";
import emailIMG from "Assets/svg/email_icon.svg";
import { TASK_KEYS_TO_ICON } from "Constants/taskIcons";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

function Task({ name, model }) {
  //TOOD: improve this
  /*let img;
  if (name === "Download File") {
    img = downloadIMG;
  } else if (name === "Send Mail") {
    img = emailIMG;
  } else if (name === "Ingest CSV") {
    img = downloadIMG;
  } else {
    img = emailIMG;
  }*/

  //{TASK_KEYS_TO_ICON[this.props.model.task_data.category]}

  return (
    <div
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
      }}
      className="b-task-template"
    >
      <div className="b-task-template__img">
        <img
          src={TASK_KEYS_TO_ICON[model.task_data.category]}
          alt={`Task ${name}`}
          className="b-task-template__img-svg"
        />
      </div>

      <div className="b-task-template__name"> {name} </div>
    </div>
  );
}

export default Task;
