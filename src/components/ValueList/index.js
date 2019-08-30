import React from "react";
import PropTypes from "prop-types";
import { AutoSuggestTextInput } from "@boomerang/boomerang-components";
import { ComboBox, ComboBoxMultiSelect, TextInput } from "@boomerang/carbon-addons-boomerang-react";
import AutoSuggest from "Components/AutoSuggest";
import Toggle from "./Toggle";
import TextAreaModal from "Components/TextAreaModal";
import formatAutoSuggestProperties from "Utilities/formatAutoSuggestProperties";
import { INPUT_TYPES, TEXT_AREA_TYPES, SELECT_TYPES } from "Constants/formInputTypes";
import "./styles.scss";

function validateInput({ value, maxValueLength, minValueLength, validationFunction, validationText }) {
  if (maxValueLength !== undefined && value.length > maxValueLength) {
    return { message: `Must be less than ${maxValueLength} characters` };
  } else if (minValueLength !== undefined && value.length < minValueLength) {
    return { message: `Must be more than ${minValueLength} characters` };
  } else if (validationFunction && !validationFunction(value)) {
    return { message: validationText };
  } else {
    return { message: "" };
  }
}

const ValueList = ({ formikHandleChange, formikProps, formikSetFieldValue, inputProperties, task }) => {
  const { config: taskConfig } = task;
  const { values, touched, errors, handleBlur, handleChange, setFieldValue } = formikProps;

  return (
    <>
      <div className="c-settings-value-list">
        <div style={{ paddingBottom: "2.125rem" }}>
          <TextInput
            id="taskName"
            labelText="Task Name"
            name="taskName"
            onBlur={handleBlur}
            onChange={e => formikHandleChange(e, handleChange)}
            placeholder="Enter a task name"
            value={values.taskName}
            invalid={errors.taskName && touched.taskName}
            invalidText={errors.taskName}
          />
        </div>
        {taskConfig.map((item, index) => {
          const maxValueLength = item.maxValueLength;
          const minValueLength = item.minValueLength;
          const key = item.key;
          const inputValue = values[key];

          if (Object.keys(INPUT_TYPES).includes(item.type)) {
            const itemConfig = INPUT_TYPES[item.type];
            return (
              <div key={key + index} style={{ paddingBottom: "2.125rem", position: "relative" }}>
                <AutoSuggest
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  handleChange={value => formikSetFieldValue(value, key, setFieldValue)}
                  id={key}
                  initialValue={inputValue}
                  inputProps={{
                    placeholder: item.description,
                    alwaysShowTitle: true,
                    title: item.label,
                    type: itemConfig.type,
                    theme: "bmrg-flow"
                  }}
                  name={key}
                  theme="bmrg-flow"
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
              <div key={key + index} style={{ position: "relative", cursor: "pointer" }}>
                <TextAreaModal
                  autoSuggestions={formatAutoSuggestProperties(inputProperties)}
                  formikSetFieldValue={value => formikSetFieldValue(value, key, setFieldValue)}
                  initialValue={inputValue}
                  inputProperties={inputProperties}
                  item={item}
                  itemConfig={itemConfig}
                  minValueLength={minValueLength}
                  maxValueLength={maxValueLength}
                  validateInput={validateInput}
                />
              </div>
            );
          } else if (item.type === SELECT_TYPES.select.type) {
            return (
              <div key={key + index} style={{ marginBottom: "2.125rem" }}>
                <ComboBox
                  id={key}
                  key={key + index}
                  items={item.options.map(option => ({ value: option, label: option }))}
                  itemToString={item => item && item.label}
                  initialSelectedItem={inputValue}
                  onChange={({ selectedItem }) =>
                    formikSetFieldValue(
                      selectedItem !== null ? selectedItem : { label: "", value: "" },
                      key,
                      setFieldValue
                    )
                  }
                  titleText={item.label}
                />
              </div>
            );
          } else if (item.type === SELECT_TYPES.multiselect.type) {
            return (
              <div key={key + index} style={{ marginBottom: "2.125rem" }}>
                <ComboBoxMultiSelect
                  id={key}
                  key={key + index}
                  items={item.options.map(option => ({ value: option, label: option }))}
                  itemToString={item => item && item.label}
                  selectedItems={inputValue}
                  onChange={({ selectedItems }) => formikSetFieldValue(selectedItems, key, setFieldValue)}
                  titleText={item.label}
                />
              </div>
            );
          } else {
            return (
              <Toggle
                checked={inputValue}
                description={item.description}
                id={key}
                key={key + index}
                label={item.label}
                name={key}
                onChange={(checked, event, id) => formikSetFieldValue(checked, id, setFieldValue)}
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
  formikSetFieldValue: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired,
  formikHandleChange: PropTypes.func.isRequired,
  taskNames: PropTypes.array.isRequired,
  node: PropTypes.object.isRequired
};

export default ValueList;
