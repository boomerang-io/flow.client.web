import React from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateEditTeamPropertiesModalContent from "./CreateEditTeamPropertiesModalContent";
import { Add16 } from "@carbon/icons-react";
import styles from "./createEditTeamPropertiesModal.module.scss";

function CreateEditTeamPropertiesModal({ handleEditClose, isEdit, isOpen, property, properties, team }) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a property, pass through all if creating
   */
  let propertyKeys = [];
  if (Array.isArray(properties)) {
    propertyKeys = properties.map((configurationObj) => configurationObj.key);
    if (isEdit && property) {
      propertyKeys = propertyKeys.filter((propertyItem) => propertyItem !== property.key);
    }
  }
  const cancelRequestRef = React.useRef();

  return (
    <ModalFlow
      isOpen={isOpen}
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalProps={{ shouldCloseOnOverlayClick: false }}
      modalTrigger={({ openModal }) =>
        !isEdit ? (
          <Button
            data-testid="create-team-parameter-button"
            onClick={openModal}
            iconDescription="Create Parameter"
            renderIcon={Add16}
            size="field"
            style={{ minWidth: "9rem" }}
          >
            Create Parameter
          </Button>
        ) : null
      }
      modalHeaderProps={{
        title: isEdit && property ? `Edit ${property.label.toUpperCase()}` : "Create Parameter",
      }}
      onCloseModal={() => {
        if (cancelRequestRef.current) cancelRequestRef.current();
        if (isEdit) handleEditClose();
      }}
    >
      <CreateEditTeamPropertiesModalContent
        isEdit={isEdit}
        property={property}
        propertyKeys={propertyKeys}
        team={team}
        cancelRequestRef={cancelRequestRef}
      />
    </ModalFlow>
  );
}

CreateEditTeamPropertiesModal.propTypes = {
  handleEditClose: PropTypes.func,
  property: PropTypes.object,
  properties: PropTypes.array.isRequired,
  isEdit: PropTypes.bool,
  isOpen: PropTypes.bool,
  team: PropTypes.object.isRequired,
};

export default CreateEditTeamPropertiesModal;
