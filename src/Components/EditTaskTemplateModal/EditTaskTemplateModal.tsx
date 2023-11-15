//@ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import { Button, ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import EditTaskTemplateForm from "./EditTaskTemplateForm";
import { Edit16 } from "@carbon/icons-react";
import styles from "./editTaskTemplateModal.module.scss";

EditTaskTemplateModal.propTypes = {
  canEdit: PropTypes.bool,
  isActive: PropTypes.bool,
  nodeType: PropTypes.string.isRequired,
  isOldVersion: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
  taskTemplates: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};

function EditTaskTemplateModal({ isActive, nodeType, isOldVersion, setFieldValue, taskTemplates, values, canEdit }) {
  const handleEditTaskTemplateModal = async ({ newValues }) => {
    let newEnvs = newValues.envs.map((env) => {
      let index = env.indexOf(":");
      return { name: env.substring(0, index), value: env.substring(index + 1, env.length) };
    });
    setFieldValue("name", newValues.name);
    setFieldValue("description", newValues.description);
    setFieldValue("category", newValues.category);
    setFieldValue("arguments", newValues.arguments);
    setFieldValue("command", newValues.command);
    setFieldValue("image", newValues.image);
    setFieldValue("icon", newValues.icon.value);
    setFieldValue("envs", newEnvs);
    setFieldValue("script", newValues.script);
    setFieldValue("workingDir", newValues.workingDir);
    setFieldValue("serviceAccountName", newValues.serviceAccountName);
    setFieldValue("securityContext", newValues.securityContext);
  };
  return (
    <ComposedModal
      composedModalProps={{ containerClassName: styles.modalContainer }}
      confirmModalProps={{
        title: "Close this?",
        children: "Your request will not be saved",
      }}
      modalTrigger={({ openModal }) => (
        <Button
          renderIcon={Edit16}
          iconDescription="edit-template"
          disabled={isOldVersion || !isActive || !canEdit}
          kind="ghost"
          size="field"
          onClick={openModal}
        />
      )}
      modalHeaderProps={{
        title: "Edit the basics",
      }}
    >
      {({ closeModal }) => (
        <EditTaskTemplateForm
          closeModal={closeModal}
          handleEditTaskTemplateModal={handleEditTaskTemplateModal}
          nodeType={nodeType}
          taskTemplates={taskTemplates}
          templateData={values}
        />
      )}
    </ComposedModal>
  );
}

export default EditTaskTemplateModal;
