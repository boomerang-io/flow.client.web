import React from "react";
import PropTypes from "prop-types";
import TextArea from "@boomerang/boomerang-components/lib/TextArea";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import { default as BmrgToggle } from "@boomerang/boomerang-components/lib/Toggle";
import isURL from "validator/lib/isURL";
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
              <TextInput
                key={item.key}
                name={item.key}
                alwaysShowTitle={true}
                onChange={onSelectTextInputChange}
                placeholder={item.description}
                maxChar={maxValueLength}
                maxCharText={`Must be less than ${maxValueLength} characters`}
                minChar={minValueLength}
                minCharText={`Must be more than ${minValueLength} characters`}
                title={item.label}
                value={inputs[item.key] || ""}
                theme="bmrg-white"
                type={itemConfig.type}
                validationFunction={itemConfig.validationFunction}
                validationText={itemConfig.validationText}
              />
            );
          } else if (Object.keys(TEXT_AREA_TYPES).includes(item.type)) {
            const itemConfig = TEXT_AREA_TYPES[item.type];
            return (
              <TextArea
                key={item.key}
                name={item.key}
                alwaysShowTitle={true}
                handleChange={onSelectTextInputChange}
                placeholder={item.description}
                maxChar={maxValueLength}
                maxCharText={`Must be less than ${maxValueLength} characters`}
                minChar={minValueLength}
                minCharText={`Must be more than ${minValueLength} characters`}
                title={item.label}
                value={inputs[item.key] || ""}
                theme="bmrg-white"
                validationFunction={itemConfig.validationFunction}
                validationText={itemConfig.validationText}
              />
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
