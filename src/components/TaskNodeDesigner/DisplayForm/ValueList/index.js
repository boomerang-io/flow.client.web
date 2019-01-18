import React from "react";
import PropTypes from "prop-types";
import {
  AutoSuggestInput,
  AutoSuggestTextInput,
  AutoSuggestTextArea
} from "@boomerang/boomerang-components/lib/AutoSuggestInput";
import { default as BmrgToggle } from "@boomerang/boomerang-components/lib/Toggle";
import isURL from "validator/lib/isURL";
import "./styles.scss";

const validateInput = (value, maxValueLength, minValueLength, validationFunction, validationText) => {
  if (value.length > maxValueLength) {
    return `Must be less than ${maxValueLength} characters`;
  } else if (value.length < minValueLength) {
    return `Must be more than ${minValueLength} characters`;
  } else if (!validationFunction(value)) {
    return validationText;
  } else {
    return "";
  }
};

const INPUT_TYPES = {
  text: { type: "text", validationFunction: () => {}, validationText: "" },
  secured: { type: "password", validationFunction: () => {}, validationText: "" },
  url: { type: "input", validationFunction: isURL, validationText: "Please enter a valid url" }
};

const TEXT_AREA_TYPES = {
  textarea: { type: "textarea", validationFunction: () => {}, validationText: "" }
};

const Toggle = ({ defaultChecked, description, label, name, onChange }) => {
  return (
    <div className="b-settings-toggle">
      <BmrgToggle red onChange={onChange} name={name} defaultChecked={defaultChecked} />
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
  const { inputs } = nodeConfig;
  const { config: taskConfig } = task;
  return (
    <>
      <h1 className="s-settings-value-list-header">{taskConfig.description}</h1>
      <div className="c-settings-value-list">
        {taskConfig.map(item => {
          const maxValueLength = item.maxValueLength || 128;
          const minValueLength = item.minValueLength || 0;
          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem" }}>
                <AutoSuggestInput
                  key={item.key}
                  name={item.key}
                  autoSuggestions={[]}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onTextInputChange}
                  validationFunction={value =>
                    validateInput(
                      value,
                      maxValueLength,
                      minValueLength,
                      itemConfig.validationFunction,
                      itemConfig.validationText
                    )
                  }
                >
                  {inputProps => <AutoSuggestTextInput {...inputProps} />}
                </AutoSuggestInput>
              </div>
            );
          }
          if (Object.keys(TEXT_AREA_TYPES).includes(item.type)) {
            const itemConfig = TEXT_AREA_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem" }}>
                <AutoSuggestInput
                  key={item.key}
                  name={item.key}
                  autoSuggestions={[]}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onTextInputChange}
                  validationFunction={value =>
                    validateInput(
                      value,
                      maxValueLength,
                      minValueLength,
                      itemConfig.validationFunction,
                      itemConfig.validationText
                    )
                  }
                >
                  {inputProps => <AutoSuggestTextArea {...inputProps} />}
                </AutoSuggestInput>
              </div>
            );
          } else {
            return (
              <Toggle
                key={item.key}
                name={item.key}
                id={item.key}
                defaultChecked={String(inputs[item.key]) === "true" ? true : false}
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

ValueList.propTypes = {
  task: PropTypes.object.isRequired,
  nodeConfig: PropTypes.object.isRequired,
  onTextInputChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired
};

export default ValueList;
