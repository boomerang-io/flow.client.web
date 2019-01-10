import React from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import Filler from "./Filler";
import "./styles.scss";

const colors = ["#57d785", "#95c4f3", "#fbeaae", "#fc835c", "#f7aac3"];

const TimeProgressBar = ({ tasks, updateActiveNode }) => {
  const steps = orderBy(tasks.steps, ["order"], ["asc"]).filter(
    step => step.flowTaskStatus === "completed" || step.flowTaskStatus === "skipped"
  );
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
              backgroundColor={colors[index % colors.length]}
              duration={step.duration}
              finishTime={step.startTime + step.duration}
              id={step.id}
              key={step.id}
              percentOfTotal={(step.duration / durationSum) * 100}
              status={step.flowTaskStatus}
              taskId={step.taskId}
              taskName={step.taskName}
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
