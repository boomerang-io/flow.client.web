import React from "react";
import {
  ConfirmModal,
  notify,
  InlineNotification,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { useMutation, queryCache } from "react-query";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./taskApprovalModal.module.scss";

interface TaskApprovalModalProps {
  approvalId: string;
  flowTaskName: string;
  executionId: string;
}

const TaskApprovalModal: React.FC<TaskApprovalModalProps> = ({ approvalId, flowTaskName, executionId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const cancelRequestRef = React.useRef<{} | null>();

  const [approvalMutator, { isLoading, error }] = useMutation(
    (args: { id: string; approval: boolean }) => {
      const { promise, cancel } = resolver.putWorkflowApproval(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(serviceUrl.getWorkflowExecution({ executionId }));
      },
    }
  );

  const handleApproval = async (approval: boolean) => {
    try {
      await approvalMutator({ id: approvalId, approval });
      setIsOpen(false);
      notify(
        <ToastNotification
          kind="success"
          title="Manual Approval"
          subtitle={approval ? "Successfully submitted approval request" : "Successfully submitted denial request"}
        />
      );
    } catch {}
  };

  return (
    <ConfirmModal
      affirmativeAction={() => handleApproval(true)}
      negativeAction={() => handleApproval(false)}
      onCloseModal={() => setIsOpen(false)}
      isExternallyControlled
      label={`${flowTaskName}`}
      title="Manual Approval"
      modalTrigger={() => (
        <button className={styles.trigger} onClick={() => setIsOpen(true)}>
          Action Approval
        </button>
      )}
      isOpen={isOpen}
      affirmativeButtonProps={{
        disabled: isLoading,
      }}
      affirmativeText="Approve"
      negativeButtonProps={{
        disabled: isLoading,
      }}
      negativeText="Deny"
    >
      <>
        <p>
          When indicating approval, the task will complete successfully. Otherwise if the approval is denied, then the
          task will be failed
        </p>
        {error && (
          <InlineNotification
            lowContrast
            kind="error"
            title={"Manual Approval Failed"}
            subtitle={"Something's Wrong"}
          />
        )}
      </>
    </ConfirmModal>
  );
};

export default TaskApprovalModal;
