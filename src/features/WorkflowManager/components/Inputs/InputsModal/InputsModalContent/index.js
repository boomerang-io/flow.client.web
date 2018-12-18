import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import { default as Body } from "@boomerang/boomerang-components/lib/ModalContentBody";
import { default as ConfirmButton } from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import { default as Footer } from "@boomerang/boomerang-components/lib/ModalContentFooter";
import "./styles.scss";

const INPUT_TYPES = {
  BOOLEAN: "boolean",
  SELECT: "select",
  TEXT_AREA: "textarea",
  TEXT_INPUT: "text"
};

class InputsModalContent extends Component {
  state = {
    key: this.props.input ? this.props.input.key : "",
    description: this.props.input ? this.props.input.description : "",
    label: this.props.input ? this.props.input.label : "",
    required: this.props.input ? this.props.input.required : false,
    type: this.props.input ? this.props.input.type : "text",
    defaultValue: this.props.input ? this.props.input.defaultValue : undefined,
    keyError: "",
    descriptionError: "",
    labelError: ""
  };

  handleKeyChange = (value, error) => {
    this.setState({ key: value, keyError: error.key });
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

  /* Check if key contains space or special characters, only underline is allowed */
  validateKey = key => {
    const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_|/.]");
    return !regexp.test(key);
  };

  // dispatch Redux action to update store
  handleConfirm = () => {
    let inputProperties = { ...this.state };
    delete inputProperties.keyError;
    delete inputProperties.descriptionError;
    delete inputProperties.labelError;

    if (this.props.isEdit) {
      this.props.workflowActions.updateWorkflowInput(inputProperties);
    } else {
      this.props.workflowActions.createWorkflowInput(inputProperties);
    }

    this.props.closeModal();
  };

  renderDefaultValue = () => {
    const { type, defaultValue } = this.state;
    const defaultOptions =
      typeof defaultValue === "object" ? defaultValue.map(option => ({ label: option, value: option })) : [];

    switch (type) {
      case INPUT_TYPES.BOOLEAN:
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
      case INPUT_TYPES.SELECT:
        return (
          <div className="b-inputs-modal-select">
            <SelectDropdown
              multi
              isCreatable
              titleClass="b-inputs-modal-select__title"
              styles={{ width: "100%" }}
              onChange={this.handleDefaultValueChange}
              options={defaultOptions}
              value={defaultOptions}
              theme="bmrg-white"
              title="Default Options"
              placeholder="Enter option"
              noResultsText="No options entered"
            />
          </div>
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <div className="b-inputs-modal-text-area">
            <TextArea
              title="Default Value"
              placeholder="Default Value"
              name="default value"
              onChange={this.handleDefaultValueChange}
              value={defaultValue || ""}
              theme="bmrg-white"
              alwaysShowTitle
            />
          </div>
        );
      default:
        // Fallback to text input here because it covers text, password, and url
        return (
          <div className="b-inputs-modal-text-input">
            <TextInput
              title="Default Value"
              placeholder="Default Value"
              name="default value"
              type={type}
              onChange={this.handleDefaultValueChange}
              value={defaultValue || ""}
              theme="bmrg-white"
              alwaysShowTitle
            />
          </div>
        );
    }
  };

  render() {
    const { isEdit, inputsNames } = this.props;
    const { key, description, label, required, type, keyError, descriptionError, labelError } = this.state;

    return (
      <>
        <Body className="c-inputs-modal-body">
          <div className="c-inputs-modal-body-left">
            <TextInput
              disabled={isEdit}
              title="Key"
              placeholder="key.value"
              name="key"
              type="text"
              comparisonData={inputsNames || []}
              noValueText="Enter a key"
              existValueText="Property key already exist"
              onChange={this.handleKeyChange}
              value={key}
              validationFunction={this.validateKey}
              validationText="Invalid key, space and special characters aren't allowed"
              theme="bmrg-white"
              alwaysShowTitle
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
              alwaysShowTitle
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
              alwaysShowTitle
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
          </div>
          <div className="c-inputs-modal-body-right">
            <div className="b-inputs-modal-type">
              <SelectDropdown
                titleClass="b-inputs-modal-type__title"
                onChange={this.handleTypeChange}
                options={[
                  { label: "Text", value: "text" },
                  { label: "Text Area", value: "textarea" },
                  { label: "Boolean", value: "boolean" },
                  { label: "Password", value: "password" },
                  { label: "Number", value: "number" },
                  { label: "Select", value: "select" }
                ]}
                value={type}
                theme="bmrg-white"
                title="Type"
                styles={{ width: "100%" }}
              />
            </div>
            {this.renderDefaultValue()}
          </div>
        </Body>
        <Footer style={{ paddingTop: "1rem" }}>
          <ConfirmButton
            disabled={!(key && description && label) || (keyError || descriptionError || labelError)}
            text={isEdit ? "EDIT" : "CREATE"}
            onClick={this.handleConfirm}
            theme="bmrg-white"
          />
        </Footer>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(InputsModalContent);
