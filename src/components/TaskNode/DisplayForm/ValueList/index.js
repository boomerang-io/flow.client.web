import React from "react";
import PropTypes from "prop-types";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import { default as BmrgToggle } from "@boomerang/boomerang-components/lib/Toggle";
import isURL from "validator/lib/isURL";
import "./styles.scss";

const INPUT_TYPES = {
  text: { type: "text", validationFunction: false, validationText: "" },
  secured: { type: "password", validationFunction: false, validationText: "" },
  url: { type: "input", validationFunction: isURL, validationText: "Please enter a valid url" }
};

const Toggle = ({ defaultChecked, description, label, name, onChange }) => {
  return (
    <div className="b-settings-toggle">
      <BmrgToggle onChange={onChange} name={name} defaultChecked={defaultChecked} />
      <div className="b-setting-toggle__info">
        <label className="b-settings-toggle__label">{label}</label>
        <label className="b-settings-toggle__description">{description}</label>
      </div>
    </div>
  );
};

Toggle.propTypes = {
  defaultChecked: PropTypes.bool,
  description: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const ValueList = ({ nodeConfig, task, onTextInputChange, onToggleChange }) => {
  const { config: nodeConfigObj } = nodeConfig;
  const { config: taskConfig } = task;
  return (
    <>
      <h1 className="s-settings-value-list-header">{taskConfig.description}</h1>
      <div className="c-settings-value-list">
        {taskConfig.map(item => {
          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            const maxValueLength = item.maxValueLength || 128;
            const minValueLength = item.minValueLength || 0;
            return (
              <TextInput
                key={item.key}
                name={item.key}
                alwaysShowTitle={true}
                handleChange={onTextInputChange}
                placeholder={item.description}
                maxChar={maxValueLength}
                maxCharText={`Must be less than ${maxValueLength} characters`}
                minChar={minValueLength}
                minCharText={`Must be more than ${minValueLength} characters`}
                title={item.label}
                value={nodeConfigObj[item.key] || ""}
                theme="bmrg-white"
                type={itemConfig.type}
                validationFunction={itemConfig.validationFunction}
                validationText={itemConfig.validationText}
              />
            );
          } else {
            return (
              <Toggle
                key={item.key}
                name={item.key}
                id={item.key}
                defaultChecked={String(nodeConfigObj[item.key]) === "true" ? true : false}
                label={item.label}
                description={item.description}
                onChange={onToggleChange}
              />
            );
          }
        })}
      </div>
    </>
  );
};

Toggle.propTypes = {
  config: PropTypes.object.isRequired,
  onTextInputChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired
};

export default ValueList;
