import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalWrapper from "@boomerang/boomerang-components/lib/Modal";
import ModalFlow from "@boomerang/boomerang-components/lib/ModalFlow";
import InputsModalContent from "./InputsModalContent";

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
        ModalTrigger={() => <Button />}
        modalContent={(closeModal, rest) => (
          <ModalFlow
            headerTitle={isEdit ? input.name.toUpperCase() : "CREATE PROPERTY"}
            headerSubtitle={isEdit ? "Let's fix it" : "Create new input parameter"}
            components={[{ step: 0, component: InputsModalContent }]}
            closeModal={closeModal}
            confirmModalProps={{ affirmativeAction: closeModal }}
            theme="bmrg-white"
            {...rest}
          />
        )}
        {...this.props}
      />
    );
  }
}

export default InputsModal;
