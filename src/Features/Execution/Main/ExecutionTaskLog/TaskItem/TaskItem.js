import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang-io/utils/lib/getHumanizedDuration";
import { Button, ComposedModal, ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskExecutionLog from "./TaskExecutionLog";
import ManualTaskModal from "./ManualTaskModal";
import TaskApprovalModal from "./TaskApprovalModal";
import { ApprovalStatus, executionStatusIcon, ExecutionStatusCopy } from "Constants";
import styles from "./taskItem.module.scss";

const logTaskTypes = ["custom", "template"];

TaskItem.propTypes = {
  flowActivityId: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  task: PropTypes.object.isRequired,
  executionId: PropTypes.string.isRequired,
};

function TaskItem({ flowActivityId, hidden, task, executionId }) {
  const { duration, flowTaskStatus, id, outputs, startTime, taskId, taskName, approval, taskType } = task;
  const Icon = executionStatusIcon[flowTaskStatus];
  const statusClassName = styles[flowTaskStatus];

  return (
    <li key={id} className={`${styles.taskitem} ${statusClassName}`}>
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
        {/* <p className={styles.subtitle}>Subtitle</p> */}
        <div className={styles.time}>
          <p className={styles.timeTitle}>Start time</p>
          <time className={styles.timeValue}>{startTime ? moment(startTime).format("hh:mm:ss A") : "---"}</time>
        </div>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Duration</p>
          <time className={styles.timeValue}>{getHumanizedDuration(Math.ceil(parseInt(duration / 1000), 10))}</time>
        </div>
      </section>
      {!hidden && (
        <section className={styles.data}>
          {logTaskTypes.includes(taskType) && (
            <TaskExecutionLog flowActivityId={flowActivityId} flowTaskId={taskId} flowTaskName={taskName} />
          )}
          {outputs && Object.keys(outputs).length > 0 && (
            <OutputPropertiesLog flowTaskName={taskName} flowTaskOutputs={outputs} />
          )}
          {taskType === "approval" && approval?.status === ApprovalStatus.Submitted && (
            <ComposedModal
              modalHeaderProps={{
                title: "Pending manual approval",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }) => (
                <Button size="small" kind="ghost" onClick={openModal}>
                  Action Approval
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
          {taskType === "manual" && approval?.status === ApprovalStatus.Submitted && (
            <ComposedModal
              modalHeaderProps={{
                title: "Pending manual task",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }) => (
                <Button size="small" kind="ghost" onClick={openModal}>
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
          {taskType === "approval" &&
            (approval?.status === ApprovalStatus.Approved || approval?.status === ApprovalStatus.Rejected) && (
              <ComposedModal
                composedModalProps={{
                  containerClassName: styles.approvalResultsModalContainer,
                  shouldCloseOnOverlayClick: true,
                }}
                modalHeaderProps={{
                  title: "Approval details",
                }}
                modalTrigger={({ openModal }) => (
                  <Button size="small" kind="ghost" onClick={openModal}>
                    View Approval
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
                      >{`${approval.audit.approverName}(${approval.audit.approverEmail})`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approval submitted</span>
                      <p className={styles.sectionDetail}>{moment(approval.audit.actionDate).format("DD-MM-YY")}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approval comments</span>
                      <p className={styles.sectionDetail}>{approval.audit.comments}</p>
                    </section>
                  </ModalBody>
                )}
              </ComposedModal>
            )}

          {taskType === "manual" &&
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
                  <Button size="small" kind="ghost" onClick={openModal}>
                    View Manual Task Completion
                  </Button>
                )}
              >
                {() => (
                  <ModalBody>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Status</span>
                      <p className={styles.sectionDetail}>{`${
                        approval.status === "approved" ? "Successfully Completed" : "Unsuccessfully Completed"
                      }`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Approver</span>
                      <p
                        className={styles.sectionDetail}
                      >{`${approval.audit.approverName}(${approval.audit.approverEmail})`}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Submitted</span>
                      <p className={styles.sectionDetail}>{moment(approval.audit.actionDate).format("DD-MM-YY")}</p>
                    </section>
                    <section className={styles.detailedSection}>
                      <span className={styles.sectionHeader}>Instructions</span>
                      <p className={styles.sectionDetail}>{approval?.instructions}</p>
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
