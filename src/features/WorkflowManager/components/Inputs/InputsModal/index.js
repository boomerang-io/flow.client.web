import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import InputsModalContent from "./InputsModalContent";
import "./styles.scss";

class InputsModal extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    Button: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    inputsKeys: PropTypes.array,
    input: PropTypes.object,
    updateInputs: PropTypes.func.isRequired
  };

  render() {
    const { isEdit, Button, input, loading } = this.props;

    return (
      <ModalWrapper
        className="c-inputs-modal"
        modalProps={{ shouldCloseOnOverlayClick: false }}
        ModalTrigger={() => <Button />}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            className="c-inputs-modal-content"
            headerTitle={isEdit && input ? input.label.toUpperCase() : "CREATE PROPERTY"}
            headerSubtitle={isEdit ? "Let's update it" : "Create new input property"}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal, theme: "bmrg-white" }}
            theme="bmrg-white"
            {...rest}
          >
            <InputsModalContent updateInputs={this.props.updateInputs} loading={loading} />
          </ModalFlow>
        )}
        {...this.props}
      />
    );
  }
}

export default InputsModal;
