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
      toggleProps={() => ({
        orientation: "vertical"
      })}
      onSubmit={(values) => { 
        const redirect = values.redirect;
        delete values.redirect;
        executeWorkflow({
          redirect,
          properties: values
        });
        closeModal();
        }
      }
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
                formikProps.setFieldValue("redirect", false);
                formikProps.handleSubmit();
              }}
              type="button"
            >
              Run
            </Button>
            <Button
              disabled={!formikProps.isValid}
              onClick={e => {
                formikProps.setFieldValue("redirect", true);
                formikProps.handleSubmit();
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
