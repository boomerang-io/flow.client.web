import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ValueList from "./ValueList";

class DisplayForm extends Component {
  static propTypes = {
    nodeConfig: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  };

  state = {};

  handleAppsDropdownChange = items => {
    this.setState(() => ({
      items
    }));
  };

  handleTextInputChange = (value, errors, field) => {
    if (field !== undefined && field !== "undefined") {
      this.setState(() => ({
        [field]: { value, errors: Object.values(errors).filter(error => error) } //filter out undefined errors
      }));
    }
  };

  handleToggleChange = event => {
    const { name: field } = event.target;
    const { checked } = event.target;
    if (checked !== undefined && checked !== "undefined") {
      this.setState(() => ({ [field]: { value: checked } }));
    }
  };

  /*handleSaveAppsDropdown = event => {
      event.stopPropagation();
      const { config, onSave } = this.props;
      const toolTemplates = this.state.items.map(item => {
        return {
          description: "",
          key: item.name.toLowerCase(),
          label: item.name,
          type: "ToolTemplateEntity", //hardcoding this TODO: improve
          value: item.id
        };
      });
      const configToSave = [
        {
          config: toolTemplates,
          description: config.description,
          id: config.id,
          key: config.key,
          name: config.name,
          type: config.type
        }
      ];
      onSave(configToSave);
    };*/

  handleOnSave = () => {
    this.props.onSave(this.createConfigToSave());
    this.props.closeModal();
  };

  createConfigToSave() {
    const stateKeys = Object.keys(this.state);
    const configToSave = {};
    stateKeys.forEach(key => {
      configToSave[key] = this.state[key].value;
    });

    return configToSave;
  }

  determineSectionHeaderConfig() {
    let isValid;
    let onSaveFunction;

    isValid = this.determineIsValidForm();
    onSaveFunction = this.handleOnSave;

    return { isValid, onSaveFunction };
  }

  determineIsValidForm = () => {
    const stateKeys = Object.keys(this.state);
    if (!stateKeys.length) return false;
    let errorCount = 0;
    stateKeys.forEach(key => {
      const errors = this.state[key].errors;
      errorCount += errors ? errors.length : 0;
    });
    if (errorCount) return false;
    return true;
  };

  render() {
    //console.log(this.state);
    const sectionHeaderConfig = this.determineSectionHeaderConfig();
    const { nodeConfig, task } = this.props;
    return (
      <>
        <ModalContentBody style={{ maxWidth: "35rem", margin: "auto", height: "30rem" }}>
          <ValueList
            task={task}
            nodeConfig={nodeConfig}
            onTextInputChange={this.handleTextInputChange}
            onToggleChange={this.handleToggleChange}
          />
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton
            theme="bmrg-white"
            text="Apply"
            disabled={!sectionHeaderConfig.isValid}
            onClick={sectionHeaderConfig.onSaveFunction}
          >
            Apply
          </ModalConfirmButton>
        </ModalContentFooter>
      </>
    );
  }
}

export default DisplayForm;
