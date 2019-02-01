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
    return { message: `Must be less than ${maxValueLength} characters` };
  } else if (value.length < minValueLength) {
    return { message: `Must be more than ${minValueLength} characters` };
  } else if (validationFunction && !validationFunction(value)) {
    return { message: validationText };
  } else {
    return { message: "" };
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
          alwaysShowTitle
          required
          comparisonData={taskNames}
          existValueText="Task name must be unique per workflow"
          externallyControlled
          name="taskName"
          onChange={updateNodeTaskName}
          noValueText="Name is required"
          placeholder="Enter a task name"
          theme="bmrg-white"
          title="Task Name"
          value={node.taskName}
        />
        {taskConfig.map((item, index) => {
          const maxValueLength = item.maxValueLength || 128;
          const minValueLength = item.minValueLength || 0;
          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            return (
              <div key={item.key + index} style={{ paddingBottom: "2.125rem", position: "relative" }}>
                <AutoSuggest
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  handleChange={onSelectTextInputChange}
                  initialValue={inputs[item.key] || ""}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  name={item.key}
                  theme="bmrg-white"
                  validationFunction={value =>
                    validateInput({
                      value,
                      maxValueLength,
                      minValueLength,
                      validationFunction: itemConfig.validationFunction,
                      validationText: itemConfig.validationText
                    })
                  }
                >
                  <AutoSuggestTextInput />
                </AutoSuggest>
              </div>
            );
          } else if (Object.keys(TEXT_AREA_TYPES).includes(item.type)) {
            const itemConfig = TEXT_AREA_TYPES[item.type];
            return (
              <div key={item.key + index} style={{ paddingBottom: "2.125rem", position: "relative" }}>
                <AutoSuggest
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  handleChange={onSelectTextInputChange}
                  initialValue={inputs[item.key] || ""}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-white"
                  }}
                  name={item.key}
                  theme="bmrg-white"
                  validationFunction={value =>
                    validateInput({
                      value,
                      maxValueLength,
                      minValueLength,
                      validationFunction: itemConfig.validationFunction,
                      validationText: itemConfig.validationText
                    })
                  }
                >
                  <AutoSuggestTextArea />
                </AutoSuggest>
              </div>
            );
          } else if (Object.keys(SELECT_DROPDOWN_TYPES).includes(item.type)) {
            return (
              <div key={item.key + index} style={{ marginBottom: "2.125rem" }}>
                <SelectDropdown
                  simpleValue
                  key={item.key + index}
                  multi={item.isMultiselect}
                  name={item.key}
                  onChange={onSelectTextInputChange}
                  options={item.options.map(option => ({ value: option, label: option }))}
                  styles={{ width: "100%" }}
                  theme="bmrg-white"
                  title={item.label}
                  value={form[item.key] ? form[item.key].value : ""}
                />
              </div>
            );
          } else {
            return (
              <Toggle
                defaultChecked={String(inputs[item.key]) === "true" ? true : false}
                description={item.description}
                id={item.key}
                key={item.key + index}
                label={item.label}
                name={item.key}
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
  onSelectTextInputChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired,
  updateNodeTaskName: PropTypes.func.isRequired,
  taskNames: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired
};

export default ValueList;
