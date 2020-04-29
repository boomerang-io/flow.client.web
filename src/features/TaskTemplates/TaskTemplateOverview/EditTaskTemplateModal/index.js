import React from "react";
import PropTypes from "prop-types";
import { Button, ComposedModal } from "@boomerang/carbon-addons-boomerang-react";
import EditTaskTemplateForm from "./EditTaskTemplateForm";
import { Edit16 } from "@carbon/icons-react";

EditTaskTemplateModal.propTypes = {
  taskTemplates: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  oldVersion: PropTypes.bool,
  isActive: PropTypes.bool
};

function EditTaskTemplateModal({ taskTemplates, setFieldValue, values, oldVersion, isActive }) {
  const handleEditTaskTemplateModal = async ({ newValues }) => {
    setFieldValue("name", newValues.name);
    setFieldValue("description", newValues.description);
    setFieldValue("category", newValues.category);
    setFieldValue("arguments", newValues.arguments);
    setFieldValue("command", newValues.command);
    setFieldValue("image", newValues.image);
    setFieldValue("icon", newValues.icon.value);
  };
  return (
    <ComposedModal
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved"
      }}
      composedModalProps={{ shouldCloseOnOverlayClick: false }}
      modalTrigger={({ openModal }) => (
        <Button
          renderIcon={Edit16}
          iconDescription="edit-template"
          disabled={oldVersion || !isActive}
          kind="ghost"
          size="field"
          onClick={openModal}
        />
      )}
      modalHeaderProps={{
        title: "Edit the basics"
      }}
    >
      {({ closeModal }) => (
        <EditTaskTemplateForm
          handleEditTaskTemplateModal={handleEditTaskTemplateModal}
          taskTemplates={taskTemplates}
          templateData={values}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
}

export default EditTaskTemplateModal;
