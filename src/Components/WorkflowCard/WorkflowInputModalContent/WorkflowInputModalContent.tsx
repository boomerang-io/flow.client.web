import React from "react";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./workflowInputModalContent.module.scss";
import { InputProperty, InputType, PASSWORD_CONSTANT } from "Constants";

interface WorkflowInputModalContentProps {
  closeModal: () => void;
  executeError: any;
  executeWorkflow: (closeModal: () => void, redirect: boolean, properties: {}) => Promise<void>;
  inputs: Array<typeof InputProperty>;
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

  //edit inputs to handle secure values
  const secureInputs = inputs.map((input: typeof InputProperty) => {
    /* @ts-ignore-next-line */
    if (input[InputProperty.Type] === InputType.Password && input?.hiddenValue) {
      //if the input type is secure and there is a default value we are going to manipulate the object
      return {
        //allow the user to submit null
        ...input,
        required: false,
        helperText: "To use your secure default value, leave this input blank",
        placeholder: PASSWORD_CONSTANT,
      };
    } else return input;
  });

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      inputs={secureInputs}
      toggleProps={() => ({
        orientation: "vertical",
      })}
      onSubmit={(values: any) => {
        executeWorkflow(closeModal, isRedirectEnabled, values);
      }}
    >
      {({ inputs, formikProps }: { inputs: JSX.Element; formikProps: any }) => (
        <ModalFlowForm className={styles.container}>
          <ModalBody aria-label="inputs">
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
