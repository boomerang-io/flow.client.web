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
    <aside className="c-step-side-info">
      <h1 className="s-step-side-info-title">{task.taskName}</h1>
      <section className="c-step-side-info-details">
        <dl className="b-step-side-info-field">
          <dt className="b-step-side-info-field__key">Type</dt>
          <dd className="b-step-side-info-field__value">{"Task"}</dd>
        </dl>
        <dl className="b-step-side-info-field">
          <dt className="b-step-side-info-field__key">Status</dt>
          <dd className="b-step-side-info-field__value">
            {ACTIVITY_STATUSES_TO_TEXT[task.flowTaskStatus]}
            <img src={ACTIVITY_STATUSES_TO_ICON[task.flowTaskStatus]} alt="Status" />
          </dd>
        </dl>
        <dl className="b-step-side-info-field">
          <dt className="b-step-side-info-field__key">Start Time</dt>
          <dd className="b-step-side-info-field__value">{moment(task.startTime).format("MMMM Do YYYY, h:mm:ss a")}</dd>
        </dl>
        <dl className="b-step-side-info-field">
          <dt className="b-step-side-info-field__key">Duration</dt>
          <dd className="b-step-side-info-field__value">
            {task.duration ? getHumanizedDuration(Math.round(parseInt(task.duration / 1000), 10)) : "---"}
          </dd>
        </dl>
        <dl className="b-step-side-info-field">
          <dt className="b-step-side-info-field__key">Log</dt>
          <dd className="b-step-side-info-field__value">
            <TaskExecutionLog
              flowTaskStatus={task.flowTaskStatus}
              flowTaskId={task.taskId}
              flowActivityId={flowActivityId}
              flowTaskName={task.taskName}
            />
          </dd>
        </dl>
        {task.outputs && Object.keys(task.outputs).length > 0 && (
          <dl className="b-step-side-info-field">
            <dt className="b-step-side-info-field__key">Properties</dt>
            <dd className="b-step-side-info-field__value">
              <OutputPropertiesLog flowTaskName={task.taskName} flowTaskOutputs={task.outputs} />
            </dd>
          </dl>
        )}
      </section>
    </aside>
  );
};

TaskExecutionInfo.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired
};

export default TaskExecutionInfo;
