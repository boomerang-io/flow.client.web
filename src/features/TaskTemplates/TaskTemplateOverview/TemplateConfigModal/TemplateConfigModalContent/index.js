import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ComboBox,
  Creatable,
  TextArea,
  TextInput,
  Toggle,
  ModalFlowForm,
} from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { Formik } from "formik";
import TextEditorModal from "Components/TextEditorModal";
import * as Yup from "yup";
import clonedeep from "lodash/cloneDeep";
import INPUT_TYPES from "Constants/workflowInputTypes";
import styles from "./TemplateConfigModalContent.module.scss";

const FIELD = {
  KEY: "key",
  DESCRIPTION: "description",
  LABEL: "label",
  PLACEHOLDER: "placeholder",
  HELPER_TEXT: "helperText",
  READ_ONLY: "readOnly",
  REQUIRED: "required",
  TYPE: "type",
  DEFAULT_VALUE: "defaultValue",
  OPTIONS: "options",
};

const INPUT_TYPES_LABELS = [
  { label: "Boolean", value: "boolean" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "Password", value: "password" },
  { label: "Select", value: "select" },
  { label: "Text", value: "text" },
  { label: "Text Area", value: "textarea" },
  { label: "Text Editor - JavaScript/JSON", value: "texteditor::javascript" },
  { label: "Text Editor - Shell", value: "texteditor::shell" },
  { label: "Text Editor - Text", value: "texteditor::text" },
  { label: "Text Editor - YAML", value: "texteditor::yaml" },
  { label: "Time", value: "time" },
  { label: "URL", value: "url" },
];

const TextEditorInput = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};

class TemplateConfigModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    field: PropTypes.object,
    fieldKeys: PropTypes.array,
    isEdit: PropTypes.bool,
    templateFields: PropTypes.array,
    setFieldValue: PropTypes.func.isRequired,
  };

  state = {
    defaultValueType: "text",
  };

  handleOnChange = (e, formikChange) => {
    formikChange(e);
  };

  handleOnFieldValueChange = (value, id, setFieldValue) => {
    setFieldValue(id, value);
  };

  handleOnTypeChange = (selectedItem, setFieldValue) => {
    this.setState({ defaultValueType: selectedItem.value });
    setFieldValue(FIELD.TYPE, selectedItem);
    setFieldValue(FIELD.DEFAULT_VALUE, selectedItem.value === INPUT_TYPES.BOOLEAN ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleOptionsChange = (values, setFieldValue) => {
    setFieldValue(FIELD.OPTIONS, values);
  };

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  validateKey = (key) => {
    const regexp = /^[a-zA-Z0-9-._]+$/g;
    return regexp.test(key);
  };

  handleConfirm = (values) => {
    let field = clonedeep(values);
    field.type = field.type.value;
    const { templateFields, setFieldValue } = this.props;
    // Remove in case they are present if the user changed their mind
    if (field.type !== INPUT_TYPES.SELECT) {
      delete field.options;
    } else {
      // Create options in correct type for service - { key, value }
      field.options = field.options.map((field) => ({ key: field, value: field }));
    }

    if (field.type === INPUT_TYPES.BOOLEAN) {
      if (!field.defaultValue) field.defaultValue = false;
    }
    if (this.props.isEdit) {
      const fieldIndex = templateFields.findIndex((field) => field.key === this.props.field.key);
      let newProperties = [].concat(templateFields);
      newProperties.splice(fieldIndex, 1, field);
      setFieldValue("currentConfig", newProperties);
      this.props.forceCloseModal();
    } else {
      let newProperties = [].concat(templateFields);
      newProperties.push(field);
      setFieldValue("currentConfig", newProperties);
      this.props.forceCloseModal();
    }
  };

  renderDefaultValue = (formikProps) => {
    const { values, handleBlur, handleChange, setFieldValue } = formikProps;
    switch (values.type.value) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <Toggle
            data-testid="toggle"
            id={FIELD.DEFAULT_VALUE}
            label="Default Value"
            helperText="Initial value that can be changed"
            onToggle={(value) => this.handleOnFieldValueChange(value.toString(), FIELD.DEFAULT_VALUE, setFieldValue)}
            orientation="vertical"
            toggled={values.defaultValue === "true"}
          />
        );
      case INPUT_TYPES.SELECT:
        // If editing an option, values will be an array of { key, value}
        let options = clonedeep(values.options);
        return (
          <>
            <Creatable
              data-testid="creatable"
              id={FIELD.OPTIONS}
              onChange={(createdItems) => this.handleOptionsChange(createdItems, setFieldValue)}
              label="Options"
              placeholder="Enter option"
              values={options || []}
            />
            <ComboBox
              data-testid="select"
              id={FIELD.DEFAULT_VALUE}
              onChange={({ selectedItem }) =>
                this.handleOnFieldValueChange(selectedItem, FIELD.DEFAULT_VALUE, setFieldValue)
              }
              items={options || []}
              initialSelectedItem={values.defaultValue || {}}
              label="Default Option"
            />
          </>
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <TextArea
            data-testid="text-area"
            id={FIELD.DEFAULT_VALUE}
            labelText="Default Value (optional)"
            helperText="Initial value that can be changed"
            onBlur={handleBlur}
            onChange={(e) => this.handleOnChange(e, handleChange)}
            style={{ resize: "none" }}
            value={values.defaultValue || ""}
          />
        );
      case INPUT_TYPES.TEXT_EDITOR:
      case INPUT_TYPES.TEXT_EDITOR_JS:
      case INPUT_TYPES.TEXT_EDITOR_TEXT:
      case INPUT_TYPES.TEXT_EDITOR_SHELL:
      case INPUT_TYPES.TEXT_EDITOR_YAML:
        return (
          <TextEditorInput
            data-testid="texteditor"
            key="texteditor"
            id={FIELD.DEFAULT_VALUE}
            label="Default Value (optional)"
            helperText="Initial value that can be changed"
            onBlur={handleBlur}
            style={{ resize: "none" }}
            autoSuggestions={[]}
            formikSetFieldValue={(value) => setFieldValue("defaultValue", value)}
            initialValue={values.defaultValue}
            type={values.type.value}
            value={values.defaultValue || ""}
          />
        );
      default:
        // Fallback to text input here because it covers text, password, and url
        return (
          <TextInput
            data-testid="text-input"
            id={FIELD.DEFAULT_VALUE}
            labelText="Default Value (optional)"
            helperText="Initial value that can be changed"
            onBlur={handleBlur}
            onChange={(e) => this.handleOnChange(e, handleChange)}
            type={values.type.value}
            value={values.defaultValue || ""}
          />
        );
    }
  };

  determineDefaultValueSchema = (defaultType) => {
    switch (defaultType) {
      case "text":
      case "textarea":
      case "texteditor":
      case "password":
        return Yup.string();
      case "boolean":
        return Yup.boolean();
      case "number":
        return Yup.number();
      default:
        return Yup.mixed();
    }
  };

  render() {
    const { field, isEdit, fieldKeys } = this.props;
    let defaultValueType = this.state.defaultValueType;
    return (
      <Formik
        validateOnMount
        onSubmit={this.handleConfirm}
        initialValues={{
          [FIELD.KEY]: field?.key ?? "",
          [FIELD.LABEL]: field?.label ?? "",
          [FIELD.DESCRIPTION]: field?.description ?? "",
          [FIELD.PLACEHOLDER]: field?.placeholder ?? "",
          [FIELD.HELPER_TEXT]: field?.helperText ?? "",
          [FIELD.READ_ONLY]: field?.readOnly ?? false,
          [FIELD.REQUIRED]: field?.required ?? false,
          [FIELD.TYPE]: field
            ? field.type === "texteditor"
              ? INPUT_TYPES_LABELS[7]
              : INPUT_TYPES_LABELS.find((type) => type?.value === field.type)
            : {},
          [FIELD.DEFAULT_VALUE]: field?.defaultValue ?? "",
          // Read in values as an array of strings. Service returns object { key, value }
          [FIELD.OPTIONS]: field?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
        }}
        validationSchema={Yup.object().shape({
          [FIELD.KEY]: Yup.string()
            .required("Enter a key")
            .max(64, "Key must not be greater than 64 characters")
            .notOneOf(fieldKeys || [], "Enter a unique key value for this workflow")
            .test(
              "is-valid-key",
              "Only alphanumeric, underscore, dash, and period characters allowed",
              this.validateKey
            ),
          [FIELD.LABEL]: Yup.string().required("Enter a Name").max(64, "Name must not be greater than 64 characters"),
          [FIELD.DESCRIPTION]: Yup.string().max(128, "Description must not be greater than 128 characters"),
          [FIELD.PLACEHOLDER]: Yup.string().max(64, "Placeholder must not be greater than 64 characters"),
          [FIELD.HELPER_TEXT]: Yup.string().max(64, "Helper Text must not be greater than 128 characters"),
          [FIELD.READ_ONLY]: Yup.boolean(),
          [FIELD.REQUIRED]: Yup.boolean(),
          [FIELD.TYPE]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [FIELD.OPTIONS]: Yup.array().when(FIELD.TYPE, {
            is: (type) => type.value === INPUT_TYPES.SELECT,
            then: Yup.array().required("Enter an option").min(1, "Enter at least one option"),
          }),
          [FIELD.DEFAULT_VALUE]: this.determineDefaultValueSchema(defaultValueType),
        })}
      >
        {(formikProps) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isValid,
          } = formikProps;

          return (
            <ModalFlowForm onSubmit={handleSubmit}>
              <ModalBody className={styles.container}>
                <ComboBox
                  id={FIELD.TYPE}
                  onChange={({ selectedItem }) =>
                    this.handleOnTypeChange(
                      selectedItem !== null ? selectedItem : { label: "", value: "" },
                      setFieldValue
                    )
                  }
                  items={INPUT_TYPES_LABELS}
                  initialSelectedItem={values.type}
                  itemToString={(item) => item && item.label}
                  placeholder="Select a type"
                  titleText="Type"
                />
                {!isEdit && (
                  <TextInput
                    helperText="Reference value for field in task template config"
                    id={FIELD.KEY}
                    invalid={errors.key && touched.key}
                    invalidText={errors.key}
                    labelText="Key"
                    onBlur={handleBlur}
                    onChange={(e) => this.handleOnChange(e, handleChange)}
                    placeholder="e.g. email"
                    value={values.key}
                  />
                )}
                <TextInput
                  id={FIELD.LABEL}
                  invalid={errors.label && touched.label}
                  invalidText={errors.label}
                  labelText="Label"
                  placeholder="e.g. Email"
                  value={values.label}
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                />

                <TextInput
                  id={FIELD.HELPER_TEXT}
                  invalid={errors.helperText && touched.helperText}
                  invalidText={errors.helperText}
                  labelText="Helper Text (optional)"
                  helperText="Assist user in completing the field"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  value={values.helperText}
                />
                <TextInput
                  id={FIELD.DESCRIPTION}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description (optional)"
                  helperText="Provide additional information about field to show in a tooltip"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  value={values.description}
                />
                <TextInput
                  id={FIELD.PLACEHOLDER}
                  invalid={errors.placeholder && touched.placeholder}
                  invalidText={errors.placeholder}
                  labelText="Placeholder (optional)"
                  helperText="Give the user a hint for the field value"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  value={values.placeholder}
                />

                {this.renderDefaultValue(formikProps)}
                <Toggle
                  id={FIELD.REQUIRED}
                  labelText="Required"
                  onToggle={(value) => this.handleOnFieldValueChange(value, FIELD.REQUIRED, setFieldValue)}
                  orientation="vertical"
                  toggled={values.required}
                />
                <Toggle
                  id={FIELD.READ_ONLY}
                  labelText="Read Only"
                  onToggle={(value) => this.handleOnFieldValueChange(value, FIELD.READ_ONLY, setFieldValue)}
                  orientation="vertical"
                  toggled={values.readOnly}
                />
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button data-testid="inputs-modal-confirm-button" disabled={!isValid} type="submit">
                  {isEdit ? "Save" : "Create"}
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default TemplateConfigModalContent;
