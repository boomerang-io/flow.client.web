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
    inputsNames: PropTypes.array,
    input: PropTypes.object
  };

  render() {
    const { isEdit, Button, input } = this.props;

    return (
      <ModalWrapper
        className="c-inputs-modal"
        ModalTrigger={() => <Button />}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            className="c-inputs-modal-content"
            headerTitle={isEdit && input ? input.label.toUpperCase() : "CREATE PROPERTY"}
            headerSubtitle={isEdit ? "Let's fix it" : "Create new input parameter"}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal }}
            theme="bmrg-white"
            {...rest}
          >
            <InputsModalContent />
          </ModalFlow>
        )}
        {...this.props}
      />
    );
  }
}

export default InputsModal;
