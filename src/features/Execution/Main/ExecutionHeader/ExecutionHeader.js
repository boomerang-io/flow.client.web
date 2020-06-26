import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { SkeletonPlaceholder } from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import FeatureHeader from "Components/FeatureHeader";
import moment from "moment";
import { QueryStatus } from "Constants";
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
        {workflowExecution.status === QueryStatus.Success ? (
          <div className={styles.content}>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Team</dt>
              <dd className={styles.dataValue}>{teamName}</dd>
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Initiated by</dt>
              {initiatedByUserName ? (
                <dd className={styles.dataValue}>{initiatedByUserName}</dd>
              ) : (
                <dd aria-label="robot" aria-hidden={false} role="img">
                  {"🤖"}
                </dd>
              )}
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Trigger</dt>
              <dd className={styles.dataValue}>{trigger}</dd>
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Start time</dt>
              <dd className={styles.dataValue}>{moment(creationDate).format("YYYY-MM-DD hh:mm A")}</dd>
            </dl>
          </div>
        ) : (
          <SkeletonPlaceholder className={styles.headerContentSkeleton} />
        )}
      </div>
    </FeatureHeader>
  );
}

export default withRouter(ExecutionHeader);
