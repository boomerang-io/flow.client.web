import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { SkeletonPlaceholder } from "@boomerang/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import FeatureHeader from "Components/FeatureHeader";
import moment from "moment";
import { REQUEST_STATUSES } from "Config/servicesConfig";
import styles from "./executionHeader.module.scss";

ExecutionHeader.propTypes = {
  workflow: PropTypes.object.isRequired,
  workflowExecution: PropTypes.object.isRequired,
};

function ExecutionHeader({ history, workflow, workflowExecution }) {
  const { state } = history.location;
  const { teamName, initiatedByUserName, trigger, creationDate } = workflowExecution.data;

  return (
    <FeatureHeader includeBorder>
      <div className={styles.container}>
        <section>
          <div className={styles.subtitle}>
            <Link className={styles.activityLink} to={state ? state.fromUrl : appLink.activity()}>
              {state ? state.fromText : "Activity"}
            </Link>
            <p style={{ margin: "0 0.5rem" }}>/</p>
            {!workflow?.data?.name ? (
              <SkeletonPlaceholder className={styles.workflowNameSkeleton} />
            ) : (
              <p>{workflow.data.name}</p>
            )}
          </div>
          <h1 className={styles.title}>Workflow run detail</h1>
        </section>
        {workflowExecution.status === REQUEST_STATUSES.SUCCESS ? (
          <div className={styles.content}>
            <div className={styles.data}>
              <p className={styles.dataTitle}>Team</p>
              <p className={styles.dataValue}>{teamName}</p>
            </div>
            <div className={styles.data}>
              <p className={styles.dataTitle}>Initiated by</p>
              {initiatedByUserName ? (
                <p className={styles.dataValue}>{initiatedByUserName}</p>
              ) : (
                <span aria-label="robot" aria-hidden={false} role="img">
                  {"🤖"}
                </span>
              )}
            </div>
            <div className={styles.data}>
              <p className={styles.dataTitle}>Trigger</p>
              <p className={styles.dataValue}>{trigger}</p>
            </div>
            <div className={styles.data}>
              <p className={styles.dataTitle}>Start time</p>
              <p className={styles.dataValue}>{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</p>
            </div>
          </div>
        ) : (
          <SkeletonPlaceholder className={styles.headerContentSkeleton} />
        )}
      </div>
    </FeatureHeader>
  );
}

export default withRouter(ExecutionHeader);
