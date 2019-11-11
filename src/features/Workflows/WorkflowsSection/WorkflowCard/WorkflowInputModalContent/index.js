import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, ModalBody, ModalFooter, TextInput, TextArea, Toggle } from "carbon-components-react";
import { ModalFlowForm } from "@boomerang/carbon-addons-boomerang-react";
import { ComboBox } from "@boomerang/carbon-addons-boomerang-react";
import INPUT_TYPES from "Constants/workflowInputTypes";
import styles from "./workflowInputModalContent.module.scss";
//TODO: needs to be refactored to use data driven inputs and formik if possible
class WorkflowInputModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    executeWorkflow: PropTypes.func.isRequired,
    inputs: PropTypes.array.isRequired
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
    if (
      this.props.inputs.some(
        input => input.required && !this.state.inputs[input.key] && input.type !== INPUT_TYPES.BOOLEAN
      )
    ) {
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
    const { key, type, defaultValue, label, required, options } = input;

    switch (type) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <div className={styles.toggle}>
            <div className={styles.toggleTitle}>Value</div>
            <Toggle
              id={key}
              onChange={e => this.handleBooleanChange(e.target.checked, key)}
              defaultChecked={defaultValue === "true" || false}
            />
          </div>
        );
      case INPUT_TYPES.SELECT:
        return (
          Array.isArray(options) && (
            <div className={styles.select}>
              <ComboBox
                id={key}
                items={options.map(value => ({
                  label: value,
                  value: value
                }))}
                titleText={label}
                onChange={({ selectedItem }) =>
                  this.handleSelectChange(selectedItem ? selectedItem : { label: null, value: null }, key)
                }
                initialSelectedItem={{ label: defaultValue, value: defaultValue }}
                placeholder="Select an item"
              />
            </div>
          )
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <div className={styles.textArea}>
            <TextArea
              labelText="Default Value"
              placeholder="Default Value"
              id={key}
              onChange={e => this.handleTextChange(e.target.value, e.target.value.length === 0, key)}
              value={this.state.inputs[key]}
              defaultValue={defaultValue || ""}
              invalidText={`Enter a ${label}`}
              required={required}
            />
          </div>
        );
      default:
        return (
          <div className={styles.textInput}>
            <TextInput
              labelText={label}
              placeholder={label}
              id={key}
              type={type}
              onChange={e => this.handleTextChange(e.target.value, e.target.value.length === 0, key)}
              value={this.state.inputs[key]}
              defaultValue={defaultValue || ""}
              invalidText={`Enter a ${label}`}
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
      <ModalFlowForm>
        <ModalBody className={styles.container}>{this.props.inputs.map(this.renderInput)}</ModalBody>
        <ModalFooter>
          <Button disabled={error} kind="secondary" onClick={closeModal} type="button">
            Cancel
          </Button>
          <Button
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: false,
                properties: this.state.inputs
              });
              closeModal();
            }}
            type="button"
          >
            Run
          </Button>
          <Button
            disabled={error}
            onClick={e => {
              e.preventDefault();
              executeWorkflow({
                redirect: true,
                properties: this.state.inputs
              });
              closeModal();
            }}
            type="button"
          >
            Run and View
          </Button>
        </ModalFooter>
      </ModalFlowForm>
    );
  }
}

export default WorkflowInputModalContent;
