//@ts-nocheck
import React from "react";
import { ComposedModal, Button, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import { Add16, Edit16 } from "@carbon/icons-react";
import { ComposedModalChildProps, DataDrivenInput, ModalTriggerProps } from "Types";
 // import styles from "./TemplateConfigModal.module.scss";

interface TemplateConfigModal {
  isActive: boolean,
  field: {}
  isEdit: boolean,
  templateFields: DataDrivenInput[],
  fieldKeys: string[],
  oldVersion: boolean
};

 const TemplateConfigModal: React.FC<TemplateConfigModal> = (props) => {
  const { isEdit, oldVersion, isActive } = props;
  const editTrigger = ({ openModal }: ModalTriggerProps) => {
    return isEdit
      ?
          <TooltipHover direction="bottom" tooltipText={"Edit field"}>
            <Button
              iconDescription="Edit field"
              renderIcon={Edit16}
              kind="ghost"
              size="field"
              onClick={openModal}
              disabled={oldVersion || !isActive}
            />
          </TooltipHover>
        
      : 
          <TooltipHover direction="top" tooltipText={"Add a new field for this task"}>
            <Button
              iconDescription="Add field"
              renderIcon={Add16}
              kind="ghost"
              size="field"
              onClick={openModal}
              disabled={oldVersion || !isActive}
            >
              Add a field
            </Button>
          </TooltipHover>
  };
  return (
    <ComposedModal
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your field will not be saved",
      }}
      composedModalProps={{ shouldCloseOnOverlayClick: false }}
      modalHeaderProps={{
        title: isEdit ? "Edit field" : "Create field",
      }}
      modalTrigger={editTrigger}
    >
      {({ closeModal, forceCloseModal }: ComposedModalChildProps) => (
        <TemplateConfigModalContent {...props} closeModal={closeModal} forceCloseModal={forceCloseModal} />
      )}
    </ComposedModal>
  );
}

export default TemplateConfigModal;
