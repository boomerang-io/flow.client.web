import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { Button, ModalBody } from "@carbon/react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorModal from "Components/ErrorModal";
import ManualTaskModal from "./ManualTaskModal";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskApprovalModal from "./TaskApprovalModal";
import TaskExecutionLog from "./TaskExecutionLog";
import moment from "moment";
import dateHelper from "Utils/dateHelper";
import { executionStatusIcon, ExecutionStatusCopy, NodeType } from "Constants";
import { ApprovalStatus, RunStatus, WorkflowExecutionStep } from "Types";
import styles from "./taskItem.module.scss";

import { appLink } from "Config/appConfig";

const logTaskTypes = ["customtask", "template", "script"];
const logStatusTypes = [RunStatus.Succeeded, RunStatus.Failed, RunStatus.Running];

type Props = {
  flowActivityId: string;
  hidden: boolean;
  task: WorkflowExecutionStep;
  executionId: string;
};

function TaskItem({ flowActivityId, hidden, task, executionId }: Props) {
  const { team } = useParams<{ team: string }>();
  const {
    approval,
    duration,
    flowTaskStatus,
    id,
    results,
    runWorkflowActivityId,
    runWorkflowActivityStatus,
    runWorkflowId,
    startTime,
    taskId,
    taskName,
    taskType,
    switchValue,
    error,
  } = task;
  // const Icon = executionStatusIcon[flowTaskStatus];
  // const statusClassName = styles[flowTaskStatus];
  let statusClassName;
  let Icon;
  let runStatus;
  if (taskType === NodeType.RunWorkflow) {
    statusClassName = styles[runWorkflowActivityStatus] ?? styles[flowTaskStatus];
    Icon = executionStatusIcon[runWorkflowActivityStatus] ?? executionStatusIcon[flowTaskStatus];
    runStatus = runWorkflowActivityStatus ?? flowTaskStatus;
  } else {
    statusClassName = styles[flowTaskStatus];
    Icon = executionStatusIcon[flowTaskStatus];
    runStatus = flowTaskStatus;
  }
  //@ts-ignore
  const calculatedDuration = Number.parseInt(duration)
    ? dateHelper.timeMillisecondsToTimeUnit(duration)
    : dateHelper.durationFromThenToNow(startTime) || "---";

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <li key={id} id={`task-${taskId}`} tabIndex={0} className={`${styles.taskitem} ${statusClassName}`}>
      <div className={styles.progressBar} />
      <section className={styles.header}>
        <div className={styles.title}>
          <Icon aria-label={runStatus} className={styles.taskIcon} />
          <p title={taskName} data-testid="taskitem-name">
            {taskName}
          </p>
        </div>
        <div className={`${styles.status} ${statusClassName}`}>
          <Icon aria-label={runStatus} className={styles.statusIcon} />
          <p>{ExecutionStatusCopy[runStatus]}</p>
        </div>
      </section>
      <section className={styles.data}>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Start time</p>
          <time className={styles.timeValue}>{startTime ? moment(startTime).format("hh:mm:ss A") : "---"}</time>
        </div>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Duration</p>
          <time className={styles.timeValue}>{calculatedDuration}</time>
        </div>
        {taskType === NodeType.Decision && (
          <div className={styles.time}>
            <p className={styles.timeTitle}>Value</p>
            <time className={styles.timeValue}>{switchValue ?? ""}</time>
          </div>
        )}
      </section>
      {!hidden && (
        <section className={styles.data}>
          {((flowTaskStatus === RunStatus.Cancelled && duration > 0) ||
            (logTaskTypes.includes(taskType) && logStatusTypes.includes(runStatus))) && (
            <TaskExecutionLog flowActivityId={flowActivityId} flowTaskId={taskId} flowTaskName={taskName} />
          )}
          {results && Object.keys(results).length > 0 && (
            //@ts-ignore
            <OutputPropertiesLog flowTaskName={taskName} flowTaskOutputs={results} />
          )}
          {taskType === NodeType.RunWorkflow && runWorkflowActivityId && runWorkflowId && (
            <Link
              to={appLink.execution({ team, executionId: runWorkflowActivityId, workflowId: runWorkflowId })}
              className={styles.viewActivityLink}
            >
              View Activity
            </Link>
          )}
          {Boolean(error?.code) && (
            <ComposedModal
              modalHeaderProps={{
                title: "View Task Error",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }: { openModal: () => void }) => (
                <Button size="sm" kind="ghost" onClick={openModal}>
                  View Error
                </Button>
              )}
            >
              {({ closeModal }: { closeModal: () => void }) => (
                <ErrorModal errorCode={error?.code ?? ""} errorMessage={error?.message ?? ""} />
              )}
            </ComposedModal>
          )}
          {flowTaskStatus !== RunStatus.Cancelled &&
            taskType === NodeType.Approval &&
            approval?.status === ApprovalStatus.Submitted && (
              <ComposedModal
                modalHeaderProps={{
                  title: "Action Manual Approval",
                  subtitle: taskName,
                }}
                modalTrigger={({ openModal }: { openModal: () => void }) => (
                  <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                    Action Manual Approval
                  </Button>
                )}
              >
                {({ closeModal }: { closeModal: () => void }) => (
                  <TaskApprovalModal approvalId={approval.id} executionId={executionId} closeModal={closeModal} />
                )}
              </ComposedModal>
            )}
          {flowTaskStatus !== RunStatus.Cancelled &&
            taskType === NodeType.Manual &&
            approval?.status === ApprovalStatus.Submitted && (
              <ComposedModal
                composedModalProps={{
                  containerClassName: styles.actionManualTaskModalContainer,
                }}
                modalHeaderProps={{
                  title: "Action Manual Task",
                  subtitle: taskName,
                }}
                modalTrigger={({ openModal }: { openModal: () => void }) => (
                  <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                    Action Manual Task
                  </Button>
                )}
              >
                {({ closeModal }: { closeModal: () => void }) => (
                  <ManualTaskModal
                    approvalId={approval?.id}
                    executionId={executionId}
                    closeModal={closeModal}
                    instructions={approval?.instructions}
                  />
                )}
              </ComposedModal>
            )}
          {taskType === NodeType.Approval &&
            (approval?.status === ApprovalStatus.Approved || approval?.status === ApprovalStatus.Rejected) && (
              <ComposedModal
                composedModalProps={{
                  containerClassName: styles.approvalResultsModalContainer,
                  shouldCloseOnOverlayClick: true,
                }}
                modalHeaderProps={{
                  title: "Manual Approval details",
                }}
                modalTrigger={({ openModal }: { openModal: () => void }) => (
                  <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                    View Manual Approval
                  </Button>
                )}
              >
                {() => (
                  <ModalBody>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approval Status</span>
                      <p className={styles.sectionDetail}>{approval.status}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approver</span>
                      <p
                        className={styles.sectionDetail}
                      >{`${approval.audit.approverName} (${approval.audit.approverEmail})`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approval submitted</span>
                      <p className={styles.sectionDetail}>
                        {moment(approval.audit.actionDate).format("YYYY-MM-DD hh:mm A")}
                      </p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approval comments</span>
                      <p className={styles.sectionDetail}>{approval.audit.comments}</p>
                    </section>
                  </ModalBody>
                )}
              </ComposedModal>
            )}
          {taskType === NodeType.Manual &&
            (approval?.status === ApprovalStatus.Approved || approval?.status === ApprovalStatus.Rejected) && (
              <ComposedModal
                composedModalProps={{
                  containerClassName: styles.approvalResultsModalContainer,
                  shouldCloseOnOverlayClick: true,
                }}
                modalHeaderProps={{
                  title: "Manual Task details",
                }}
                modalTrigger={({ openModal }: { openModal: () => void }) => (
                  <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                    View Manual Task
                  </Button>
                )}
              >
                {() => (
                  <ModalBody>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Status</span>
                      <p className={styles.sectionDetail}>{`${
                        approval.status === ApprovalStatus.Approved
                          ? "Successfully Completed"
                          : "Unsuccessfully Completed"
                      }`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approver</span>
                      <p
                        className={styles.sectionDetail}
                      >{`${approval.audit.approverName} (${approval.audit.approverEmail})`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Submitted</span>
                      <p className={styles.sectionDetail}>
                        {moment(approval.audit.actionDate).format("YYYY-MM-DD hh:mm A")}
                      </p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Instructions</span>
                      <ReactMarkdown className="markdown-body" children={approval?.instructions} />
                    </section>
                  </ModalBody>
                )}
              </ComposedModal>
            )}
        </section>
      )}
    </li>
  );
}

export default TaskItem;
