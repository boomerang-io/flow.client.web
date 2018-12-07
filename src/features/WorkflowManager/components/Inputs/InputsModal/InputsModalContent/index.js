import React, { Component } from "react";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import { default as Body } from "@boomerang/boomerang-components/lib/ModalContentBody";
import { default as ConfirmButton } from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import { default as Footer } from "@boomerang/boomerang-components/lib/ModalContentFooter";

import "./styles.scss";

class InputsModalContent extends Component {
  state = {
    name: this.props.input ? this.props.input.name : "",
    description: this.props.input ? this.props.input.description : "",
    label: this.props.input ? this.props.input.label : "",
    required: this.props.input ? this.props.input.required : false,
    type: this.props.input ? this.props.input.type : "textInput",
    defaultValue: this.props.input ? this.props.input.defaultValue : undefined,
    nameError: "",
    descriptionError: "",
    labelError: ""
  };

  handleNameChange = (value, error) => {
    this.setState({ name: value, nameError: error.name });
  };

  handleDescriptionChange = (value, error) => {
    this.setState({ description: value, descriptionError: error.description });
  };

  handleLabelChange = (value, error) => {
    this.setState({ label: value, labelError: error.label });
  };

  handleRequiredChange = () => {
    this.setState(prevState => ({ required: !prevState.required }));
  };

  handleTypeChange = option => {
    this.setState({ type: option.value, defaultValue: option.value === "boolean" ? false : undefined });
  };

  handleDefaultValueChange = value => {
    switch (this.state.type) {
      case "boolean":
        this.setState(prevState => ({ defaultValue: !prevState.defaultValue }));
        return;
      case "select":
        this.setState({ defaultValue: value.map(option => option.value) });
        return;
      default:
        this.setState({ defaultValue: value });
        return;
    }
  };

  /* Check if name contains space or special characters, only underline is allowed */
  validateName = name => {
    const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_]");
    return !regexp.test(name);
  };

  handleConfirm = () => {
    console.log(this.state);
  };

  renderDefaultValue = () => {
    const { type, defaultValue } = this.state;

    const textType = type === "textInput" || type === "textAreaBox" ? "text" : type;
    const defaultOptions =
      typeof defaultValue === "object" ? defaultValue.map(option => ({ label: option, value: option })) : [];

    switch (type) {
      case "boolean":
        return (
          <div className="b-inputs-modal-toggle">
            <div className="b-inputs-modal-toggle__title">Default Value</div>
            <Toggle
              id="input-default-value-toggle"
              onChange={this.handleDefaultValueChange}
              defaultChecked={defaultValue}
              theme="bmrg-white"
            />
          </div>
        );
      case "select":
        return (
          <div className="b-inputs-modal-select">
            <SelectDropdown
              onChange={this.handleDefaultValueChange}
              options={defaultOptions}
              value={defaultOptions}
              theme="bmrg-white"
              title="DEFAULT OPTIONS"
              multi
              isCreatable
            />
          </div>
        );
      default:
        return (
          <div className="b-inputs-modal-text-input">
            <TextInput
              title="Default Value"
              placeholder="Default Value"
              name="default value"
              type={textType}
              onChange={this.handleDefaultValueChange}
              detail={defaultValue || ""}
              theme="bmrg-white"
            />
          </div>
        );
    }
  };

  render() {
    const { isEdit, inputsNames } = this.props;
    const { name, description, label, required, type, nameError, descriptionError, labelError } = this.state;

    return (
      <>
        <Body className="c-inputs-modal-body">
          <TextInput
            title="Name"
            placeholder="Name"
            name="name"
            type="text"
            comparisonData={inputsNames || []}
            noValueText="Enter a name"
            existValueText="Property name already exist"
            onChange={this.handleNameChange}
            detail={name}
            validationFunction={this.validateName}
            validationText="Invalid name, space and special characters aren't allowed"
            theme="bmrg-white"
          />
          <TextInput
            title="Label"
            placeholder="Label"
            name="label"
            type="text"
            noValueText="Enter a label"
            onChange={this.handleLabelChange}
            detail={label}
            theme="bmrg-white"
          />
          <TextInput
            title="Description"
            placeholder="Description"
            name="description"
            type="text"
            noValueText="Enter a description"
            onChange={this.handleDescriptionChange}
            detail={description}
            theme="bmrg-white"
          />
          <div className="b-inputs-modal-toggle">
            <div className="b-inputs-modal-toggle__title">Required</div>
            <Toggle
              id="input-required-toggle"
              onChange={this.handleRequiredChange}
              defaultChecked={required}
              theme="bmrg-white"
            />
          </div>
          <div className="b-inputs-modal-type">
            <SelectDropdown
              onChange={this.handleTypeChange}
              options={[
                { label: "TextInput", value: "textInput" },
                { label: "TextAreaBox", value: "textAreaBox" },
                { label: "Boolean", value: "boolean" },
                { label: "Password", value: "password" },
                { label: "Number", value: "number" },
                { label: "Select", value: "select" }
              ]}
              value={type}
              theme="bmrg-white"
              title="TYPE"
              styles={{ width: "100%" }}
            />
          </div>
          {this.renderDefaultValue()}
        </Body>
        <Footer style={{ paddingTop: "1rem" }}>
          <ConfirmButton
            disabled={!(name && description && label) || (nameError || descriptionError || labelError)}
            text={isEdit ? "EDIT" : "CREATE"}
            onClick={this.handleConfirm}
            theme="bmrg-white"
          />
        </Footer>
      </>
    );
  }
}

export default InputsModalContent;
