import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, version }) => {
  return (
    <div className="c-workflow-summary">
      <div className="s-workflow-summary-title">{workflowData.name || "Workflow"}</div>
      <div className="c-workflow-summary-details">
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Description</div>
          <div className="b-workflow-summary-field__value">{workflowData.shortDescription || ""}</div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Version</div>
          <div className="b-workflow-summary-field__value">{version}</div>
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
