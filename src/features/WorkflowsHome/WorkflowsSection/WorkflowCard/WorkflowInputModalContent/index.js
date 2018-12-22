import React, { Component } from "react";
import PropTypes from "prop-types";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import INPUT_TYPES from "Constants/workflowInputTypes";
import "./styles.scss";

class WorkflowInputModalContent extends Component {
  static propTypes = {
    inputs: PropTypes.array.isRequired,
    executeWorkflow: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const inputs = {};
    props.inputs.forEach(input => {
      inputs[input.key] = input.value;
    });

    this.state = {
      inputs,
      error: false
    };
  }

  componentDidMount() {
    this.validate();
  }

  handleBooleanChange = (e, key) => {
    const checked = e.target.checked;
    this.setState(prevState => ({ inputs: { ...prevState.inputs, [key]: checked } }), () => this.validate());
  };

  handleTextChange = (value, errors, key) => {
    this.setState(prevState => ({ inputs: { ...prevState.inputs, [key]: value } }), () => this.validate());
  };

  handleSelectChange = (option, key) => {
    this.setState(prevState => ({ inputs: { ...prevState.inputs, [key]: option.value } }), () => this.validate());
  };

  validate() {
    const errorInput = this.props.inputs.some(
      input =>
        input.required &&
        (this.state.inputs[input.key] === undefined ||
          this.state.inputs[input.key] === null ||
          (this.state.inputs[input.key] === "string" && this.state.inputs[input.key].length === 0))
    );
    this.setState({ error: errorInput });
  }

  renderInput = input => {
    const { key, type, defaultValue, label, required, validValues } = input;

    switch (type) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <div className="b-workflow-inputs-modal-toggle">
            {required && <div className="s-workflow-inputs-modal-is-required">*</div>}
            <div className="b-workflow-inputs-modal-toggle__title">Value</div>
            <Toggle
              id={key}
              onChange={e => this.handleBooleanChange(e, key)}
              defaultChecked={defaultValue === "true" || false}
              theme="bmrg-white"
            />
          </div>
        );
      case INPUT_TYPES.SELECT:
        return (
          Array.isArray(validValues) && (
            <div className="b-workflow-inputs-modal-select">
              {required && <div className="b-workflow-inputs-modal-select__required">*</div>}
              <SelectDropdown
                onChange={option => this.handleSelectChange(option, key)}
                options={validValues.map(value => ({
                  label: value,
                  value: value
                }))}
                value={
                  this.state.inputs[key]
                    ? { label: this.state.inputs[key], value: this.state.inputs[key] }
                    : defaultValue
                }
                theme="bmrg-white"
                title={label}
                id={key}
                name={key}
              />
            </div>
          )
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <div className="b-inputs-modal-text-area">
            <TextArea
              alwaysShowTitle
              title="Default Value"
              placeholder="Default Value"
              name={key}
              onChange={this.handleTextChange}
              value={defaultValue || ""}
              theme="bmrg-white"
              noValueText={`Enter a ${label}`}
              required={required}
            />
          </div>
        );
      default:
        return (
          <div className="b-workflow-inputs-modal-text-input">
            {required && <div className="s-workflow-inputs-modal-is-required">*</div>}
            <TextInput
              alwaysShowTitle
              title={label}
              placeholder={label}
              name={key}
              type={type}
              onChange={this.handleTextChange}
              value={defaultValue || ""}
              theme="bmrg-white"
              noValueText={`Enter a ${label}`}
              required={required}
            />
          </div>
        );
    }
  };

  render() {
    const { executeWorkflow, closeModal } = this.props;
    const { error } = this.state;

    return (
      <form>
        <Body className="b-workflow-inputs-modal-body">{this.props.inputs.map(this.renderInput)}</Body>
        <Footer className="b-workflow-inputs-modal-footer">
          <ConfirmButton
            type="submit"
            style={{ width: "40%" }}
            text={"EXECUTE"}
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: false,
                properties: this.state.inputs
              });
              closeModal();
            }}
            theme="bmrg-white"
          />
          <ConfirmButton
            type="submit"
            style={{ width: "40%" }}
            text={"EXECUTE AND VIEW"}
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: true,
                properties: this.state.inputs
              });
              closeModal();
            }}
            theme="bmrg-white"
          />
        </Footer>
      </form>
    );
  }
}

export default WorkflowInputModalContent;
