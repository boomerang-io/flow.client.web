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
    error: false,
    hasUpdated: false,
    inputs: this.props.inputs
  };

  componentDidMount() {
    this.validate();
  }

  handleBooleanChange = index => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: !inputs[index].value } } });
    this.setState({ inputs: newInputs, hasUpdated: true });
  };

  handleTextChange = (value, index) => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: value } } });
    this.setState({ inputs: newInputs, hasUpdated: true }, () => this.validate());
  };

  handleSelectChange = (value, index) => {
    const { inputs } = this.state;
    const newInputs = update(inputs, { [index]: { value: { $set: value.map(option => option.value) } } });
    this.setState({ inputs: newInputs, hasUpdated: true }, () => this.validate());
  };
  handleExecute = redirect => {
    const { executeWorkflow, closeModal } = this.props;

    let inputProps = this.state.inputs.map(input => {
      let inputObject = {};
      inputObject[input.key] = input.value;
      return inputObject;
    });

    if (this.state.hasUpdated) executeWorkflow(redirect, inputProps);
    else executeWorkflow(redirect);
    closeModal();
  };

  validate = () => {
    const errorInput = this.state.inputs.find(
      input => input.isRequired && (input.value === undefined || input.value === null || input.value.length < 1)
    );
    if (errorInput) {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });
    }
  };

  renderInput = (input, index) => {
    const { type, value, label, isRequired } = input;
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
            {isRequired && <div className="s-workflow-inputs-modal-is-required">*</div>}
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
            {isRequired && <div className="s-workflow-inputs-modal-is-required">*</div>}
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
    const { error } = this.state;

    return (
      <>
        <Body className="b-workflow-inputs-modal-body">
          {this.state.inputs.map((input, index) => this.renderInput(input, index))}
        </Body>
        <Footer className="b-workflow-inputs-modal-footer">
          <ConfirmButton
            style={{ width: "40%" }}
            text={"EXECUTE"}
            disabled={error}
            onClick={() => {
              this.handleExecute(false);
            }}
            theme="bmrg-white"
          />
          <ConfirmButton
            style={{ width: "40%" }}
            text={"EXECUTE AND VIEW"}
            disabled={error}
            onClick={() => {
              this.handleExecute(true);
            }}
            theme="bmrg-white"
          />
        </Footer>
      </>
    );
  }
}

export default WorkflowInputModalContent;
