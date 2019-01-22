import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, workflowExecutionData, version }) => {
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
            {ACTIVITY_STATUSES_TO_TEXT[workflowExecutionData.status ? workflowExecutionData.status : "notstarted"]}
            <img
              className="b-activity-card__status-icon"
              src={
                ACTIVITY_STATUSES_TO_ICON[workflowExecutionData.status ? workflowExecutionData.status : "notstarted"]
              }
              alt={`Status ${workflowExecutionData.status}`}
            />
          </div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Start Time</div>
          <div className="b-workflow-summary-field__value">
            {moment(workflowExecutionData.creationDate).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Duration</div>
          <div className="b-workflow-summary-field__value">
            {workflowExecutionData.duration
              ? getHumanizedDuration(parseInt(workflowExecutionData.duration / 1000, 10))
              : "---"}
          </div>
        </div>
      </div>
    </div>
  );
};

WorkflowSummary.propTypes = {
  workflowData: PropTypes.object.isRequired,
  workflowExecutionData: PropTypes.object.isRequired,
  version: PropTypes.number.isRequired
};

export default WorkflowSummary;
