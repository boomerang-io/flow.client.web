// @ts-nocheck
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
import { FormikProps } from "formik";
import { DataDrivenInput } from "Types";
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

interface TextEditorInputProps extends DataDrivenInput {
  autoSuggestions: string[];
  initialValue: any;
  item?: { description: string; label: string };
  formikSetFieldValue: (key: string, value: string) => void;
  style: {};
  value: any;
}

const TextEditorInput: React.FC<TextEditorInputProps> = (props) => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      {
        //@ts-ignore
        <TextEditorModal {...props} {...props.item} />
      }
    </div>
  );
};

interface TemplateConfigModalContentProps {
  closeModal: () => void;
  forceCloseModal: () => void;
  field: DataDrivenInput;
  fieldKeys: string[];
  isEdit: boolean;
  templateFields: DataDrivenInput[];
  setFieldValue: (id: string, value: any) => void;
}

class TemplateConfigModalContent extends Component<TemplateConfigModalContentProps> {
  state = {
    defaultValueType: InputType.Text,
  };

  handleOnTypeChange = (value: any, setFieldValue: (key: string, value: any) => void) => {
    this.setState({ defaultValueType: value });
    setFieldValue(InputProperty.Type, value);
    setFieldValue(InputProperty.DefaultValue, value === InputType.Boolean ? false : undefined);
  };

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  validateKey = (key: string) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  handleConfirm = (values: any) => {
    let field = clonedeep(values);
    const { templateFields, setFieldValue } = this.props;
    // Remove in case they are present if the user changed their mind
    if (field.type !== InputType.Select) {
      delete field.options;
    } else {
      // Create options in correct type for service - { key, value }
      field.options = field.options.map((field: string) => ({ key: field, value: field }));
    }

    if (field.type === InputType.Boolean) {
      if (!field.defaultValue) field.defaultValue = false;
    }
    if (this.props.isEdit) {
      const fieldIndex = templateFields.findIndex((field) => field.key === this.props.field.key);
      let newProperties = [...templateFields];
      newProperties.splice(fieldIndex, 1, field);
      setFieldValue("currentConfig", newProperties);
      this.props.forceCloseModal();
    } else {
      let newProperties = [...templateFields];
      newProperties.push(field);
      setFieldValue("currentConfig", newProperties);
      this.props.forceCloseModal();
    }
  };

  renderDefaultValue = (formikProps: FormikProps<{ [x: string]: string | boolean | string[] }>) => {
    const { values, handleBlur, handleChange, setFieldValue } = formikProps;
    switch (values?.type) {
      case InputType.Boolean:
        return (
          <Toggle
            data-testid="toggle"
            id={InputProperty.DefaultValue}
            label="Default Value"
            helperText="Initial value that can be changed"
            onToggle={(value: any) => setFieldValue(InputProperty.DefaultValue, value.toString())}
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
              onChange={(createdItems: string[]) => setFieldValue(InputProperty.Options, createdItems)}
              label="Options"
              placeholder="Enter option"
              values={options || []}
            />
            <ComboBox
              data-testid="select"
              id={InputProperty.DefaultValue}
              onChange={({ selectedItem }: { selectedItem: string }) =>
                setFieldValue(selectedItem, InputProperty.DefaultValue)
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
            formikSetFieldValue={(value: string) => setFieldValue("defaultValue", value)}
            initialValue={values.defaultValue}
            type={values.type}
            value={values.defaultValue}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
            type={values.type}
            value={values.defaultValue || ""}
          />
        );
    }
  };

  determineDefaultValueSchema = (defaultType: string) => {
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
          [InputProperty.Type]: field?.type ?? "",
          [InputProperty.DefaultValue]: field?.defaultValue ?? "",
          // Read in values as an array of strings. Service returns object { key, value }
          [InputProperty.Options]:
            field?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
        }}
        validationSchema={Yup.object().shape({
          [InputProperty.Key]: Yup.string()
            .required("Enter a key")
            .max(64, "Key must not be greater than 64 characters")
            .notOneOf(fieldKeys || [], "Enter a unique key value for this field")
            .test(
              "is-valid-key",
              "Only alphanumeric, hyphen and underscore characters allowed. Must begin with a letter or underscore",
              this.validateKey
            ),
          [InputProperty.Label]: Yup.string()
            .required("Enter a Name")
            .max(64, "Name must not be greater than 64 characters"),
          [InputProperty.Description]: Yup.string().max(200, "Description must not be greater than 200 characters"),
          [InputProperty.Placeholder]: Yup.string().max(100, "Placeholder must not be greater than 100 characters"),
          [InputProperty.HelperText]: Yup.string().max(50, "Helper Text must not be greater than 50 characters"),
          [InputProperty.ReadOnly]: Yup.boolean(),
          [InputProperty.Required]: Yup.boolean(),
          [InputProperty.Type]: Yup.string().required(),
          [InputProperty.Options]: Yup.array().when(InputProperty.Type, {
            is: (type) => type === InputType.Select,
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
              <ModalBody aria-label="inputs" className={styles.container}>
                <ComboBox
                  id={InputProperty.Type}
                  onChange={({ selectedItem }: { selectedItem: { label: string; value: string } }) =>
                    this.handleOnTypeChange(selectedItem !== null ? selectedItem.value : "", setFieldValue)
                  }
                  items={inputTypeOptions}
                  initialSelectedItem={inputTypeOptions.find((option) => option.value === values.type)}
                  itemToString={(item: { label: string }) => item && item.label}
                  placeholder="Select a type"
                  titleText="Type"
                />
                <TextInput
                  helperText="Reference value for field in task template config"
                  id={InputProperty.Key}
                  invalid={errors.key && touched.key}
                  invalidText={errors.key}
                  labelText="Key"
                  disabled={isEdit}
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  placeholder="e.g. email"
                  value={values.key}
                />
                <TextInput
                  id={InputProperty.Label}
                  invalid={errors.label && touched.label}
                  invalidText={errors.label}
                  labelText="Label"
                  placeholder="e.g. Email"
                  value={values.label}
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                />
                <TextInput
                  id={InputProperty.HelperText}
                  invalid={errors.helperText && touched.helperText}
                  invalidText={errors.helperText}
                  labelText="Helper Text (optional)"
                  helperText="Assist user in completing the field"
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  value={values.helperText}
                />
                <TextInput
                  id={InputProperty.Description}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description (optional)"
                  helperText="Provide additional information about field to show in a tooltip"
                  onBlur={handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                  value={values.description}
                />
                {InputType.Boolean !== values.type && (
                  <TextInput
                    id={InputProperty.Placeholder}
                    invalid={errors.placeholder && touched.placeholder}
                    invalidText={errors.placeholder}
                    labelText="Placeholder (optional)"
                    helperText="Give the user a hint for the field value"
                    onBlur={handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                    value={values.placeholder}
                  />
                )}
                {this.renderDefaultValue(formikProps)}
                <Toggle
                  id={InputProperty.Required}
                  labelText="Required"
                  onToggle={(value: string) => setFieldValue(InputProperty.Required, value)}
                  orientation="vertical"
                  toggled={values.required}
                />
                <Toggle
                  id={InputProperty.ReadOnly}
                  labelText="Read-only"
                  onToggle={(value: string) => setFieldValue(InputProperty.ReadOnly, value)}
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
