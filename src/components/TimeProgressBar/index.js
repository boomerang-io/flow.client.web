import React from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import Filler from "./Filler";
import "./styles.scss";

const TimeProgressBar = ({ tasks, updateActiveNode }) => {
  const steps = orderBy(tasks.steps, ["order"], ["asc"]);
  const totalDuration = tasks.duration;
  const allCompleted = !steps.filter(step => step.flowTaskStatus !== "completed").length;

  return (
    <div className="c-time-progress-bar">
      <div className="b-time-progress-bar">
        <div className="b-time-progress-bar__start">Start</div>
        <div className="b-time-progress-bar__finish">Finish</div>
        <div className="b-time-progress-bar__fillers">
          {steps.map((step, index) => (
            <Filler
              key={step.taskId}
              taskId={step.taskId}
              index={index}
              taskName={step.taskName}
              finishPosition={
                allCompleted
                  ? 100
                  : Math.round(((step.startTime - tasks.creationDate + step.duration) / totalDuration) * 100)
              }
              totalDuration={totalDuration}
              updateActiveNode={updateActiveNode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

TimeProgressBar.propTypes = {
  tasks: PropTypes.object.isRequired,
  updateActiveNode: PropTypes.func
};

export default TimeProgressBar;
