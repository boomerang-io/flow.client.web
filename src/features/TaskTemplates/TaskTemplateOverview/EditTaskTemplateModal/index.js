import React from "react";
import PropTypes from "prop-types";
import { Button, ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import EditTaskTemplateForm from "./EditTaskTemplateForm";
import { Edit16 } from "@carbon/icons-react";

EditTaskTemplateModal.propTypes = {
  componentId: PropTypes.string.isRequired,
  componentModeId: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  updateComponentInState: PropTypes.func.isRequired,
  oldVersion: PropTypes.bool
};

function EditTaskTemplateModal({ taskTemplates, setFieldValue, values, oldVersion, isActive }) {

  const handleEditTaskTemplateModal = async ({newValues}) => {
    setFieldValue("name", newValues.name);
    setFieldValue("description", newValues.description);
    setFieldValue("category", newValues.category);
    setFieldValue("image", newValues.icon);
  };

  return (
    <ModalFlow
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved"
      }}
      modalTrigger={({ openModal }) => (
        <Button renderIcon={Edit16} disabled={oldVersion || !isActive} kind="ghost" size="field" onClick={openModal}/>
      )}
      modalHeaderProps={{
        title: "Edit the basics"
      }}
    >
      <EditTaskTemplateForm  handleEditTaskTemplateModal={handleEditTaskTemplateModal} taskTemplates={taskTemplates} templateData={values}/>
    </ModalFlow>
  );
}

export default EditTaskTemplateModal;
