import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody } from "@carbon/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import ErrorModal from "Components/ErrorModal";
import { useTeamContext } from "Hooks";
import dateHelper from "Utils/dateHelper";
import ManualTaskModal from "./ManualTaskModal";
import OutputPropertiesLog from "./OutputPropertiesLog";
import TaskApprovalModal from "./TaskApprovalModal";
import TaskExecutionLog from "./TaskRunLog";
import styles from "./runTaskItem.module.scss";
import { appLink } from "Config/appConfig";
import { executionStatusIcon, ExecutionStatusCopy, NodeType } from "Constants";
import { ApprovalStatus, RunPhase, RunStatus, TaskRun, WorkflowRun } from "Types";

const logTaskTypes = ["customtask", "template", "script"];
const logStatusTypes = [RunStatus.Succeeded, RunStatus.Failed, RunStatus.Running];

type Props = {
  taskRun: TaskRun;
  workflowRun: WorkflowRun;
};

function RunTaskItem({ taskRun, workflowRun }: Props) {
  const { team } = useTeamContext();
  const Icon = executionStatusIcon[taskRun.status];
  const statusClassName = styles[taskRun.status];

  const calculatedDuration = taskRun.duration
    ? dateHelper.timeMillisecondsToTimeUnit(taskRun.duration)
    : dateHelper.durationFromThenToNow(taskRun.startTime) || "---";

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <li key={taskRun.id} id={`task-${taskRun.id}`} tabIndex={0} className={`${styles.taskitem} ${statusClassName}`}>
      <div className={styles.progressBar} />
      <section className={styles.header}>
        <div className={styles.title}>
          <Icon aria-label={taskRun.status} className={styles.taskIcon} />
          <p title={taskRun.name} data-testid="taskitem-name">
            {taskRun.name}
          </p>
        </div>
        <div className={`${styles.status} ${statusClassName}`}>
          <Icon aria-label={taskRun.status} className={styles.statusIcon} />
          <p>{ExecutionStatusCopy[taskRun.status]}</p>
        </div>
      </section>
      <section className={styles.data}>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Start time</p>
          <time className={styles.timeValue}>
            {taskRun.startTime ? moment(taskRun.startTime).format("hh:mm:ss A") : "---"}
          </time>
        </div>
        <div className={styles.time}>
          <p className={styles.timeTitle}>Duration</p>
          <time className={styles.timeValue}>{calculatedDuration}</time>
        </div>
        {taskRun.type === NodeType.Decision && (
          <div className={styles.time}>
            <p className={styles.timeTitle}>Value</p>
            <time className={styles.timeValue}>{taskRun.params ?? ""}</time>
          </div>
        )}
      </section>
      <section className={styles.data}>
        {((taskRun.status === RunStatus.Cancelled && taskRun.duration > 0) ||
          (logTaskTypes.includes(taskRun.type) && logStatusTypes.includes(taskRun.status))) && (
          <TaskExecutionLog taskrunId={taskRun.id} taskName={taskRun.name} />
        )}
        {taskRun.results && Object.keys(taskRun.results).length > 0 && (
          <OutputPropertiesLog taskName={taskRun.name} results={taskRun.results} />
        )}
        {taskRun.type === NodeType.RunWorkflow && taskRun.id && workflowRun.workflowRef && (
          <Link
            to={appLink.execution({ team: team.name, runId: taskRun.id, workflowId: workflowRun.workflowRef })}
            className={styles.viewActivityLink}
          >
            View Activity
          </Link>
        )}
        {/* {Boolean(taskRun.error?.code) && (
          <ComposedModal
            modalHeaderProps={{
              title: "View Task Error",
              subtitle: taskRun.name,
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
        {taskRun.status === RunStatus.Waiting && taskRun.type === NodeType.Approval && (
          <ComposedModal
            modalHeaderProps={{
              title: "Action Manual Approval",
              subtitle: taskRun.name,
            }}
            modalTrigger={({ openModal }) => (
              <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                Action Manual Approval
              </Button>
            )}
          >
            {({ closeModal }) => (
              <TaskApprovalModal
                actionId={taskRun.results.find((result) => result.name === "actionRef")?.value}
                closeModal={closeModal}
                workflowRunId={workflowRun.id}
              />
            )}
          </ComposedModal>
        )}
        {taskRun.status === RunStatus.Waiting && taskRun.type === NodeType.Manual && (
          <ComposedModal
            composedModalProps={{
              containerClassName: styles.actionManualTaskModalContainer,
            }}
            modalHeaderProps={{
              title: "Action Manual Task",
              subtitle: taskRun.name,
            }}
            modalTrigger={({ openModal }) => (
              <Button className={styles.modalTrigger} size="sm" kind="ghost" onClick={openModal}>
                Action Manual Task
              </Button>
            )}
          >
            {({ closeModal }) => (
              <ManualTaskModal
                actionId={taskRun.results.find((result) => result.name === "actionRef")?.value}
                closeModal={closeModal}
                instructions={taskRun.params.find((param) => param.name === "instructions")?.value}
                workflowRunId={workflowRun.id}
              />
            )}
          </ComposedModal>
        )}
        {
          //TODO: update to make a request to get the approval and info about it
          // make sure that check is correct
        }
        {/* {taskRun.type === NodeType.Approval && (runTask.status === RunStatus.Failed || runTask.status === RunStatus.Succeeded) && (
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
        {taskRun.type === NodeType.Manual && taskRun.phase === RunPhase.Completed && (
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
            {() => <ApporovalResult taskRun={taskRun} />}
          </ComposedModal>
        )}
      </section>
    </li>
  );
}

export default RunTaskItem;

interface ApporovalResultProps {
  taskRun: TaskRun;
}
function ApporovalResult({ taskRun }: ApporovalResultProps) {
  return (
    <ModalBody>
      <section className={styles.detailedSection}>
        <span className={styles.sectionHeader}>Status</span>
        <p className={styles.sectionDetail}>{`${
          taskRun.status === RunStatus.Succeeded ? "Successfully Completed" : "Unsuccessfully Completed"
        }`}</p>
      </section>
      <section className={styles.detailedSection}>
        <span className={styles.sectionHeader}>Approver</span>
        <p className={styles.sectionDetail}>{`${approval.audit.approverName} (${approval.audit.approverEmail})`}</p>
      </section>
      <section className={styles.detailedSection}>
        <span className={styles.sectionHeader}>Submitted</span>
        <p className={styles.sectionDetail}>{moment(approval.audit.actionDate).format("YYYY-MM-DD hh:mm A")}</p>
      </section>
      <section className={styles.detailedSection}>
        <span className={styles.sectionHeader}>Instructions</span>
        <ReactMarkdown className="markdown-body" children={approval?.instructions} />
      </section>
    </ModalBody>
  );
}
