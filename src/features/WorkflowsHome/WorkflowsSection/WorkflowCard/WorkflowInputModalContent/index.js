import React, { Component } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import "./styles.scss";

class WorkflowInputModalContent extends Component {
  static propTypes = {
    inputs: PropTypes.array.isRequired,
    executeWorkflows: PropTypes.func.isRequired
  };

  state = {
    inputs: this.props.inputs
  };

  handleBooleanChange = index => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: !inputs[index].value } } });
    this.setState({ inputs: newInputs });
  };

  handleTextChange = (value, index) => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: value } } });
    this.setState({ inputs: newInputs });
  };

  handleSelectChange = (value, index) => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: value.map(option => option.value) } } });
    this.setState({ inputs: newInputs });
  };

  renderInput = (input, index) => {
    const { type, value, label } = input;
    const textType = type === "textInput" || type === "textAreaBox" ? "text" : type;
    const options = typeof value === "object" ? value.map(option => ({ label: option, value: option })) : [];

    switch (type) {
      case "boolean":
        return (
          <div className="b-workflow-inputs-modal-toggle">
            <div className="b-workflow-inputs-modal-toggle__title">Value</div>
            <Toggle
              id={label}
              onChange={() => this.handleBooleanChange(index)}
              defaultChecked={value || false}
              theme="bmrg-white"
            />
          </div>
        );
      case "select":
        return (
          <div className="b-workflow-inputs-modal-select">
            <SelectDropdown
              onChange={value => this.handleSelectChange(value, index)}
              options={options}
              value={options}
              theme="bmrg-white"
              title={label}
              multi
              isCreatable
            />
          </div>
        );
      default:
        return (
          <div className="b-workflow-inputs-modal-text-input">
            <TextInput
              title={label}
              placeholder={label}
              name={label}
              type={textType}
              onChange={value => this.handleTextChange(value, index)}
              detail={value || ""}
              theme="bmrg-white"
            />
          </div>
        );
    }
  };

  render() {
    const { executeWorkflow, closeModal } = this.props;
    return (
      <>
        <Body className="b-workflow-inputs-modal-body">
          {this.state.inputs.map((input, index) => this.renderInput(input, index))}
        </Body>
        <Footer className="b-workflow-inputs-modal-footer">
          <ConfirmButton
            style={{ width: "40%" }}
            text={"EXECUTE"}
            onClick={() => {
              executeWorkflow(false);
              closeModal();
            }}
            theme="bmrg-white"
          />
          <ConfirmButton
            style={{ width: "40%" }}
            text={"EXECUTE AND VIEW"}
            onClick={() => {
              executeWorkflow(true);
              closeModal();
            }}
            theme="bmrg-white"
          />
        </Footer>
      </>
    );
  }
}

export default WorkflowInputModalContent;
