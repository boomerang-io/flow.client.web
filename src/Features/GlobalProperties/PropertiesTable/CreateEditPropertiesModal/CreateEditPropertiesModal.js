import React from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditPropertiesContent from "./CreateEditPropertiesContent";
import { Add16 } from "@carbon/icons-react";
import styles from "./createEditPropertiesModal.module.scss";

function CreateEditPropertiesModal({ isEdit, isOpen, handleEditClose, property, properties }) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a property, pass through all if creating
   */
  let propertyKeys = [];
  if (Array.isArray(properties)) {
    propertyKeys = properties.map((propertyObj) => propertyObj.key);
    if (isEdit && property) {
      propertyKeys = propertyKeys.filter((propertyItem) => propertyItem !== property.key);
    }
  }
  const cancelRequestRef = React.useRef();

  return (
    <ModalFlow
      isOpen={isOpen}
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }) =>
        !isEdit ? (
          <Button
            data-testid="create-global-parameter-button"
            iconDescription="Create Parameter"
            renderIcon={Add16}
            style={{ width: "12rem" }}
            size="field"
            onClick={openModal}
          >
            Create Parameter
          </Button>
        ) : null
      }
      modalHeaderProps={{
        title: isEdit && property ? `Edit ${property.label}` : "Create Parameter",
      }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
        return handleEditClose ? handleEditClose() : null;
      }}
    >
      <CreateEditPropertiesContent
        isEdit={isEdit}
        property={property}
        propertyKeys={propertyKeys}
        cancelRequestRef={cancelRequestRef}
      />
    </ModalFlow>
  );
}

CreateEditPropertiesModal.propTypes = {
  isOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  property: PropTypes.object,
  properties: PropTypes.array,
  handleEditClose: PropTypes.func,
};

export default CreateEditPropertiesModal;
