import React from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import Filler from "./Filler";
import { EXECUTION_STATUSES } from "Constants/workflowExecutionStatuses";
import "./styles.scss";

const colors = ["#57d785", "#95c4f3", "#fbeaae", "#fc835c", "#f7aac3"];

const TimeProgressBar = ({ workflowExecution, updateActiveNode }) => {
  const steps = orderBy(workflowExecution.steps, ["order"], ["asc"]).filter(
    step =>
      step.flowTaskStatus !== EXECUTION_STATUSES.NOT_STARTED && step.flowTaskStatus !== EXECUTION_STATUSES.IN_PROGRESS
  );
  let durationSum = 0;
  steps.forEach(step => (durationSum += step.duration));

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
  workflowExecution: PropTypes.object.isRequired,
  updateActiveNode: PropTypes.func.isRequired
};

export default TimeProgressBar;
