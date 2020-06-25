import React from "react";
import PropTypes from "prop-types";
import { ComposedModal, Button, TooltipHover } from "@boomerang/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import { Add16, Edit16 } from "@carbon/icons-react";
// import styles from "./TemplateConfigModal.module.scss";

TemplateConfigModal.propTypes = {
  field: PropTypes.object,
  isEdit: PropTypes.bool,
  templateFields: PropTypes.array,
  fieldKeys: PropTypes.array,
};

export function TemplateConfigModal(props) {
  const { isEdit, oldVersion, isActive } = props;
  const editTrigger = ({ openModal }) => {
    let output = null;
    isEdit
      ? (output = (
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
        ))
      : (output = (
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
        ));
    return output;
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
      {({ closeModal, forceCloseModal }) => (
        <TemplateConfigModalContent {...props} closeModal={closeModal} forceCloseModal={forceCloseModal} />
      )}
    </ComposedModal>
  );
}

export default TemplateConfigModal;
