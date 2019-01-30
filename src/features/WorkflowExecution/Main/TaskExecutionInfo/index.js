import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import TaskExecutionLog from "./TaskExecutionLog";
import OutputPropertiesLog from "./OutputPropertiesLog";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import "./styles.scss";

const TaskExecutionInfo = ({ flowActivityId, task }) => {
  return (
    <div className="c-step-side-info">
      <div className="s-step-side-info-title">{task.taskName}</div>
      <div className="c-step-side-info-details">
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Type</div>
          <div className="b-step-side-info-field__value">{"Task"}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Status</div>
          <div className="b-step-side-info-field__value">
            {ACTIVITY_STATUSES_TO_TEXT[task.flowTaskStatus]}
            <img src={ACTIVITY_STATUSES_TO_ICON[task.flowTaskStatus]} alt="Status" />
          </div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Start Time</div>
          <div className="b-step-side-info-field__value">
            {moment(task.startTime).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Duration</div>
          <div className="b-step-side-info-field__value">
            {task.duration ? getHumanizedDuration(Math.round(parseInt(task.duration / 1000), 10)) : "---"}
          </div>
        </div>
      </div>
      <div className="c-step-side-info-actions">
        <TaskExecutionLog
          flowTaskStatus={task.flowTaskStatus}
          flowTaskId={task.taskId}
          flowActivityId={flowActivityId}
          flowTaskName={task.taskName}
        />
        {task.outputs && Object.keys(task.outputs).length > 0 && (
          <OutputPropertiesLog flowTaskName={task.taskName} flowTaskOutputs={task.outputs} />
        )}
      </div>
    </div>
  );
};

TaskExecutionInfo.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired
};

export default TaskExecutionInfo;
