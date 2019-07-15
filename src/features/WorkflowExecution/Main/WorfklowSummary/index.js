import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { ACTIVITY_STATUSES_TO_TEXT, ACTIVITY_STATUSES_TO_ICON } from "Constants/activityStatuses";
import getHumanizedDuration from "@boomerang/boomerang-utilities/lib/getHumanizedDuration";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, workflowExecutionData, version }) => {
  return (
    <aside className="c-workflow-summary">
      <h1 className="s-workflow-summary-title">{workflowData.name || "Workflow"}</h1>
      <section className="c-workflow-summary-details">
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Summary</dt>
          <dd className="b-workflow-summary-field__value">{workflowData.shortDescription || "---"}</dd>
        </dl>
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Description</dt>
          <dd className="b-workflow-summary-field__value">{workflowData.description || "---"}</dd>
        </dl>
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Version</dt>
          <dd className="b-workflow-summary-field__value">{version}</dd>
        </dl>
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Status</dt>
          <dd className="b-workflow-summary-field__value">
            {ACTIVITY_STATUSES_TO_TEXT[workflowExecutionData.status ? workflowExecutionData.status : "notstarted"]}
            <img
              className="b-activity-card__status-icon"
              src={
                ACTIVITY_STATUSES_TO_ICON[workflowExecutionData.status ? workflowExecutionData.status : "notstarted"]
              }
              alt={`Status ${workflowExecutionData.status}`}
            />
          </dd>
        </dl>
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Start Time</dt>
          <dd className="b-workflow-summary-field__value">
            {moment(workflowExecutionData.creationDate).format("MMMM Do YYYY, h:mm:ss a")}
          </dd>
        </dl>
        <dl className="b-workflow-summary-field">
          <dt className="b-workflow-summary-field__key">Duration</dt>
          <dd className="b-workflow-summary-field__value">
            {workflowExecutionData.duration
              ? getHumanizedDuration(parseInt(workflowExecutionData.duration / 1000, 10))
              : "---"}
          </dd>
        </dl>
      </section>
    </aside>
  );
};

WorkflowSummary.propTypes = {
  workflowData: PropTypes.object.isRequired,
  workflowExecutionData: PropTypes.object.isRequired,
  version: PropTypes.number.isRequired
};

export default WorkflowSummary;
