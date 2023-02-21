//@ts-nocheck
import React from "react";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button } from "@carbon/react";
import CreateEditPropertiesContent from "./CreateEditPropertiesContent";
import { Add } from "@carbon/react/icons";
import { Property } from "Types";
import styles from "./createEditPropertiesModal.module.scss";

type Props = {
  handleEditClose?: () => void;
  isEdit?: boolean;
  isOpen?: boolean;
  property?: Property;
  properties: Property[];
};

function CreateEditPropertiesModal({ isEdit, isOpen, handleEditClose, property, properties }: Props) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a property, pass through all if creating
   */
  let propertyKeys: string[] | [] = [];
  if (Array.isArray(properties)) {
    propertyKeys = properties.map((propertyObj) => propertyObj.key);
    if (isEdit && property) {
      propertyKeys = propertyKeys.filter((propertyItem) => propertyItem !== property.key);
    }
  }
  const cancelRequestRef = React.useRef<any>();

  return (
    <ModalFlow
      isOpen={isOpen}
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalTrigger={({ openModal }: { openModal: () => void }) =>
        !isEdit ? (
          <Button
            data-testid="create-global-parameter-button"
            iconDescription="Create Parameter"
            renderIcon={Add}
            style={{ width: "12rem" }}
            size="md"
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

export default CreateEditPropertiesModal;
