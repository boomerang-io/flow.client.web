import React from "react";
import PropTypes from "prop-types";
import {
  DynamicFormik,
  ModalFlowForm,
  ComposedModal,
  Button,
  ModalBody,
  TooltipHover,
} from "@boomerang/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { View16 } from "@carbon/icons-react";

PreviewConfig.propTypes = {
  templateConfig: PropTypes.array,
  taskTemplateName: PropTypes.string,
};

const modalHeadertext =
  "This is a preview of what the user sees when editing this Task. The user can also give this task a custom name for their Workflow, and can adjust its connected tasks. You can type in these fields to test any validation requirements.";

const TextEditorInput = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};
const textAreaProps = ({ input, formikProps }) => {
  const { values, setFieldValue } = formikProps;
  const { key, type, ...rest } = input;
  const itemConfig = TEXT_AREA_TYPES[type];
  return {
    autoSuggestions: [],
    formikSetFieldValue: (value) => setFieldValue(key, value),
    initialValue: values[key],
    item: input,
    ...itemConfig,
    ...rest,
  };
};

function PreviewConfigForm({ templateConfig, closeModal }) {
  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      inputs={templateConfig}
      dataDrivenInputProps={{
        TextEditor: TextEditorInput,
      }}
      textEditorProps={textAreaProps}
      toggleProps={() => ({
        orientation: "vertical",
      })}
    >
      {({ inputs, formikProps }) => (
        <ModalFlowForm>
          <ModalBody>{inputs}</ModalBody>
        </ModalFlowForm>
      )}
    </DynamicFormik>
  );
}
function PreviewConfig({ templateConfig, taskTemplateName }) {
  return (
    <ComposedModal
      composedModalProps={{ shouldCloseOnOverlayClick: true }}
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalHeaderProps={{
        title: `[Preview] ${taskTemplateName}`,
        subtitle: modalHeadertext,
      }}
      modalTrigger={({ openModal }) => (
        <TooltipHover direction="top" tooltipText={"Preview what the user sees when they view this task"}>
          <Button renderIcon={View16} onClick={openModal} size="field" kind="ghost" style={{ width: "6.25rem" }}>
            Preview
          </Button>
        </TooltipHover>
      )}
    >
      {({ closeModal }) => <PreviewConfigForm templateConfig={templateConfig} closeModal={closeModal} />}
    </ComposedModal>
  );
}
export default PreviewConfig;
