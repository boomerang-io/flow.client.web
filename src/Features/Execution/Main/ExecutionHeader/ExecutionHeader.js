import React from "react";
import { useAppContext } from "Hooks";
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
import OutputPropertiesLog from "Features/Execution/Main/ExecutionTaskLog/TaskItem/OutputPropertiesLog";
import { allowedUserRoles, QueryStatus } from "Constants";
import styles from "./executionHeader.module.scss";

ExecutionHeader.propTypes = {
  workflow: PropTypes.object.isRequired,
  workflowExecution: PropTypes.object.isRequired,
  version: PropTypes.number.isRequired,
};

function ExecutionHeader({ history, workflow, workflowExecution, version }) {
  const { state } = history.location;
  const { user } = useAppContext();

  const { platformRole } = user;
  const systemWorkflowsEnabled = allowedUserRoles.includes(platformRole);
  const { teamName, initiatedByUserName, trigger, creationDate, scope } = workflowExecution.data;

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
            {workflowExecution.data.outputProperties &&
              Object.keys(workflowExecution.data.outputProperties).length > 0 && (
                <div className={styles.workflowOutputLog}>
                  <OutputPropertiesLog
                    isOutput
                    flowTaskName={workflow.data.name}
                    flowTaskOutputs={workflowExecution.data.outputProperties}
                  />
                </div>
              )}
            {systemWorkflowsEnabled && (
              <dl className={styles.data}>
                <dt className={styles.dataTitle}>Scope</dt>
                <dd className={styles.dataValue}>{scope ?? "---"}</dd>
              </dl>
            )}
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Team</dt>
              <dd className={styles.dataValue}>{teamName ?? "---"}</dd>
            </dl>
            <dl className={styles.data}>
              <dt className={styles.dataTitle}>Version</dt>
              <dd className={styles.dataValue}>{version ?? "---"}</dd>
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
