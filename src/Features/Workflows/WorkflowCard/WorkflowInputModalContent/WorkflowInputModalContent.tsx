import React from "react";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./workflowInputModalContent.module.scss";

interface WorkflowInputModalContentProps {
  closeModal: () => void;
  executeError: any;
  executeWorkflow: (closeModal: () => void, redirect: boolean, properties: {}) => Promise<void>;
  inputs: {}[];
  isExecuting: boolean;
}

const WorkflowInputModalContent: React.FC<WorkflowInputModalContentProps> = ({
  closeModal,
  executeError,
  executeWorkflow,
  inputs,
  isExecuting,
}) => {
  const [isRedirectEnabled, setIsRedirectEnabled] = React.useState(false);
  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      inputs={inputs}
      toggleProps={() => ({
        orientation: "vertical",
      })}
      onSubmit={(values: any) => {
        executeWorkflow(closeModal, isRedirectEnabled, values);
      }}
    >
      {({ inputs, formikProps }: { inputs: JSX.Element; formikProps: any }) => (
        <ModalFlowForm className={styles.container}>
          <ModalBody hasScrollingContent aria-label="inputs">
            {inputs}
            {executeError && (
              <InlineNotification
                lowContrast
                kind="error"
                title="Something's Wrong"
                subtitle="Request to execute workflow failed"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            {isExecuting ? (
              <Button disabled style={{ flex: "0 1 107.5%" }}>
                Running...
              </Button>
            ) : (
              <>
                <Button
                  disabled={!formikProps.isValid}
                  onClick={(e: React.SyntheticEvent) => {
                    formikProps.handleSubmit();
                  }}
                  type="button"
                >
                  Run
                </Button>
                <Button
                  disabled={!formikProps.isValid}
                  onClick={(e: React.SyntheticEvent) => {
                    setIsRedirectEnabled(true);
                    formikProps.handleSubmit();
                  }}
                  type="button"
                >
                  Run and View
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
};

export default WorkflowInputModalContent;
