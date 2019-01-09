import React from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import Filler from "./Filler";
import "./styles.scss";

const TimeProgressBar = ({ tasks, updateActiveNode }) => {
  const steps = orderBy(tasks.steps, ["order"], ["asc"]).filter(step => step.flowTaskStatus === "completed");
  let durationSum = 0;
  tasks.steps.forEach(step => (durationSum += step.duration));

  return (
    <div className="c-time-progress-bar">
      <div className="b-time-progress-bar">
        <div className="b-time-progress-bar__start">Start</div>
        <div className="b-time-progress-bar__finish">Finish</div>
        <div className="b-time-progress-bar__fillers">
          {steps.map((step, index) => (
            <Filler
              id={step.id}
              key={step.taskId}
              taskId={step.taskId}
              status={step.flowTaskStatus}
              index={index}
              taskName={step.taskName}
              duration={step.duration}
              finishTime={step.startTime + step.duration}
              percentOfTotal={(step.duration / durationSum) * 100}
              currentDuration={step.duration}
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
