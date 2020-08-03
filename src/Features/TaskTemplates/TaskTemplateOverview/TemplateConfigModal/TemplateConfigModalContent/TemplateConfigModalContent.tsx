//@ts-nocheck
import React, { Component } from "react";
import {
  ComboBox,
  Creatable,
  TextArea,
  TextInput,
  Toggle,
  ModalForm,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import TextEditorModal from "Components/TextEditorModal";
import * as Yup from "yup";
import clonedeep from "lodash/cloneDeep";
import { InputProperty, InputType, PROPERTY_KEY_REGEX } from "Constants";
import { DataDrivenInput }from "Types";
import styles from "./TemplateConfigModalContent.module.scss";

const inputTypeOptions = [
  { label: "Boolean", value: InputType.Boolean },
  { label: "Email", value: InputType.Email },
  { label: "Number", value: InputType.Number },
  { label: "Password", value: InputType.Password },
  { label: "Select", value: InputType.Select },
  { label: "Text", value: InputType.Text },
  { label: "Text Area", value: InputType.TextArea },
  { label: "Text Editor", value: InputType.TextEditor },
  { label: "Text Editor - JavaScript/JSON", value: InputType.TextEditorJs },
  { label: "Text Editor - Shell", value: InputType.TextEditorShell },
  { label: "Text Editor - Text", value: InputType.TextEditorText },
  { label: "Text Editor - YAML", value: InputType.TextEditorYaml },
  { label: "Time", value: "time" },
  { label: "URL", value: "url" },
];

interface TextEditorInputProps {
  id: string;
  item: { description: string; label: string}

}

const TextEditorInput: React.FC<TextEditorInputProps> = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} {...props.item} />
    </div>
  );
};

interface TemplateConfigModalContentProps {
    closeModal: () => void;
    forceCloseModal: () => void;
    field: DataDrivenInput
    fieldKeys: string[]
    isEdit:boolean
    templateFields: DataDrivenInput[]
    setFieldValue: (id: string, value: any) => void;
}

class TemplateConfigModalContent extends Component<TemplateConfigModalContentProps> {

  state = {
    defaultValueType: InputType.Text,
  };

  handleOnChange = (e, formikChange) => {
    formikChange(e);
  };

  handleOnFieldValueChange = (value, id, setFieldValue) => {
    setFieldValue(id, value);
  };

  handleOnTypeChange = (selectedItem, setFieldValue) => {
    this.setState({ defaultValueType: selectedItem.value });
    setFieldValue(InputProperty.Type, selectedItem);
    setFieldValue(InputProperty.DefaultValue, selectedItem.value === InputType.Boolean ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleOptionsChange = (values, setFieldValue) => {
    setFieldValue(InputProperty.Options, values);
  };

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  validateKey = (key) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  handleConfirm = (values) => {
    let field = clonedeep(values);
    field.type = field.type.value;
    const { templateFields, setFieldValue } = this.props;
    // Remove in case they are present if the user changed their mind
    if (field.type !== InputType.Select) {
      delete field.options;
    } else {
      // Create options in correct type for service - { key, value }
      field.options = field.options.map((field) => ({ key: field, value: field }));
    }

    if (field.type === InputType.Boolean) {
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
      case InputType.Boolean:
        return (
          <Toggle
            data-testid="toggle"
            id={InputProperty.DefaultValue}
            label="Default Value"
            helperText="Initial value that can be changed"
            onToggle={(value) =>
              this.handleOnFieldValueChange(value.toString(), InputProperty.DefaultValue, setFieldValue)
            }
            orientation="vertical"
            toggled={values.defaultValue === "true"}
          />
        );
      case InputType.Select:
        // If editing an option, values will be an array of { key, value}
        let options = clonedeep(values.options);
        return (
          <>
            <Creatable
              data-testid="creatable"
              id={InputProperty.Options}
              onChange={(createdItems) => this.handleOptionsChange(createdItems, setFieldValue)}
              label="Options"
              placeholder="Enter option"
              values={options || []}
            />
            <ComboBox
              data-testid="select"
              id={InputProperty.DefaultValue}
              onChange={({ selectedItem }) =>
                this.handleOnFieldValueChange(selectedItem, InputProperty.DefaultValue, setFieldValue)
              }
              items={options || []}
              initialSelectedItem={values.defaultValue || {}}
              label="Default Option"
            />
          </>
        );
      case InputType.TextArea:
        return (
          <TextArea
            data-testid="text-area"
            id={InputProperty.DefaultValue}
            labelText="Default Value (optional)"
            helperText="Initial value that can be changed"
            onBlur={handleBlur}
            onChange={(e) => this.handleOnChange(e, handleChange)}
            style={{ resize: "none" }}
            value={values.defaultValue || ""}
          />
        );
      case InputType.TextEditor:
      case InputType.TextEditorJs:
      case InputType.TextEditorText:
      case InputType.TextEditorShell:
      case InputType.TextEditorYaml:
        return (
          <TextEditorInput
            data-testid="texteditor"
            key="texteditor"
            id={InputProperty.DefaultValue}
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
            id={InputProperty.DefaultValue}
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
          [InputProperty.Key]: field?.key ?? "",
          [InputProperty.Label]: field?.label ?? "",
          [InputProperty.Description]: field?.description ?? "",
          [InputProperty.Placeholder]: field?.placeholder ?? "",
          [InputProperty.HelperText]: field?.helperText ?? "",
          [InputProperty.ReadOnly]: field?.readOnly ?? false,
          [InputProperty.Required]: field?.required ?? false,
          [InputProperty.Type]: field?.type ? inputTypeOptions.find((type) => type?.value === field.type) : {},
          [InputProperty.DefaultValue]: field?.defaultValue ?? "",
          // Read in values as an array of strings. Service returns object { key, value }
          [InputProperty.Options]:
            field?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
        }}
        validationSchema={Yup.object().shape({
          [InputProperty.Key]: Yup.string()
            .required("Enter a key")
            .max(64, "Key must not be greater than 64 characters")
            .notOneOf(fieldKeys || [], "Enter a unique key value for this workflow")
            .test(
              "is-valid-key",
              "Only alphanumeric, underscore, dash, and period characters allowed",
              this.validateKey
            ),
          [InputProperty.Label]: Yup.string()
            .required("Enter a Name")
            .max(64, "Name must not be greater than 64 characters"),
          [InputProperty.Description]: Yup.string().max(128, "Description must not be greater than 128 characters"),
          [InputProperty.Placeholder]: Yup.string().max(64, "Placeholder must not be greater than 64 characters"),
          [InputProperty.HelperText]: Yup.string().max(64, "Helper Text must not be greater than 128 characters"),
          [InputProperty.ReadOnly]: Yup.boolean(),
          [InputProperty.Required]: Yup.boolean(),
          [InputProperty.Type]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [InputProperty.Options]: Yup.array().when(InputProperty.Type, {
            is: (type) => type.value === InputType.Select,
            then: Yup.array().required("Enter an option").min(1, "Enter at least one option"),
          }),
          [InputProperty.DefaultValue]: this.determineDefaultValueSchema(defaultValueType),
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
            <ModalForm onSubmit={handleSubmit}>
              <ModalBody hasScrollingContent aria-label="inputs" className={styles.container}>
                <ComboBox
                  id={InputProperty.Type}
                  onChange={({ selectedItem }) =>
                    this.handleOnTypeChange(
                      selectedItem !== null ? selectedItem : { label: "", value: "" },
                      setFieldValue
                    )
                  }
                  items={inputTypeOptions}
                  initialSelectedItem={values.type}
                  itemToString={(item) => item && item.label}
                  placeholder="Select a type"
                  titleText="Type"
                />
                {!isEdit && (
                  <TextInput
                    helperText="Reference value for field in task template config"
                    id={InputProperty.Key}
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
                  id={InputProperty.Label}
                  invalid={errors.label && touched.label}
                  invalidText={errors.label}
                  labelText="Label"
                  placeholder="e.g. Email"
                  value={values.label}
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                />

                <TextInput
                  id={InputProperty.HelperText}
                  invalid={errors.helperText && touched.helperText}
                  invalidText={errors.helperText}
                  labelText="Helper Text (optional)"
                  helperText="Assist user in completing the field"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  value={values.helperText}
                />
                <TextInput
                  id={InputProperty.Description}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description (optional)"
                  helperText="Provide additional information about field to show in a tooltip"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  value={values.description}
                />
                <TextInput
                  id={InputProperty.Placeholder}
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
                  id={InputProperty.Required}
                  labelText="Required"
                  onToggle={(value) => this.handleOnFieldValueChange(value, InputProperty.Required, setFieldValue)}
                  orientation="vertical"
                  toggled={values.required}
                />
                <Toggle
                  id={InputProperty.ReadOnly}
                  labelText="Read Only"
                  onToggle={(value) => this.handleOnFieldValueChange(value, InputProperty.ReadOnly, setFieldValue)}
                  orientation="vertical"
                  toggled={values.readOnly}
                />
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button disabled={!isValid} type="submit">
                  {isEdit ? "Save" : "Create"}
                </Button>
              </ModalFooter>
            </ModalForm>
          );
        }}
      </Formik>
    );
  }
}

export default TemplateConfigModalContent;
