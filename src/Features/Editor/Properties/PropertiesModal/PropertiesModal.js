import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang-io/carbon-addons-boomerang-react";
import PropertiesModalContent from "./PropertiesModalContent";
import WorkflowEditButton from "Components/WorkflowEditButton";
import { Add32 } from "@carbon/icons-react";
import styles from "./PropertiesModal.module.scss";

class PropertiesModal extends Component {
  static propTypes = {
    property: PropTypes.object,
    propertyKeys: PropTypes.array,
    isEdit: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    updateWorkflowProperties: PropTypes.func.isRequired,
  };

  editTrigger = ({ openModal }) => {
    let output = null;
    this.props.isEdit
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

  render() {
    const { isEdit, loading } = this.props;

    return (
      <ModalFlow
        modalHeaderProps={{
          title: isEdit ? "Update Property" : "Create Property",
          subtitle: isEdit ? "Let's change some stuff" : "Let's create a new one",
        }}
        modalTrigger={this.editTrigger}
      >
        <PropertiesModalContent
          loading={loading}
          updateWorkflowProperties={this.props.updateWorkflowProperties}
          {...this.props}
        />
      </ModalFlow>
    );
  }
}

export default PropertiesModal;
