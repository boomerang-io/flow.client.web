import React from "react";
import PropTypes from "prop-types";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import ValidateFormikOnMount from "Components/ValidateFormikOnMount";
import styles from "./workflowInputModalContent.module.scss";

WorkflowInputModalContent.propTypes = {
  closeModal: PropTypes.func,
  executeWorkflow: PropTypes.func.isRequired,
  inputs: PropTypes.array.isRequired
};

function WorkflowInputModalContent({ closeModal, executeWorkflow, inputs }) {
  return (
    <DynamicFormik
      validateOnMount
      inputs={inputs}
      dataDrivenInputProps={{
        description: null
      }}
      toggleProps={() => ({
        orientation: "vertical"
      })}
    >
      {({ inputs, formikProps }) => (
        <ModalFlowForm className={styles.container}>
          <ModalBody>{inputs}</ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button
              disabled={!formikProps.isValid}
              p
              onClick={e => {
                e.preventDefault();
                executeWorkflow({
                  redirect: false,
                  properties: formikProps.values
                });
                closeModal();
              }}
              type="button"
            >
              Run
            </Button>
            <Button
              disabled={!formikProps.isValid}
              onClick={e => {
                e.preventDefault();
                executeWorkflow({
                  redirect: true,
                  properties: formikProps.values
                });
                closeModal();
              }}
              type="button"
            >
              Run and View
            </Button>
          </ModalFooter>
          <ValidateFormikOnMount validateForm={formikProps.validateForm} />
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}

export default WorkflowInputModalContent;
