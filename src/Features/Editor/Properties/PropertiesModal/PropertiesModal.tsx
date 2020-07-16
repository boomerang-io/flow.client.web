import React from "react";
import { ModalComposed } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesModalContent from "./PropertiesModalContent";
import WorkflowEditButton from "Components/WorkflowEditButton";
import { Add32 } from "@carbon/icons-react";
import { ComposedModalChildProps, DataDrivenInput, ModalTriggerProps } from "Types";
import styles from "./PropertiesModal.module.scss";

interface PropertiesModalProps {
  isEdit: boolean;
  isLoading: boolean;
  property: DataDrivenInput;
  propertyKeys: Array<string>;
  updateWorkflowProperties: (args: { property: DataDrivenInput; type: string }) => Promise<any>;
}

const PropertiesModal: React.FC<PropertiesModalProps> = (props) => {
  const editTrigger = ({ openModal }: ModalTriggerProps) => {
    let output = null;
    props.isEdit
      ? (output = (
          <WorkflowEditButton
            className={styles.editContainer}
            onClick={openModal}
            aria-label="Edit"
            data-testid="edit-property-button"
          />
        ))
      : (output = (
          <button className={styles.createPropertyCard} onClick={openModal} data-testid="create-property-button">
            <div className={styles.createContainer}>
              <Add32 className={styles.createIcon} aria-label="Add" />
              <p className={styles.createText}>Create a new property</p>
            </div>
          </button>
        ));
    return output;
  };

  const { isEdit } = props;

  return (
    <ModalComposed
      modalHeaderProps={{
        title: isEdit ? "Update Property" : "Create Property",
        subtitle: isEdit ? "Let's change some stuff" : "Let's create a new one",
      }}
      modalTrigger={editTrigger}
    >
      {({ closeModal }: ComposedModalChildProps) => {
        return <PropertiesModalContent closeModal={closeModal} {...props} />;
      }}
    </ModalComposed>
  );
};

export default PropertiesModal;
