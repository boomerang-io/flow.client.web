import React from "react";
import { useAppContext } from "Hooks";
import PropTypes from "prop-types";
import { withRouter, Link, useParams } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ComposedModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  ModalBody,
  SkeletonPlaceholder,
  Tag,
  TextArea,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import OutputPropertiesLog from "Features/Execution/Main/ExecutionTaskLog/TaskItem/OutputPropertiesLog";
import { appLink } from "Config/appConfig";
import { allowedUserRoles, QueryStatus } from "Constants";
import { Catalog16, CopyFile16 } from "@carbon/icons-react";
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
        <div className={styles.headerNav}>
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
          {workflow?.data && (
            <ComposedModal
              composedModalProps={{ shouldCloseOnOverlayClick: true }}
              modalHeaderProps={{ title: "Advanced Detail" }}
              modalTrigger={({ openModal }) => (
                <TooltipHover direction="right" content="Advanced Detail">
                  <button className={styles.workflowAdvancedDetailTrigger} onClick={openModal}>
                    <Catalog16 />
                  </button>
                </TooltipHover>
              )}
            >
              {() => <WorkflowAdvancedDetail workflow={workflow.data} />}
            </ComposedModal>
          )}
        </div>
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

function WorkflowAdvancedDetail({ workflow }) {
  const { workflowId, executionId } = useParams();
  const [copyTokenText, setCopyTokenText] = React.useState("Copy");

  const labelTexts = [`boomerang.io/workflow-id=${workflowId}`, `boomerang.io/workflow-activity-id=${executionId}`];

  if (Array.isArray(workflow.labels) && workflow.labels.length > 0) {
    workflow.labels.forEach((label) => {
      labelTexts.push(`${label.key}=${label.value}`);
    });
  }

  const kubernetesCommand = `kubectl get pods -l ${labelTexts.join(",")}`;

  return (
    <ModalBody>
      <h1 className={styles.detailHeading} style={{ marginTop: "0rem" }}>
        Labels
      </h1>
      <div className={styles.workflowLabels}>
        {labelTexts.map((label, index) => (
          <Tag key={`${label}-${index}`} className={styles.workflowLabelBubble} type="teal">
            {label}
          </Tag>
        ))}
      </div>
      <h1 className={styles.detailHeading}>Kubernetes Information</h1>
      <div className={styles.kubernetes}>
        <TextArea readOnly value={kubernetesCommand} />
        <TooltipHover direction="top" content={copyTokenText} hideOnClick={false}>
          <div className={styles.kubernetesCopyContainer}>
            <CopyToClipboard text={kubernetesCommand}>
              <Button
                className={styles.kubernetesCopy}
                iconDescription="copy-kubernetes"
                kind="ghost"
                onClick={() => setCopyTokenText("Copied!")}
                onMouseLeave={() => setCopyTokenText("Copy")}
                renderIcon={CopyFile16}
                size="small"
              />
            </CopyToClipboard>
          </div>
        </TooltipHover>
      </div>
    </ModalBody>
  );
}

export default withRouter(ExecutionHeader);
