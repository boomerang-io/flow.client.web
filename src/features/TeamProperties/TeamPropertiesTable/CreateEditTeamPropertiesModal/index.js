import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Button } from "carbon-components-react";
import CreateEditTeamPropertiesModalContent from "./CreateEditTeamPropertiesModalContent";
import { Add16 } from "@carbon/icons-react";

class CreateEditTeamPropertiesModal extends Component {
  static propTypes = {
    addTeamPropertyInStore: PropTypes.func.isRequired,
    handleEditClose: PropTypes.func,
    property: PropTypes.object,
    properties: PropTypes.array.isRequired,
    isEdit: PropTypes.bool,
    isOpen: PropTypes.bool,
    team: PropTypes.string.isRequired,
    updateTeamProperty: PropTypes.func.isRequired
  };

  render() {
    const {
      addTeamPropertyInStore,
      property,
      properties,
      handleEditClose,
      isEdit,
      isOpen,
      team,
      updateTeamProperty
    } = this.props;

    /**
     * arrays of values for making the key unique
     * filter out own value if editing a property, pass through all if creating
     */
    let propertyKeys = [];
    if (Array.isArray(properties)) {
      propertyKeys = properties.map(configurationObj => configurationObj.key);
      if (isEdit && property) {
        propertyKeys = propertyKeys.filter(propertyItem => propertyItem !== property.key);
      }
    }

    return (
      <ModalFlow
        isOpen={isOpen}
        modalProps={{ shouldCloseOnOverlayClick: false }}
        modalTrigger={({ openModal }) =>
          !isEdit ? (
            <Button
              onClick={openModal}
              iconDescription="Create Property"
              renderIcon={Add16}
              size="field"
              style={{ minWidth: "9rem" }}
            >
              Create Property
            </Button>
          ) : null
        }
        modalHeaderProps={{
          title: isEdit && property ? `Edit ${property.label.toUpperCase()}` : "Create Property"
        }}
        confirmModalProps={{
          title: "Close this?",
          children: "Your property will not be saved"
        }}
        onCloseModal={isEdit ? handleEditClose : () => {}}
      >
        <CreateEditTeamPropertiesModalContent
          addTeamPropertyInStore={addTeamPropertyInStore}
          isEdit={isEdit}
          property={property}
          propertyKeys={propertyKeys}
          updateTeamProperty={updateTeamProperty}
          team={team}
        />
      </ModalFlow>
    );
  }
}

export default CreateEditTeamPropertiesModal;
