import React from "react";
import { useAppContext } from "Hooks";
import { useMutation, useQueryClient, UseQueryResult } from "react-query";
import { withRouter, useParams } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";
import {
  Button,
  ComposedModal,
  ConfirmModal,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  ModalBody,
  notify,
  SkeletonPlaceholder,
  Tag,
  TextArea,
  ToastNotification,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import OutputPropertiesLog from "Features/Execution/Main/ExecutionTaskLog/TaskItem/OutputPropertiesLog";
import ErrorModal from "Components/ErrorModal";
// import { appLink } from "Config/appConfig";
import { elevatedUserRoles, QueryStatus } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Catalog16, CopyFile16, StopOutline16, Warning16 } from "@carbon/icons-react";
import { ExecutionStatus, WorkflowSummary } from "Types";
import styles from "./executionHeader.module.scss";

type Props = {
  history: any;
  location: any;
  match: any;
  workflow: UseQueryResult<any, Error> | UseQueryResult<any, Error> | UseQueryResult<any>;
  workflowExecution: UseQueryResult<any, Error> | UseQueryResult<any, Error> | UseQueryResult<any>;
  version: number;
};

const cancelSatusTypes = [ExecutionStatus.NotStarted, ExecutionStatus.Waiting, ExecutionStatus.InProgress];

function ExecutionHeader({ history, workflow, workflowExecution, version }: Props) {
  // const { state } = history.location;
  const { user } = useAppContext();
  const queryClient = useQueryClient();

  const { platformRole } = user;
  const systemWorkflowsEnabled = elevatedUserRoles.includes(platformRole);
  const { teamName, initiatedByUserName, trigger, creationDate, scope, status, id } = workflowExecution.data;
  const displayCancelButton = cancelSatusTypes.includes(status);

  const { mutateAsync: deleteCancelWorkflowMutation } = useMutation(resolver.deleteCancelWorkflow, {
    onSuccess: () => queryClient.invalidateQueries(serviceUrl.getWorkflowExecution({ executionId: id })),
  });

  const handleCancelWorkflow = async () => {
    try {
      await deleteCancelWorkflowMutation({ executionId: id });
      notify(<ToastNotification kind="success" title="Cancel run" subtitle="Execution successfully cancelled" />);
    } catch {
      notify(<ToastNotification kind="error" title="Something's wrong" subtitle={`Failed to cancel this execution`} />);
    }
  };
  return (
    <Header
      className={styles.container}
      nav={
        <div className={styles.headerNav}>
          {/* <Breadcrumb noTrailingSlash>
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
          </Breadcrumb> */}
          <div className={styles.breadcrumbNav}>
            Activity /{" "}
            <div className={styles.breadcrumbNavItem}>
              {!workflow?.data?.name ? (
                <SkeletonPlaceholder className={styles.workflowNameSkeleton} />
              ) : (
                <p>{workflow.data.name}</p>
              )}
            </div>
          </div>
          {workflow?.data && (
            <ComposedModal
              composedModalProps={{ shouldCloseOnOverlayClick: true }}
              modalHeaderProps={{
                title: "Advanced Detail",
                subtitle:
                  "Use the following to dive deeper and debug the execution. Tip: copy the commands into your local terminal and add the namespace.",
              }}
              modalTrigger={({ openModal }: { openModal: () => void }) => (
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
      header={
        <div style={{ display: "flex" }}>
          <HeaderTitle>Workflow run detail</HeaderTitle>
          {Boolean(workflowExecution?.data?.error?.code) && (
            <ComposedModal
              composedModalProps={{ shouldCloseOnOverlayClick: true }}
              modalHeaderProps={{ title: "Execution Error" }}
              modalTrigger={({ openModal }: { openModal: () => void }) => (
                <Button
                  className={styles.workflowErrorTrigger}
                  kind={"ghost"}
                  onClick={openModal}
                  renderIcon={Warning16}
                  size="small"
                >
                  View Execution Error
                </Button>
              )}
            >
              {() => (
                <ErrorModal
                  errorCode={workflowExecution?.data?.error?.code}
                  errorMessage={workflowExecution?.data?.error?.message ?? ""}
                />
              )}
            </ComposedModal>
          )}
        </div>
      }
      actions={
        workflowExecution.status === QueryStatus.Success ? (
          <div className={styles.content}>
            {workflowExecution.data.outputProperties &&
              Object.keys(workflowExecution.data.outputProperties).length > 0 && (
                <div className={styles.workflowOutputLog}>
                  <OutputPropertiesLog
                    isOutput
                    flowTaskName={workflow.data.name}
                    //@ts-ignore
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
            <dl className={styles.dataButton}>
              {displayCancelButton && (
                <ConfirmModal
                  affirmativeAction={handleCancelWorkflow}
                  affirmativeButtonProps={{ kind: "danger" }}
                  children="Are you sure? Once a workflow is cancelled it will stop executing."
                  title="Cancel run"
                  modalTrigger={({ openModal }: { openModal: () => void }) => (
                    <Button
                      className={styles.cancelRun}
                      data-testid="cancel-run"
                      kind="danger--ghost"
                      iconDescription="Cancel run"
                      onClick={openModal}
                      renderIcon={StopOutline16}
                      size="small"
                    >
                      Cancel run
                    </Button>
                  )}
                />
              )}
            </dl>
          </div>
        ) : (
          <SkeletonPlaceholder className={styles.headerContentSkeleton} />
        )
      }
    />
  );
}

function WorkflowAdvancedDetail({ workflow }: { workflow: WorkflowSummary }) {
  const { workflowId, executionId }: { workflowId: string; executionId: string } = useParams();
  const [copyTokenText, setCopyTokenText] = React.useState("Copy");

  const labelTexts = [`boomerang.io/workflow-id=${workflowId}`, `boomerang.io/workflow-activity-id=${executionId}`];

  if (Array.isArray(workflow.labels) && workflow.labels.length > 0) {
    workflow.labels.forEach((label) => {
      labelTexts.push(`${label.key}=${label.value}`);
    });
  }

  const kubernetesCommand = `kubectl get pods -l ${labelTexts.join(",")}`;
  const tektonCommand = `tkn tr list --label ${labelTexts.join(",")}`;

  return (
    <ModalBody>
      <div>Use this information to debug the execution using the Tekton CLI.</div>
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
      <h1 className={styles.detailHeading}>Tekton Information</h1>
      <div>Use this information to debug the execution using the Tekton CLI.</div>
      <div className={styles.kubernetes}>
        <TextArea readOnly value={tektonCommand} />
        <TooltipHover direction="top" content={copyTokenText} hideOnClick={false}>
          <div className={styles.kubernetesCopyContainer}>
            <CopyToClipboard text={tektonCommand}>
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
      <h1 className={styles.detailHeading}>Kubernetes Information</h1>
      <div>Use this information to debug the execution using the Kubernetes CLI.</div>
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
