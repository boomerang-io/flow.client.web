import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  SkeletonPlaceholder,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
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
    <Header
      className={styles.container}
      nav={
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem>
            <Link to={state ? state.fromUrl : appLink.activity()}>{state ? state.fromText : "Activity"}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            {!workflow?.data?.name ? (
              <SkeletonPlaceholder className={styles.workflowNameSkeleton} />
            ) : (
              <p>{workflow.data.name}</p>
            )}
          </BreadcrumbItem>
        </Breadcrumb>
      }
      header={<HeaderTitle>Workflow run detail</HeaderTitle>}
      actions={
        workflowExecution.status === QueryStatus.Success ? (
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
        )
      }
    />
  );
}

export default withRouter(ExecutionHeader);
