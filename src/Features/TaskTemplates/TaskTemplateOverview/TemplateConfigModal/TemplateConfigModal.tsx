
import React from "react";
import { ComposedModal, Button, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import { Add16, Edit16 } from "@carbon/icons-react";
import { ComposedModalChildProps, DataDrivenInput, ModalTriggerProps } from "Types";
 // import styles from "./TemplateConfigModal.module.scss";

interface TemplateConfigModal {
  field: DataDrivenInput
  fieldKeys: string[],
  isActive: boolean,
  isEdit: boolean,
  isOldVersion: boolean
  setFieldValue: (key: string, value: any) => void;
  templateFields: DataDrivenInput[],
};

 const TemplateConfigModal: React.FC<TemplateConfigModal> = (props) => {
  const { isEdit, isOldVersion, isActive } = props;
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
              disabled={isOldVersion || !isActive}
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
              disabled={isOldVersion || !isActive}
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
        <TemplateConfigModalContent field={props.field} fieldKeys={props.fieldKeys} isEdit={props.isEdit} templateFields={props.templateFields} closeModal={closeModal} forceCloseModal={forceCloseModal} setFieldValue={props.setFieldValue}/>
      )}
    </ComposedModal>
  );
}

export default TemplateConfigModal;
