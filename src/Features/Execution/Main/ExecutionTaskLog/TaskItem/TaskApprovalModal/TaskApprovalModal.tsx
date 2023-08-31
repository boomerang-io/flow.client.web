import React from "react";
import { useQueryClient, useMutation } from "react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  InlineNotification,
  ModalBody,
  ModalFooter,
} from "@carbon/react";
import { DecisionButtons, Loading, ModalForm, notify, TextArea, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { ThumbsUp, ThumbsDown } from "@carbon/react/icons";
import styles from "./taskApprovalModal.module.scss";

const GateStatus = {
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

type Props = {
  approvalId: string;
  executionId: string;
  closeModal: () => void;
};

function TaskApprovalModal({ approvalId, executionId, closeModal }: Props) {
  const queryClient = useQueryClient();

  const { mutateAsync: approvalMutator, isLoading: approvalsIsLoading, error: approvalsError } = useMutation(resolver.putWorkflowAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(serviceUrl.getWorkflowExecution({ executionId }));
      },
    }
  );

  const handleSubmit = async (values: any) => {
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
    { icon: ThumbsDown, label: "Reject", type: "negative", value: GateStatus.Rejected },
    { icon: ThumbsUp, label: "Approve", type: "positive", value: GateStatus.Approved },
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
                  <div className={styles.inputs}>
                    <div className={styles.comment}>
                      <TextArea
                        enableCounter
                        id={`comment`}
                        className={styles.commentArea}
                        labelText="Comments (optional)"
                        placeholder="Add some reasoning for your decision"
                        value={values?.comment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={Boolean(errors?.comment && touched?.comment)}
                        invalidText={errors?.comment}
                        maxCount={200}
                      />
                    </div>
                    <DecisionButtons
                      canUncheck
                      className={styles.decisionButtons}
                      items={buttons}
                      name={`decision-buttons`}
                      onChange={(value: string) => setFieldValue(`status`, value)}
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
