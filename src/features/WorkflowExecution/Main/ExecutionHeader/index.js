import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import styles from "./executionHeader.module.scss";

ExecutionHeader.propTypes = {
  workflowExecutionData: PropTypes.object.isRequired
};

function ExecutionHeader({ history, workflow, workflowExecutionData }) {
  const { state } = history.location;

  const data = {
    Team: workflowExecutionData.teamName,
    "Initiated by": workflowExecutionData.initiatedByUserName,
    Trigger: workflowExecutionData.trigger,
    "Start time": moment(workflowExecutionData.creationDate).format("YYYY-MM-DD hh:mm A")
  };

  return (
    <header className={styles.container}>
      <div className={styles.headline}>
        <div className={styles.subtitle}>
          <Link to={state ? state.fromUrl : "/activity"}>{state ? state.fromText : "Activity"}</Link>
          <p style={{ margin: "0 0.5rem" }}>/</p>
          <p>{workflow.name}</p>
        </div>
        <p className={styles.title}>Workflow run detail</p>
      </div>
      <div className={styles.content}>
        {Object.keys(data).map(key => (
          <div key={key} className={styles.data}>
            <p className={styles.dataTitle}>{key}</p>
            <p className={styles.dataValue}>{data[key]}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

export default withRouter(ExecutionHeader);
