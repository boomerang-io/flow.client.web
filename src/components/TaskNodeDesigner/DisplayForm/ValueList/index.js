import React from "react";
import PropTypes from "prop-types";
import { AutoSuggestTextInput, AutoSuggestTextArea } from "@boomerang/boomerang-components/lib/AutoSuggestInput";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import { default as BmrgToggle } from "@boomerang/boomerang-components/lib/Toggle";
import AutoSuggest from "./AutoSuggest";
import isURL from "validator/lib/isURL";
import "./styles.scss";

const SUGGESTION_OPTIONS = [
  {
    value: `\${p:javascript}`,
    label: "javascript"
  },
  { value: `\${p:elm}`, label: "elm" },
  { value: `\${p:java}`, label: "java" },
  { value: `\${p:elixir}`, label: "elixir" },
  { value: `\${p:bash}`, label: "bash" },
  { value: `\${p:nodejs}`, label: "nodejs" },
  { value: `\${p:python}`, label: "python" },
  { value: `\${p:size}`, label: "size" },
  { value: `\${p:color}`, label: "color" },
  { value: `\${p:workflow/activity.id}`, label: "workflow/activity.id" }
];

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

const SELECT_DROPDOWN_TYPES = {
  select: { type: "select", isMultiselect: false },
  multiselect: { type: "multiselect", isMultiselect: true }
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

const ValueList = ({
  form,
  nodeConfig,
  task,
  onSelectTextInputChange,
  onToggleChange,
  taskNames,
  node,
  updateNodeTaskName
}) => {
  const { inputs } = nodeConfig;
  const { config: taskConfig } = task;
  return (
    <>
      <div className="c-settings-value-list">
        <TextInput
          required
          noValueText="Name is required"
          comparisonData={taskNames}
          existValueText="Task name must be unique per workflow"
          externallyControlled
          name="taskName"
          placeholder="Enter a task name"
          value={node.taskName}
          title="Task Name"
          onChange={updateNodeTaskName}
          theme="bmrg-white"
        />
        {taskConfig.map(item => {
          const maxValueLength = item.maxValueLength || 128;
          const minValueLength = item.minValueLength || 0;
          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem" }}>
                <AutoSuggest
                  key={item.key}
                  name={item.key}
                  autoSuggestions={SUGGESTION_OPTIONS}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onSelectTextInputChange}
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
                  <AutoSuggestTextInput />
                </AutoSuggest>
              </div>
            );
          } else if (Object.keys(TEXT_AREA_TYPES).includes(item.type)) {
            const itemConfig = TEXT_AREA_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem" }}>
                <AutoSuggest
                  key={item.key}
                  name={item.key}
                  autoSuggestions={SUGGESTION_OPTIONS}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onSelectTextInputChange}
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
                  <AutoSuggestTextArea />
                </AutoSuggest>
              </div>
            );
          } else if (Object.keys(SELECT_DROPDOWN_TYPES).includes(item.type)) {
            return (
              <div style={{ marginBottom: "2.125rem" }}>
                <SelectDropdown
                  simpleValue
                  multi={item.isMultiselect}
                  key={item.key}
                  name={item.key}
                  onChange={onSelectTextInputChange}
                  options={item.options.map(option => ({ value: option, label: option }))}
                  value={form[item.key] ? form[item.key].value : ""}
                  theme="bmrg-white"
                  title={item.label}
                  styles={{ width: "100%" }}
                />
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
  form: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  nodeConfig: PropTypes.object.isRequired,
  handleSelectTextInputChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired,
  updateNodeTaskName: PropTypes.func.isRequired,
  taskNames: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired
};

export default ValueList;
