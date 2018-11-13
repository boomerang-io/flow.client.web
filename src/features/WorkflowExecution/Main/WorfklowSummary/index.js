import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const WorkflowSummary = ({ workflowData, version }) => {
  return (
    <div className="c-workflow-summary">
      <div className="s-workflow-summary-title">Workflow</div>
      <div className="c-workflow-summary-details">
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Name</div>
          <div className="b-workflow-summary-field__value">{workflowData.name}</div>
        </div>
        <div className="b-workflow-summary-field">
          <div className="b-workflow-summary-field__key">Description</div>
          <div className="b-workflow-summary-field__value">{workflowData.shortDescription}</div>
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
  step: PropTypes.object.isRequired
};

export default WorkflowSummary;
