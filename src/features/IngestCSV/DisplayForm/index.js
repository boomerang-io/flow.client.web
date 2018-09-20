import React, { Component } from "react";
import PropTypes from "prop-types";
import ValueList from "../ValueList/index.js";
import { Tile } from "carbon-components-react";

class DisplayForm extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
    //onSave: PropTypes.func.isRequired
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

  handleOnSave = event => {
    event.stopPropagation();
    this.props.onSave(this.createConfigToSave());
  };

  createConfigToSave() {
    const configToSave = { ...this.props.config };
    const stateKeys = Object.keys(this.state);
    configToSave.config.forEach(item => {
      if (stateKeys.includes(item.key)) {
        item.value = this.state[item.key].value;
      }
    });

    return [configToSave];
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

  /*determineComponentToRender() {
    const { config } = this.props;
    if (config.type === CONFIG_TYPES.APPS_LIST) {
      return <AppsDropdownSettingsContainer config={config} onChange={this.handleAppsDropdownChange} />;
    } else {
      return (
        <ValueList
          config={config}
          onTextInputChange={this.handleTextInputChange}
          onToggleChange={this.handleToggleChange}
        />
      );
    }
  }*/

  /*determineSectionHeaderConfig() {
    const { config } = this.props;
    let isValid;
    let onSaveFunction;
    if (config.type === CONFIG_TYPES.APPS_LIST) {
      isValid = !!this.state.items;
      onSaveFunction = this.handleSaveAppsDropdown;
    } else {
      isValid = this.determineIsValidForm();
      onSaveFunction = this.handleOnSave;
    }
    return { isValid, onSaveFunction };
  }*/

  render() {
    const { config } = this.props;
    //const sectionHeaderConfig = this.determineSectionHeaderConfig();
    return (
      <div className="displayform">
        <Tile className="tile-valuelist"> </Tile>
        <ValueList
          config={config}
          onTextInputChange={this.handleTextInputChange}
          onToggleChange={this.handleToggleChange}
        />
      </div>
    );
  }
}

export default DisplayForm;
