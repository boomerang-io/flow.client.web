import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, version }) => {
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
            {ACTIVITY_STATUSES_TO_TEXT[workflowData.status ? workflowData.status : "notstarted"]}
            <img
              className="b-activity-card__status-icon"
              src={ACTIVITY_STATUSES_TO_ICON[workflowData.status ? workflowData.status : "notstarted"]}
              alt={`Status ${workflowData.status}`}
            />
          </div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Start Time</div>
          <div className="b-workflow-summary-field__value">
            {moment(workflowData.creationDate).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Duration</div>
          <div className="b-workflow-summary-field__value">
            {workflowData.duration ? getHumanizedDuration(parseInt(workflowData.duration / 1000, 10)) : "---"}
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
