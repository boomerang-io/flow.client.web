import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import "./styles.scss";

const StepSideInfo = ({ step }) => {
  return (
    <div className="c-step-side-info">
      <div className="s-step-side-info-title">{step.taskName}</div>
      <div className="c-step-side-info-details">
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Type</div>
          <div className="b-step-side-info-field__value">{"Task"}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Status</div>
          <div className="b-step-side-info-field__value">
            {ACTIVITY_STATUSES_TO_TEXT[step.flowTaskStatus]}
            <img src={ACTIVITY_STATUSES_TO_ICON[step.flowTaskStatus]} alt="Status" />
          </div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Start Time</div>
          <div className="b-step-side-info-field__value">
            {moment(step.startTime).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Duration</div>
          <div className="b-step-side-info-field__value">
            {step.duration ? getHumanizedDuration(Math.round(step.duration / 1000)) : "-----"}
          </div>
        </div>
      </div>
    </div>
  );
};

StepSideInfo.propTypes = {
  step: PropTypes.object.isRequired
};

export default StepSideInfo;
