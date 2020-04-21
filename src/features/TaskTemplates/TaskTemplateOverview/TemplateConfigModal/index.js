import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow, Button, TooltipDefinition } from "@boomerang/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import WorkflowEditButton from "Components/WorkflowEditButton";
import { Add16, Edit16 } from "@carbon/icons-react";
import styles from "./TemplateConfigModal.module.scss";

TemplateConfigModal.propTypes = {
  setting: PropTypes.object,
  isEdit: PropTypes.bool.isRequired,
  settings: PropTypes.array,
  settingKeys: PropTypes.array
};

export function TemplateConfigModal(props) {
  const { isEdit } = props;
  const editTrigger = ({ openModal }) => {
    let output = null;
    isEdit
      ? (output = (
        <TooltipDefinition direction="bottom" tooltipText={"Edit field"}>
          <Button renderIcon={Edit16} kind="ghost" size="field" onClick={openModal}/>
        </TooltipDefinition>
      ))
      : (output = (
        <TooltipDefinition direction="top" tooltipText={"Add a new field for this task"}>
          <Button renderIcon={Add16} kind="ghost" size="field" onClick={openModal}>Add a field</Button>
        </TooltipDefinition>
        ));
    return output;
  };
    return (
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your setting will not be saved"
        }}
        modalHeaderProps={{
          title: isEdit ? "Update Configuration" : "Create Configuration",
          subtitle: isEdit ? "Let's change some stuff" : "Let's create a new one"
        }}
        modalTrigger={editTrigger}
      >
        <TemplateConfigModalContent
          {...props}
        />
      </ModalFlow>
    );
}

export default TemplateConfigModal;
