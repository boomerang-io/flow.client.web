import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import INPUT_TYPES from "Constants/workflowInputTypes";
import "./styles.scss";

class WorkflowInputModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    executeWorkflow: PropTypes.func.isRequired,
    inputxfs: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const inputs = {};
    props.inputs.forEach(input => {
      inputs[input.key] = input.defaultValue;
    });

    this.state = {
      inputs,
      error: false,
      errors: {}
    };
  }

  componentDidMount() {
    this.validate();
  }

  handleBooleanChange = (checked, key) => {
    this.setState(prevState => ({ inputs: { ...prevState.inputs, [key]: checked } }), () => this.validate());
  };

  handleTextChange = (value, errors, key) => {
    this.setState(
      prevState => ({ inputs: { ...prevState.inputs, [key]: value }, errors: { ...prevState.errors, [key]: errors } }),
      () => this.validate()
    );
  };

  handleSelectChange = (option, key) => {
    this.setState(prevState => ({ inputs: { ...prevState.inputs, [key]: option.value } }), () => this.validate());
  };

  validate() {
    //Check for missing required fields
    if (this.props.inputs.some(input => input.required && !this.state.inputs[input.key])) {
      this.setState({ error: true });
      return;
    }

    //If there are no errors say so
    const errorKeys = Object.keys(this.state.errors);
    if (!errorKeys.length) {
      this.setState({ error: false });
      return;
    }

    //Look through all of the keys and see if there are errors present
    //Keys will still be present with a value of an empty object for inputs that have been changed
    let hasError = false;
    errorKeys.forEach(errorKey => {
      if (Object.keys(this.state.errors[errorKey]).length) {
        hasError = true;
      }
    });

    if (hasError) {
      this.setState({ error: true });
      return;
    }

    // return no errors if we get here
    this.setState({ error: false });
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
              onChange={(checked, event, id) => this.handleBooleanChange(checked, key)}
              defaultChecked={defaultValue === "true" || false}
              theme="bmrg-flow"
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
                theme="bmrg-flow"
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
              theme="bmrg-flow"
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
              theme="bmrg-flow"
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
        <ModalBody className="b-workflow-inputs-modal-body">{this.props.inputs.map(this.renderInput)}</ModalBody>
        <ModalFooter className="b-workflow-inputs-modal-footer">
          <Button
            type="submit"
            style={{ width: "40%" }}
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: false,
                properties: this.state.inputs
              });
              closeModal();
            }}
          >
            RUN
          </Button>
          <Button
            type="submit"
            style={{ width: "40%" }}
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: true,
                properties: this.state.inputs
              });
              closeModal();
            }}
          >
            RUN & VIEW
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default WorkflowInputModalContent;
