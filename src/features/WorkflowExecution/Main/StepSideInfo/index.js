import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import "./styles.scss";

const StepSideInfo = ({ step }) => {
  return (
    <div className="c-step-side-info">
      <div className="s-step-side-info-title">Summary</div>
      <div className="c-step-side-info-details">
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Name</div>
          <div className="b-step-side-info-field__value">{step.taskName}</div>
        </div>
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
          <div className="b-step-side-info-field__value">{moment(step.startTime).format("YYYY-MM-DD h:mm A")}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Duration</div>
          <div className="b-step-side-info-field__value">
            {step.duration ? getHumanizedDuration(step.duration) : "-----"}
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
