import React from "react";
import PropTypes from "prop-types";
import { Button, InlineNotification, ModalBody, ModalFooter } from "carbon-components-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import ValidateFormikOnMount from "Components/ValidateFormikOnMount";
import styles from "./workflowInputModalContent.module.scss";

WorkflowInputModalContent.propTypes = {
  closeModal: PropTypes.func.isRequired,
  executeWorkflow: PropTypes.func.isRequired,
  inputs: PropTypes.array.isRequired,
  isExecuting: PropTypes.bool.isRequired,
};

function WorkflowInputModalContent({ closeModal, executeError, executeWorkflow, inputs, isExecuting }) {
  return (
    <DynamicFormik
      validateOnMount
      inputs={inputs}
      toggleProps={() => ({
        orientation: "vertical",
      })}
      onSubmit={(values) => {
        const redirect = values.redirect;
        delete values.redirect;
        executeWorkflow({
          closeModal,
          redirect,
          properties: values,
        });
      }}
    >
      {({ inputs, formikProps }) => (
        <ModalFlowForm className={styles.container}>
          <ModalBody>{inputs}</ModalBody>
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
                  onClick={(e) => {
                    formikProps.setFieldValue("redirect", false);
                    formikProps.handleSubmit();
                  }}
                  type="button"
                >
                  Run
                </Button>
                <Button
                  disabled={!formikProps.isValid}
                  onClick={(e) => {
                    formikProps.setFieldValue("redirect", true);
                    formikProps.handleSubmit();
                  }}
                  type="button"
                >
                  Run and View
                </Button>
              </>
            )}
            {executeError && (
              <InlineNotification
                kind="error"
                title="Something's Wrong"
                subtitle="Request to execute workflow failed"
              />
            )}
          </ModalFooter>
          <ValidateFormikOnMount validateForm={formikProps.validateForm} />
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}

export default WorkflowInputModalContent;
