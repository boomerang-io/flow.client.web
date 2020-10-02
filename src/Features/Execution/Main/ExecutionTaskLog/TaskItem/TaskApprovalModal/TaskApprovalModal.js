import React from "react";
import { queryCache, useMutation } from "react-query";
// import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  DecisionButtons,
  InlineNotification,
  Loading,
  ModalBody,
  ModalForm,
  ModalFooter,
  notify,
  TextArea,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { ThumbsUp16, ThumbsDown16 } from "@carbon/icons-react";
import styles from "./taskApprovalModal.module.scss";

const GateStatus = {
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

function TaskApprovalModal({ approvalId, executionId, closeModal }) {
  const cancelRequestRef = React.useRef();

  const [approvalMutator, { isLoading: approvalsIsLoading, error: approvalsError }] = useMutation(
    (args) => {
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

  const handleSubmit = async (values) => {
    const body = {
      id: approvalId,
      approved: values.status === GateStatus.Approved,
      comments: values.comment,
    };
    try {
      await approvalMutator({ body });
      notify(
        <ToastNotification
          kind="success"
          title="Manual Approval"
          subtitle={body.approved ? "Successfully submitted approval request" : "Successfully submitted denial request"}
        />
      );
      closeModal();
    } catch (err) {
      // noop
    }
  };

  const buttons = [
    { icon: ThumbsDown16, label: "Reject", type: "negative", value: GateStatus.Rejected },
    { icon: ThumbsUp16, label: "Approve", type: "positive", value: GateStatus.Approved },
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={{ comment: "", status: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        comment: Yup.string().nullable().max(200, "The comment must not have more than 200 characters"),
        status: Yup.string().nullable(),
      })}
    >
      {(props) => {
        const { values, handleSubmit, isValid, errors, touched, handleChange, setFieldValue, handleBlur } = props;

        const isApprovalApprovedOrRejected = Boolean(values.status);

        return (
          <ModalForm onSubmit={handleSubmit}>
            <ModalBody className={styles.modalBody}>
              {approvalsIsLoading ? (
                <Loading />
              ) : (
                <section className={styles.approval}>
                  {/*<time className={styles.approvalTime}>{`Submitted ${moment(creationDate).fromNow()}`}</time>*/}
                  <div className={styles.inputs}>
                    <div className={styles.comment}>
                      <TextArea
                        id={`comment`}
                        className={styles.commentArea}
                        labelText="Comments (optional)"
                        placeholder="Add some reasoning for your decision"
                        value={values?.comment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={errors?.comment && touched?.comment}
                        invalidText={errors?.comment}
                      />
                      <p className={styles.commentLength}>{`${values?.comment.length}/200`}</p>
                    </div>
                    <DecisionButtons
                      canUncheck
                      className={styles.decisionButtons}
                      items={buttons}
                      name={`decision-buttons`}
                      onChange={(value) => setFieldValue(`status`, value)}
                      selectedItem={values?.status}
                    />
                  </div>
                </section>
              )}

              {Boolean(approvalsError) && (
                <InlineNotification
                  style={{ marginBottom: "0.5rem" }}
                  lowContrast
                  kind="error"
                  title={"Manual Approval Failed"}
                  subtitle={"Something's Wrong"}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={!isValid || approvalsIsLoading || !isApprovalApprovedOrRejected} type="submit">
                {!approvalsIsLoading ? "Submit decisions" : "Submitting..."}
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </Formik>
  );
}

export default TaskApprovalModal;

// import React from "react";
// import {
//   ConfirmModal,
//   notify,
//   InlineNotification,
//   ToastNotification,
// } from "@boomerang-io/carbon-addons-boomerang-react";
// import { useMutation, queryCache } from "react-query";
// import { serviceUrl, resolver } from "Config/servicesConfig";
// import styles from "./taskApprovalModal.module.scss";

// interface TaskApprovalModalProps {
//   approvalId: string;
//   flowTaskName: string;
//   executionId: string;
// }

// const TaskApprovalModal: React.FC<TaskApprovalModalProps> = ({ approvalId, flowTaskName, executionId }) => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const cancelRequestRef = React.useRef<{} | null>();

//   // const [approvalMutator, { isLoading, error }] = useMutation(
//   //   (args: { id: string; approval: boolean }) => {
//   //     const { promise, cancel } = resolver.putWorkflowApproval(args);
//   //     if (cancelRequestRef?.current) {
//   //       cancelRequestRef.current = cancel;
//   //     }
//   //     return promise;
//   //   },
//   //   {
//   //     onSuccess: () => {
//   //       queryCache.invalidateQueries(serviceUrl.getWorkflowExecution({ executionId }));
//   //     },
//   //   }
//   // );

//   // const handleApproval = async (approval: boolean) => {
//   //   try {
//   //     await approvalMutator({ id: approvalId, approval });
//   //     setIsOpen(false);
//   //     notify(
//   //       <ToastNotification
//   //         kind="success"
//   //         title="Manual Approval"
//   //         subtitle={approval ? "Successfully submitted approval request" : "Successfully submitted denial request"}
//   //       />
//   //     );
//   //   } catch {}
//   // };

//   return (
//     <ConfirmModal
//       // affirmativeAction={() => handleApproval(true)}
//       // negativeAction={() => handleApproval(false)}
//       onCloseModal={() => setIsOpen(false)}
//       isExternallyControlled
//       label={`${flowTaskName}`}
//       title="Manual Approval"
//       modalTrigger={() => (
//         <button className={styles.trigger} onClick={() => setIsOpen(true)}>
//           Action Approval
//         </button>
//       )}
//       isOpen={isOpen}
//       affirmativeButtonProps={{
//         disabled: isLoading,
//       }}
//       affirmativeText="Approve"
//       negativeButtonProps={{
//         disabled: isLoading,
//       }}
//       negativeText="Deny"
//     >
//       <>
//         <p>
//           When indicating approval, the task will complete successfully. Otherwise if the approval is denied, then the
//           task will be failed
//         </p>
//         {error && (
//           <InlineNotification
//             lowContrast
//             kind="error"
//             title={"Manual Approval Failed"}
//             subtitle={"Something's Wrong"}
//           />
//         )}
//       </>
//     </ConfirmModal>
//   );
// };

// export default TaskApprovalModal;
