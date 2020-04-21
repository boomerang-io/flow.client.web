import React from "react";
import PropTypes from "prop-types";
import { DynamicFormik, ModalFlowForm, ComposedModal, Button, ModalBody, ModalFooter, TooltipDefinition } from "@boomerang/carbon-addons-boomerang-react";
import ValidateFormikOnMount from "Components/ValidateFormikOnMount";
import { View16 } from "@carbon/icons-react";

PreviewConfig.propTypes = {
  taskTemplateName: PropTypes.string.isRequired,
  templateConfig: PropTypes.array.isRequired
};

const modalHeadertext = "This is a preview of what the user sees when editing this Task. The user can also give this task a custom name for their Workflow, and can adjust its connected tasks. You can type in these fields to test any validation requirements.";
function PreviewConfigForm({ templateConfig, closeModal }) {
  return (
    <DynamicFormik
      validateOnMount
      inputs={templateConfig}
      toggleProps={() => ({
        orientation: "vertical"
      })}
    >
      {({ inputs, formikProps }) => (
        <ModalFlowForm>
          <ModalBody>{inputs}</ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button
              disabled={!formikProps.isValid}
              onClick={closeModal}
              type="button"
            >
              Save
            </Button>
          </ModalFooter>
          <ValidateFormikOnMount validateForm={formikProps.validateForm} />
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}
function PreviewConfig ({templateConfig, taskTemplateName}) {
  return(
    <ComposedModal
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved"
      }}
      modalHeaderProps={{
        title: `[Preview] ${taskTemplateName}`,
        subtitle: modalHeadertext
      }}
      modalTrigger={({ openModal }) => (
        <TooltipDefinition direction="top" tooltipText={"Preview what the user sees when they view this task"}>
          <Button renderIcon={View16} onClick={openModal} size="field" kind="ghost" style={{width:"6.25rem"}}>Preview</Button>
        </TooltipDefinition>
      )}
    >
      {({ closeModal }) => <PreviewConfigForm templateConfig={templateConfig} closeModal={closeModal}/>}
    </ComposedModal>
  );
}
export default PreviewConfig;
