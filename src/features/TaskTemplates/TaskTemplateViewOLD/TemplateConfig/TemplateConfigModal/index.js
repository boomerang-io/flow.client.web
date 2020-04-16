import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import WorkflowEditButton from "Components/WorkflowEditButton";
import { Add32 } from "@carbon/icons-react";
import styles from "./TemplateConfigModal.module.scss";

class TemplateConfigModal extends Component {
  static propTypes = {
    setting: PropTypes.object,
    settingKeys: PropTypes.array,
    isEdit: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    updateTemplateConfigModal: PropTypes.func.isRequired,
    settings: PropTypes.array,
    setFieldValue: PropTypes.func.isRequired
  };

  editTrigger = ({ openModal }) => {
    let output = null;
    this.props.isEdit
      ? (output = <WorkflowEditButton className={styles.editContainer} onClick={openModal} aria-label="Edit" />)
      : (output = (
          <button
            className={styles.createConfigurationCard}
            onClick={openModal}
            data-testid="create-new-task-input-button"
          >
            <div className={styles.createContainer}>
              <Add32 className={styles.createIcon} aria-label="Add" />
              <p className={styles.createText}>Create a new setting</p>
            </div>
          </button>
        ));
    return output;
  };

  render() {
    const { isEdit, loading } = this.props;

    return (
      <ModalFlow
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your setting will not be saved"
        }}
        modalHeaderProps={{
          title: isEdit ? "Update Configuration" : "Create Configuration",
          subtitle: isEdit ? "Let's change some stuff" : "Let's create a new one"
        }}
        modalTrigger={this.editTrigger}
      >
        <TemplateConfigModalContent
          loading={loading}
          updateTemplateConfigModal={this.props.updateTemplateConfigModal}
          {...this.props}
        />
      </ModalFlow>
    );
  }
}

export default TemplateConfigModal;
