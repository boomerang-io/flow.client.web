import React from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Button } from "carbon-components-react";
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
            iconDescription="Create Property"
            renderIcon={Add16}
            style={{ width: "12rem" }}
            size="field"
            onClick={openModal}
          >
            Create Property
          </Button>
        ) : null
      }
      modalHeaderProps={{
        title: isEdit && property ? `Edit ${property.label}` : "Create Property",
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
