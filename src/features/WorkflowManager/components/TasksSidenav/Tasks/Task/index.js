import React from "react";
import PropTypes from "prop-types";
import downloadIMG from "Assets/svg/install.svg";
import emailIMG from "Assets/svg/email_icon.svg";

Task.propTypes = {
  name: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired
};

function Task({ name, model }) {
  //TOOD: improve this
  let img;
  if (name === "Download File") {
    img = downloadIMG;
  } else if (name === "Send Mail") {
    img = emailIMG;
  } else if (name === "Ingest CSV") {
    img = downloadIMG;
  } else {
    img = emailIMG;
  }

  return (
    <div
      draggable={true}
      onDragStart={event => {
        event.dataTransfer.setData("storm-diagram-node", JSON.stringify(model));
      }}
      className="b-task-template"
    >
      <div className="b-task-template__img">
        <img src={img} alt={`Task ${name}`} />
      </div>

      <div className="b-task-template__name"> {name} </div>
    </div>
  );
}

export default Task;
