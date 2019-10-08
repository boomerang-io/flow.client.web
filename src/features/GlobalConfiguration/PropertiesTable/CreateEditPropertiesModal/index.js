import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Button } from "carbon-components-react";
import CreateEditPropertiesContent from "./CreateEditPropertiesContent";
import { Add16 } from "@carbon/icons-react";

class CreateEditPropertiesModal extends Component {
  static propTypes = {
    addPropertyInStore: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    isEdit: PropTypes.bool,
    property: PropTypes.object,
    properties: PropTypes.array,
    handleEditClose: PropTypes.func,
    updatePropertyInStore: PropTypes.func.isRequired
  };

  render() {
    const {
      addPropertyInStore,
      isEdit,
      isOpen,
      handleEditClose,
      property,
      properties,
      updatePropertyInStore
    } = this.props;

    /**
     * arrays of values for making the key unique
     * filter out own value if editing a property, pass through all if creating
     */
    let propertyKeys = [];
    if (Array.isArray(properties)) {
      propertyKeys = properties.map(propertyObj => propertyObj.key);
      if (isEdit && property) {
        propertyKeys = propertyKeys.filter(propertyItem => propertyItem !== property.key);
      }
    }

    return (
      <ModalFlow
        isOpen={isOpen}
        modalTrigger={({ openModal }) =>
          !isEdit ? (
            <Button
              iconDescription="Create Property"
              renderIcon={Add16}
              style={{ width: "12rem" }}
              size="field"
              onClick={openModal}
              data-testid="create-global-configurations-property-button"
            >
              Create Property
            </Button>
          ) : null
        }
        modalHeaderProps={{
          title: isEdit && property ? `Edit ${property.label}` : "Create Property"
        }}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your property will not be saved",
          affirmativeAction: isEdit ? handleEditClose : null
        }}
      >
        <CreateEditPropertiesContent
          addPropertyInStore={addPropertyInStore}
          handleEditClose={handleEditClose}
          isEdit={isEdit}
          property={property}
          propertyKeys={propertyKeys}
          updatePropertyInStore={updatePropertyInStore}
        />
      </ModalFlow>
    );
  }
}

export default CreateEditPropertiesModal;
