import React from "react";
import PropTypes from "prop-types";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { DynamicFormik, ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import styles from "./workflowInputModalContent.module.scss";

WorkflowInputModalContent.propTypes = {
  closeModal: PropTypes.func,
  executeWorkflow: PropTypes.func.isRequired,
  inputs: PropTypes.array.isRequired
};

// TOOD: remove in the future placeholder component to validate form on mount until fix is merged in
// FML: https://github.com/jaredpalmer/formik/pull/1971
function ValidateForm({ validateForm }) {
  React.useEffect(() => {
    validateForm();
  }, [validateForm]);

  return null;
}

function WorkflowInputModalContent({ closeModal, executeWorkflow, inputs }) {
  return (
    <DynamicFormik
      validateOnMount
      inputs={inputs}
      toggleProps={() => ({
        orientation: "vertical"
      })}
    >
      {({ inputs, propsFormik }) => (
        <ModalFlowForm className={styles.container}>
          <ModalBody>{inputs}</ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button
              disabled={!propsFormik.isValid}
              onClick={e => {
                e.preventDefault();
                executeWorkflow({
                  redirect: false,
                  properties: propsFormik.values
                });
                closeModal();
              }}
              type="button"
            >
              Run
            </Button>
            <Button
              disabled={!propsFormik.isValid}
              onClick={e => {
                e.preventDefault();
                executeWorkflow({
                  redirect: true,
                  properties: propsFormik.values
                });
                closeModal();
              }}
              type="button"
            >
              Run and View
            </Button>
          </ModalFooter>
          <ValidateForm validateForm={propsFormik.validateForm} />
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}

export default WorkflowInputModalContent;
