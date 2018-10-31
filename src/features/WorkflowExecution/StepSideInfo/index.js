import React from "react";
import PropTypes from "prop-types";
import momentDurationFormatSetup from "moment-duration-format";
import moment from "moment";
import "./styles.scss";

const StepSideInfo = ({ step }) => {
  momentDurationFormatSetup(moment);

  return (
    <div className="c-step-side-info">
      <div className="s-step-side-info-title">Summary</div>
      <div className="c-step-side-info-details">
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Name</div>
          <div className="b-step-side-info-field__value">{step.stepName}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Type</div>
          <div className="b-step-side-info-field__value">Task</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Status</div>
          <div className="b-step-side-info-field__value">{step.flowTaskStatus}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Start Time</div>
          <div className="b-step-side-info-field__value">{moment(step.startTime).format("YYYY-MM-DD h:mm A")}</div>
        </div>
        <div className="b-step-side-info-field">
          <div className="b-step-side-info-field__key">Duration</div>
          <div className="b-step-side-info-field__value">{moment.duration(step.duration).format("hh:mm [mins]", { trim: false })}</div>
        </div>
      </div>
    </div>
  );
}

StepSideInfo.propTypes = {
  step: PropTypes.object.isRequired
};

export default StepSideInfo;
