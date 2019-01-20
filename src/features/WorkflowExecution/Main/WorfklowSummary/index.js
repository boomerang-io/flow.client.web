import React from "react";
import PropTypes from "prop-types";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, version, duration, status }) => {
  return (
    <div className="c-workflow-summary">
      <div className="s-workflow-summary-title">{workflowData.name || "Workflow"}</div>
      <div className="c-workflow-summary-details">
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Description</div>
          <div className="b-workflow-summary-field__value">{workflowData.shortDescription || "---"}</div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Version</div>
          <div className="b-workflow-summary-field__value">{version}</div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Status</div>
          <div className="b-workflow-summary-field__value">
            {ACTIVITY_STATUSES_TO_TEXT[status ? status : "notstarted"]}
            <img
              className="b-activity-card__status-icon"
              src={ACTIVITY_STATUSES_TO_ICON[status ? status : "notstarted"]}
              alt={`Status ${status}`}
            />
          </div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Duration</div>
          <div className="b-workflow-summary-field__value">
            {duration ? getHumanizedDuration(parseInt(duration / 1000, 10)) : "---"}
          </div>
        </div>
      </div>
    </div>
  );
};

WorkflowSummary.propTypes = {
  workflowData: PropTypes.object,
  version: PropTypes.number
};

export default WorkflowSummary;
