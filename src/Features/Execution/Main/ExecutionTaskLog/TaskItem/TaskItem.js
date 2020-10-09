import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import getHumanizedDuration from "@boomerang-io/utils/lib/getHumanizedDuration";
import { ComposedModal, ModalBody } from "@boomerang-io/carbon-addons-boomerang-react";
import { ApprovalStatus, executionStatusIcon, ExecutionStatusCopy } from "Constants";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskExecutionLog from "./TaskExecutionLog";
import TaskApprovalModal from "./TaskApprovalModal";
import styles from "./taskItem.module.scss";
//only want to display logs for custom and task templates
const logTaskTypes = ["custom", "template"];
const eventTaskType = "eventwait";

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
          <time className={styles.timeValue}>{moment(startTime).format("hh:mm:ss A")}</time>
        </div>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Duration</p>
          <time className={styles.timeValue}>{getHumanizedDuration(Math.round(parseInt(duration / 1000), 10))}</time>
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
          {approval && approval.status === ApprovalStatus.Submitted && (
            <ComposedModal
              composedModalProps={{ shouldCloseOnOverlayClick: false }}
              modalHeaderProps={{
                title: "Pending manual approval",
                subtitle: taskName,
              }}
              modalTrigger={({ openModal }) => (
                <button className={styles.actionApprovalTrigger} onClick={openModal}>
                  Action Approval
                </button>
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
          {approval && (approval.status === ApprovalStatus.Approved || approval.status === ApprovalStatus.Rejected) && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.approvalResultsModalContainer,
                shouldCloseOnOverlayClick: true,
              }}
              modalHeaderProps={{
                title: "Approval details",
              }}
              modalTrigger={({ openModal }) => (
                <button className={styles.viewApprovalTrigger} onClick={openModal}>
                  View Approval
                </button>
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
          {/*taskType === eventTaskType && (
            <ComposedModal
              composedModalProps={{
                containerClassName: styles.approvalResultsModalContainer,
                shouldCloseOnOverlayClick: true,
              }}
              modalHeaderProps={{
                title: "Build wait for event url",
                subtitle:
                  "In order to wakeup your workflow and continue execution, you must provide an external event.",
              }}
              modalTrigger={({ openModal }) => (
                <button className={styles.viewApprovalTrigger} onClick={openModal}>
                  build wait url
                </button>
              )}
            >
              {() => (
                ///webhook/wfe?workflowId={workflowId}&access_token={access_token}&topic={topic}&workflowActivityId={workflowActivityId
                <ModalBody>
                  <section className={styles.detailedSection}>
                    <span className={styles.sectionHeader}>Workflow ID</span>
                    <p className={styles.sectionDetail}>{approval.status}</p>
                  </section>
                  <section className={styles.detailedSection}>
                    <span className={styles.sectionHeader}>Access Token</span>
                    <p className={styles.sectionDetail}>retrieve from Workflow Configuration</p>
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
              )*/}
        </section>
      )}
    </li>
  );
}

export default TaskItem;
