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
import { ApprovalStatus, RunStatus, RunTask } from "Types";
import styles from "./taskItem.module.scss";

import { appLink } from "Config/appConfig";

const logTaskTypes = ["customtask", "template", "script"];
const logStatusTypes = [RunStatus.Succeeded, RunStatus.Failed, RunStatus.Running];

// TODO

type Props = {
  flowActivityId: string;
  hidden: boolean;
  task: RunTask;
  runId: string;
};

function TaskItem({ flowActivityId, hidden, task, runId }: Props) {
  const { team } = useParams<{ team: string }>();
  const { duration, status, id, results, startTime, name, type } = task;
  // const Icon = executionStatusIcon[flowTaskStatus];
  // const statusClassName = styles[flowTaskStatus];
  let statusClassName;
  let Icon;
  let runStatus;

  if (type === NodeType.RunWorkflow) {
    // statusClassName = styles[runWorkflowActivityStatus] ?? styles[status];
    // Icon = executionStatusIcon[runWorkflowActivityStatus] ?? executionStatusIcon[status];
    // runStatus = runWorkflowActivityStatus ?? status;
  } else {
    statusClassName = styles[status];
    Icon = executionStatusIcon[status];
    runStatus = status;
  }
  //@ts-ignore
  const calculatedDuration = Number.parseInt(duration)
    ? dateHelper.timeMillisecondsToTimeUnit(duration)
    : dateHelper.durationFromThenToNow(startTime) || "---";

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <li key={id} id={`task-${id}`} tabIndex={0} className={`${styles.taskitem} ${statusClassName}`}>
      <div className={styles.progressBar} />
      <section className={styles.header}>
        <div className={styles.title}>
          <Icon aria-label={runStatus} className={styles.taskIcon} />
          <p title={name} data-testid="taskitem-name">
            {name}
          </p>
        </div>
        <div className={`${styles.status} ${statusClassName}`}>
          <Icon aria-label={runStatus} className={styles.statusIcon} />
          <p>{ExecutionStatusCopy[status]}</p>
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
        {/* {type === NodeType.Decision && (
          <div className={styles.time}>
            <p className={styles.timeTitle}>Value</p>
            <time className={styles.timeValue}>{switchValue ?? ""}</time>
          </div>
        )} */}
      </section>
      {!hidden && (
        <section className={styles.data}>
          {((status === RunStatus.Cancelled && duration > 0) ||
            (logTaskTypes.includes(type) && logStatusTypes.includes(runStatus))) && (
            <TaskExecutionLog flowActivityId={flowActivityId} flowTaskId={id} flowTaskName={name} />
          )}
          {results && Object.keys(results).length > 0 && (
            //@ts-ignore
            <OutputPropertiesLog flowTaskName={name} flowTaskOutputs={results} />
          )}
          {/* {type === NodeType.RunWorkflow && runWorkflowActivityId && runWorkflowId && (
            <Link
              to={appLink.execution({ team, runId: runWorkflowActivityId, workflowId: runWorkflowId })}
              className={styles.viewActivityLink}
            >
              View Activity
            </Link>
          )} */}
          {/* {Boolean(error?.code) && (
            <ComposedModal
              modalHeaderProps={{
                title: "View Task Error",
                subtitle: name,
              }}
              modalTrigger={({ openModal }) => (
                <Button size="sm" kind="ghost" onClick={openModal}>
                  View Error
                </Button>
              )}
            >
              {({ closeModal }) => <ErrorModal errorCode={error?.code ?? ""} errorMessage={error?.message ?? ""} />}
            </ComposedModal>
          )} */}
          {/* {status === RunStatus.Waiting && type === NodeType.Approval && (
            <ComposedModal
              modalHeaderProps={{
                title: "Action Manual Approval",
                subtitle: name,
              }}
              modalTrigger={({ openModal }) => (
                <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                  Action Manual Approval
                </Button>
              )}
            >
              {({ closeModal }) => <TaskApprovalModal approvalId={approval.id} runId={runId} closeModal={closeModal} />}
            </ComposedModal>
          )} */}
          {/* {status === RunStatus.Waiting && type === NodeType.Manual && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.actionManualTaskModalContainer,
              }}
              modalHeaderProps={{
                title: "Action Manual Task",
                subtitle: name,
              }}
              modalTrigger={({ openModal }) => (
                <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                  Action Manual Task
                </Button>
              )}
            >
              {({ closeModal }) => (
                <ManualTaskModal
                  approvalId={approval?.id}
                  runId={runId}
                  closeModal={closeModal}
                  instructions={approval?.instructions}
                />
              )}
            </ComposedModal>
          )} */}
          {
            //TODO: update to make a request to get the approval and info about it
            // make sure that check is correct
          }
          {/* {type === NodeType.Approval && (status === RunStatus.Failed || status === RunStatus.Succeeded) && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.approvalResultsModalContainer,
                shouldCloseOnOverlayClick: true,
              }}
              modalHeaderProps={{
                title: "Manual Approval details",
              }}
              modalTrigger={({ openModal }) => (
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
          )} */}
          {
            //TODO: update to make a request to get the approval and info about it
            // make sure that check is correct
          }
          {/* {type === NodeType.Manual && (status === RunStatus.Failed || status === RunStatus.Succeeded) && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.approvalResultsModalContainer,
                shouldCloseOnOverlayClick: true,
              }}
              modalHeaderProps={{
                title: "Manual Task details",
              }}
              modalTrigger={({ openModal }) => (
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
          )} */}
        </section>
      )}
    </li>
  );
}

export default TaskItem;
