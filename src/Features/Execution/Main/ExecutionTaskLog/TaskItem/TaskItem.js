import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { Button, ComposedModal, ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import ManualTaskModal from "./ManualTaskModal";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskApprovalModal from "./TaskApprovalModal";
import TaskExecutionLog from "./TaskExecutionLog";
import moment from "moment";
import dateHelper from "Utils/dateHelper";
import { ApprovalStatus, ExecutionStatus, executionStatusIcon, ExecutionStatusCopy, NodeType } from "Constants";
import styles from "./taskItem.module.scss";

const logTaskTypes = ["customtask", "template"];
const logStatusTypes = [ExecutionStatus.Completed, ExecutionStatus.Failure, ExecutionStatus.InProgress];

TaskItem.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  executionId: PropTypes.string.isRequired,
};

function TaskItem({ flowActivityId, hidden, task, executionId }) {
  const { duration, flowTaskStatus, id, outputs, startTime, taskId, taskName, approval, taskType, switchValue } = task;
  const Icon = executionStatusIcon[flowTaskStatus];
  const statusClassName = styles[flowTaskStatus];

  const calculatedDuration = Number.parseInt(duration)
    ? dateHelper.timeMillisecondsToTimeUnit(duration)
    : dateHelper.durationFromThenToNow(startTime) || "---";

    //console.log(task)

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <li key={id} id={`task-${taskId}`} tabIndex={0} className={`${styles.taskitem} ${statusClassName}`}>
      <div className={styles.progressBar} />
      <section className={styles.header}>
        <div className={styles.title}>
          <Icon aria-label={flowTaskStatus} className={styles.taskIcon} />
          <p title={taskName} data-testid="taskitem-name">
            {taskName}
          </p>
        </div>
        <div className={`${styles.status} ${statusClassName}`}>
          <Icon aria-label={flowTaskStatus} className={styles.statusIcon} />
          <p>{ExecutionStatusCopy[flowTaskStatus]}</p>
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
          {logTaskTypes.includes(taskType) && logStatusTypes.includes(flowTaskStatus) && (
            <TaskExecutionLog flowActivityId={flowActivityId} flowTaskId={taskId} flowTaskName={taskName} />
          )}
          {outputs && Object.keys(outputs).length > 0 && (
            <OutputPropertiesLog flowTaskName={taskName} flowTaskOutputs={outputs} />
          )}
          {taskType === NodeType.Approval && approval?.status === ApprovalStatus.Submitted && (
            <ComposedModal
              modalHeaderProps={{
                title: "Action Manual Approval",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }) => (
                <Button className={styles.modalTrigger} size="small" kind="ghost" onClick={openModal}>
                  Action Manual Approval
                </Button>
              )}
            >
              {({ closeModal }) => (
                <TaskApprovalModal
                  approvalId={approval.id}
                  flowTaskName={taskName}
                  executionId={executionId}
                  closeModal={closeModal}
                />
              )}
            </ComposedModal>
          )}
          {taskType === NodeType.Manual && approval?.status === ApprovalStatus.Submitted && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.actionManualTaskModalContainer,
              }}
              modalHeaderProps={{
                title: "Action Manual Task",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }) => (
                <Button className={styles.modalTrigger} size="small" kind="ghost" onClick={openModal}>
                  Action Manual Task
                </Button>
              )}
            >
              {({ closeModal }) => (
                <ManualTaskModal
                  approvalId={approval?.id}
                  flowTaskName={taskName}
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
                modalTrigger={({ openModal }) => (
                  <Button className={styles.modalTrigger} size="small" kind="ghost" onClick={openModal}>
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
                modalTrigger={({ openModal }) => (
                  <Button className={styles.modalTrigger} size="small" kind="ghost" onClick={openModal}>
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
                      <ReactMarkdown className="markdown-body" source={approval?.instructions} />
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
