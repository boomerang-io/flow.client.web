//@ts-nocheck
import React from "react";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button } from "@carbon/react";
import CreateEditTeamPropertiesModalContent from "./CreateEditTeamPropertiesModalContent";
import { Add } from "@carbon/react/icons";
import { Property, FlowTeam } from "Types";
import styles from "./createEditTeamPropertiesModal.module.scss";

type Props = {
  handleEditClose?: () => void;
  isEdit?: boolean;
  isOpen?: boolean;
  property?: Property;
  properties: Property[];
  team: FlowTeam;
};

function CreateEditTeamPropertiesModal({ handleEditClose, isEdit, isOpen, property, properties, team }: Props) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a property, pass through all if creating
   */
  let propertyKeys: string[] | [] = [];
  if (Array.isArray(properties)) {
    propertyKeys = properties.map((configurationObj) => configurationObj.key);
    if (isEdit && property) {
      propertyKeys = propertyKeys.filter((propertyItem) => propertyItem !== property.key);
    }
  }
  const cancelRequestRef = React.useRef<any>();

  return (
    <ModalFlow
      isOpen={isOpen}
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalProps={{ shouldCloseOnOverlayClick: false }}
      modalTrigger={({ openModal }: { openModal: () => void }) =>
        !isEdit ? (
          <Button
            data-testid="create-team-parameter-button"
            onClick={openModal}
            iconDescription="Create Parameter"
            renderIcon={Add}
            size="md"
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

export default CreateEditTeamPropertiesModal;
