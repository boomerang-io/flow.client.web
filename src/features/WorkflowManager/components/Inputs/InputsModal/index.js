import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Add32, Edit32 } from "@carbon/icons-react";
import InputsModalContent from "./InputsModalContent";

class InputsModal extends Component {
  static propTypes = {
    input: PropTypes.object,
    inputsKeys: PropTypes.array,
    isEdit: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    updateInputs: PropTypes.func.isRequired
  };

  editTrigger = ({ openModal }) => {
    let output = null;
    this.props.isEdit
      ? (output = (
          <button className="b-workflow-input-edit" onClick={openModal}>
            Edit
            <Edit32 className="b-workflow-input-edit__pencil" />
          </button>
        ))
      : (output = (
          <div className="b-workflow-input-create">
            <button
              className="b-workflow-input-create__plus"
              onClick={openModal}
              data-testid="create-new-workflow-input-button"
            >
              <Add32 className="b-workflow-input-create__plus-icon" />
            </button>
            Create New Property
          </div>
        ));
    return output;
  };

  render() {
    const { isEdit, input, loading } = this.props;

    return (
      <ModalFlow
        composedModalProps={{ containerClassName: "c-inputs-modal" }}
        confirmModalProps={{
          title: "Are you sure?",
          children: "Your property will not be saved"
        }}
        modalHeaderProps={{
          title: isEdit && input ? input.label : "Create Property",
          subtitle: isEdit ? "Let's update it" : "Let's create a new one"
        }}
        modalTrigger={this.editTrigger}
      >
        <InputsModalContent loading={loading} updateInputs={this.props.updateInputs} {...this.props} />
      </ModalFlow>
    );
  }
}

export default InputsModal;
