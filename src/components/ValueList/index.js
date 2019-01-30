import React from "react";
import PropTypes from "prop-types";
import { AutoSuggestTextInput, AutoSuggestTextArea } from "@boomerang/boomerang-components/lib/AutoSuggestInput";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import AutoSuggest from "Components/AutoSuggest";
import Toggle from "./Toggle";
import isURL from "validator/lib/isURL";
import formatAutoSuggestProperties from "Utilities/formatAutoSuggestProperties";
import "./styles.scss";

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

function validateInput({ value, maxValueLength, minValueLength, validationFunction, validationText }) {
  if (value.length > maxValueLength) {
    return `Must be less than ${maxValueLength} characters`;
  } else if (value.length < minValueLength) {
    return `Must be more than ${minValueLength} characters`;
  } else if (!validationFunction(value)) {
    return validationText;
  } else {
    return "";
  }
}

const ValueList = ({
  form,
  inputProperties,
  node,
  nodeConfig,
  onSelectTextInputChange,
  onToggleChange,
  task,
  taskNames,
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
        {taskConfig.map((item, index) => {
          const maxValueLength = item.maxValueLength || 128;
          const minValueLength = item.minValueLength || 0;
          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem", position: "relative" }}>
                <AutoSuggest
                  key={item.key + index}
                  name={item.key}
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white",
                    validationFunction: value =>
                      validateInput({
                        value,
                        maxValueLength,
                        minValueLength,
                        [itemConfig.validationFunction]: itemConfig.validationFunction,
                        [itemConfig.validationText]: itemConfig.validationText
                      })
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onSelectTextInputChange}
                >
                  <AutoSuggestTextInput />
                </AutoSuggest>
              </div>
            );
          } else if (Object.keys(TEXT_AREA_TYPES).includes(item.type)) {
            const itemConfig = TEXT_AREA_TYPES[item.type];
            return (
              <div style={{ paddingBottom: "2.125rem", position: "relative" }}>
                <AutoSuggest
                  key={item.key + index}
                  name={item.key}
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white",
                    validationFunction: value =>
                      validateInput({
                        value,
                        maxValueLength,
                        minValueLength,
                        [itemConfig.validationFunction]: itemConfig.validationFunction,
                        [itemConfig.validationText]: itemConfig.validationText
                      })
                  }}
                  theme="bmrg-white"
                  initialValue={inputs[item.key] || ""}
                  handleChange={onSelectTextInputChange}
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
                  key={item.key + index}
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
                key={item.key + index}
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
