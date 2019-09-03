import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
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
      <ModalWrapper
        isOpen={isOpen}
        modalProps={{ shouldCloseOnOverlayClick: false }}
        ModalTrigger={() =>
          !isEdit ? (
            <Button iconDescription="Create Property" renderIcon={Add16} size="field">
              Create Property
            </Button>
          ) : null
        }
        modalContent={closeModal => (
          <ModalFlow
            headerTitle={isEdit && property ? `EDIT ${property.label.toUpperCase()}` : "CREATE PROPERTY"}
            closeModal={isEdit ? handleEditClose : closeModal}
            confirmModalProps={{
              affirmativeAction: isEdit ? handleEditClose : closeModal,
              subTitleTop: "Your property will not be saved",
              theme: "bmrg-flow"
            }}
            theme="bmrg-flow"
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
        )}
      />
    );
  }
}

export default CreateEditPropertiesModal;
