import React from "react";
import { ComposedModal } from "@boomerang-io/carbon-addons-boomerang-react";
import WorkflowEditButton from "./WorkflowEditButton";
import PropertiesModalContent from "./PropertiesModalContent";
import { Add } from "@carbon/react/icons";
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
  return (
    <ComposedModal
      modalHeaderProps={{
        title: props.isEdit ? "Update Parameter" : "Create Parameter",
        subtitle: props.isEdit ? "Let's change some stuff" : "Let's create a new one",
      }}
      modalTrigger={({ openModal }: ModalTriggerProps) => {
        return props.isEdit ? (
          <WorkflowEditButton
            aria-label="Edit"
            data-testid="edit-parameter-button"
            className={styles.editContainer}
            onClick={openModal}
          />
        ) : (
          <button className={styles.createPropertyCard} onClick={openModal} data-testid="create-parameter-button">
            <div className={styles.createContainer}>
              <Add className={styles.createIcon} aria-label="Add" size={32}/>
              <p className={styles.createText}>Create a new parameter</p>
            </div>
          </button>
        );
      }}
    >
      {({ closeModal }: ComposedModalChildProps) => {
        return <PropertiesModalContent closeModal={closeModal} {...props} />;
      }}
    </ComposedModal>
  );
};

export default PropertiesModal;
