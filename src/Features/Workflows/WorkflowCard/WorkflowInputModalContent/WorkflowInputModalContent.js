import React from "react";
import PropTypes from "prop-types";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang-io/carbon-addons-boomerang-react";
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
      allowCustomPropertySyntax
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
          <ModalBody hasScrollingContent>
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
          </ModalFooter>
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}

export default WorkflowInputModalContent;
