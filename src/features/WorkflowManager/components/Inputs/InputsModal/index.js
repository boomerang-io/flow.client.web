import React, { Component } from "react";
import PropTypes from "prop-types";
import { ModalFlow } from "@boomerang/carbon-addons-boomerang-react";
import { Add32, Edit32 } from "@carbon/icons-react";
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
            <button className="b-workflow-input-create__plus" onClick={openModal}>
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
          title: "Close this?",
          children: <div>Your input will not be saved</div>
        }}
        modalTrigger={this.editTrigger}
        modalHeaderProps={{
          title: isEdit && input ? input.label : "Create Property",
          subTitle: isEdit ? "Let's update it" : "Create new input property"
        }}
      >
        <InputsModalContent updateInputs={this.props.updateInputs} loading={loading} {...this.props} />
      </ModalFlow>
    );
  }
}

export default InputsModal;
