// @ts-nocheck
import React, { Component } from "react";
import {
  ComboBox,
  Creatable,
  Loading,
  TextArea,
  TextInput,
  Toggle,
  ModalFlowForm,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import clonedeep from "lodash/cloneDeep";
import { InputProperty, InputType, InputTypeCopy, WorkflowPropertyUpdateType, PROPERTY_KEY_REGEX } from "Constants";
import { DataDrivenInput, FormikSetFieldValue } from "Types";
import styles from "./PropertiesModalContent.module.scss";

const textInputItem = { label: InputTypeCopy[InputType.Text], value: InputType.Text };

const inputTypeItems = [
  { label: InputTypeCopy[InputType.Boolean], value: InputType.Boolean },
  { label: InputTypeCopy[InputType.Email], value: InputType.Email },
  { label: InputTypeCopy[InputType.Number], value: InputType.Number },
  { label: InputTypeCopy[InputType.Password], value: InputType.Password },
  { label: InputTypeCopy[InputType.Select], value: InputType.Select },
  { label: InputTypeCopy[InputType.Text], value: InputType.Text },
  { label: InputTypeCopy[InputType.TextArea], value: InputType.TextArea },
  { label: InputTypeCopy[InputType.URL], value: InputType.URL },
];

interface PropertiesModalContentProps {
  closeModal(): void;
  isEdit: boolean;
  isLoading: boolean;
  property: DataDrivenInput;
  propertyKeys: string[];
  updateWorkflowProperties: (args: { property: DataDrivenInput; type: string }) => Promise<any>;
}

class PropertiesModalContent extends Component<PropertiesModalContentProps> {
  state = {
    defaultValueType: "text",
  };

  handleOnFieldValueChange = (value: any, id: string, setFieldValue: FormikSetFieldValue) => {
    setFieldValue(id, value);
  };

  handleOnTypeChange = (selectedItem: any, setFieldValue: FormikSetFieldValue) => {
    this.setState({ defaultValueType: selectedItem.value });
    setFieldValue(InputProperty.Type, selectedItem);
    setFieldValue(InputProperty.DefaultValue, selectedItem.value === InputType.Boolean ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleOptionsChange = (values: [string], setFieldValue: (id: string, values: [string]) => void) => {
    setFieldValue(InputProperty.Options, values);
  };

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  validateKey = (key: string) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  handleConfirm = (values: DataDrivenInput) => {
    let property = clonedeep(values);
    property.type = property.type.value;

    // Remove in case they are present if the user changed their mind
    if (property.type !== InputType.Select) {
      delete property.options;
    } else {
      // Create options in correct type for service - { key, value }
      property.options = property?.options.map((property) => ({ key: property, value: property }));
    }

    if (property.type === InputType.Boolean) {
      if (!property.defaultValue) property.defaultValue = false;
    }

    if (this.props.isEdit) {
      this.props
        .updateWorkflowProperties({
          property,
          type: WorkflowPropertyUpdateType.Update,
        })
        .then(() => {
          this.props.closeModal();
        })
        .catch((e) => {});
    } else {
      this.props
        .updateWorkflowProperties({
          property,
          type: WorkflowPropertyUpdateType.Create,
        })
        .then(() => {
          this.props.closeModal();
        })
        .catch((e) => {});
    }
  };

  renderDefaultValue = (formikProps: FormikProps) => {
    const { values, handleBlur, handleChange, setFieldValue } = formikProps;

    switch (values?.type?.value) {
      case InputType.Boolean:
        return (
          <Toggle
            data-testid="toggle"
            id={InputProperty.DefaultValue}
            label="Default Value"
            onToggle={(value: string | boolean) =>
              this.handleOnFieldValueChange(value.toString(), InputProperty.DefaultValue, setFieldValue)
            }
            orientation="vertical"
            toggled={values?.defaultValue === "true"}
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
              onChange={(createdItems: any) => this.handleOptionsChange(createdItems, setFieldValue)}
              label="Options"
              placeholder="Enter option"
              values={options || []}
            />
            <ComboBox
              data-testid="select"
              id={InputProperty.DefaultValue}
              onChange={({ selectedItem }: any) =>
                this.handleOnFieldValueChange(selectedItem, InputProperty.DefaultValue, setFieldValue)
              }
              items={options || []}
              initialSelectedItem={values.defaultValue || {}}
              label="Default Option"
              placeholder="Select option"
            />
          </>
        );
      case InputType.TextArea:
        return (
          <TextArea
            data-testid="text-area"
            id={InputProperty.DefaultValue}
            labelText="Default Value"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Default Value"
            style={{ resize: "none" }}
            value={values.defaultValue || ""}
          />
        );
      default:
        // Fallback to text input here because it covers text, password, and url
        return (
          <TextInput
            data-testid="text-input"
            id={InputProperty.DefaultValue}
            labelText="Default Value"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Default Value"
            type={values.type.value}
            value={values.defaultValue || ""}
          />
        );
    }
  };

  determineDefaultValueSchema = (defaultType: string) => {
    switch (defaultType) {
      case InputType.Text:
      case InputType.TextArea:
      case InputType.Password:
        return Yup.string();
      case InputType.Boolean:
        return Yup.boolean();
      case InputType.Number:
        return Yup.number();
      case InputType.URL:
        return Yup.string().url("Enter a valid URL");
      case InputType.Email:
        return Yup.string().email("Enter a valid email");
      default:
        return Yup.mixed();
    }
  };

  render() {
    const { property, isEdit, propertyKeys, isLoading } = this.props;
    let defaultValueType = this.state.defaultValueType;

    return (
      <Formik
        validateOnMount
        onSubmit={this.handleConfirm}
        initialValues={{
          [InputProperty.Key]: property?.key ?? "",
          [InputProperty.Label]: property?.label ?? "",
          [InputProperty.Description]: property?.description ?? "",
          [InputProperty.Required]: property?.required ?? false,
          [InputProperty.Type]: property ? inputTypeItems.find((type) => type.value === property.type) : textInputItem,
          [InputProperty.DefaultValue]: property?.defaultValue ?? "",
          [InputProperty.JsonPath]: property?.jsonPath ?? "",
          // Read in values as an array of strings. Service returns object { key, value }
          [InputProperty.Options]:
            property?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
        }}
        validationSchema={Yup.object().shape({
          [InputProperty.Key]: Yup.string()
            .required("Enter a key")
            .max(128, "Key must not be greater than 128 characters")
            .notOneOf(propertyKeys || [], "Enter a unique key value for this workflow")
            .test(
              "is-valid-key",
              "Only alphanumeric, underscore, dash, and period characters allowed",
              this.validateKey
            ),
          [InputProperty.Label]: Yup.string()
            .required("Enter a Name")
            .max(128, "Name must not be greater than 128 characters"),
          [InputProperty.Description]: Yup.string().max(128, "Description must not be greater than 128 characters"),
          [InputProperty.Required]: Yup.boolean(),
          [InputProperty.Type]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [InputProperty.Options]: Yup.array().when(InputProperty.Type, {
            is: (type) => type.value === InputType.Select,
            then: Yup.array().required("Enter an option").min(1, "Enter at least one option"),
          }),
          [InputProperty.DefaultValue]: this.determineDefaultValueSchema(defaultValueType),
          [InputProperty.JsonPath]: Yup.string(),
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
            <ModalFlowForm onSubmit={handleSubmit} disabled={isLoading}>
              <ModalBody aria-label="inputs" className={styles.container}>
                {isLoading && <Loading />}
                <TextInput
                  readOnly={isEdit}
                  helperText="Reference value for property in workflow. It can't be changed after property creation."
                  id={InputProperty.Key}
                  invalid={errors.key && touched.key}
                  invalidText={errors.key}
                  labelText={isEdit ? "Key (read-only)" : "Key"}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder=".e.g. token"
                  value={values.key}
                />
                <ComboBox
                  id={InputProperty.Type}
                  onChange={({ selectedItem }: any) =>
                    this.handleOnTypeChange(
                      selectedItem !== null ? selectedItem : { label: "", value: "" },
                      setFieldValue
                    )
                  }
                  items={inputTypeItems}
                  initialSelectedItem={values.type}
                  itemToString={(item: { label: string }) => item && item.label}
                  placeholder="Select an item"
                  titleText="Type"
                />
                <TextInput
                  id={InputProperty.Label}
                  invalid={errors.label && touched.label}
                  invalidText={errors.label}
                  labelText="Label"
                  placeholder="e.g. Token"
                  value={values.label}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <TextInput
                  id={InputProperty.Description}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
                <TextInput
                  id={InputProperty.JsonPath}
                  invalid={errors.jsonPath && touched.jsonPath}
                  invalidText={errors.jsonPath}
                  labelText="Event Payload JsonPath"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.jsonPath}
                  placeholder="e.g. $.repository.image[2]"
                  helperText="Retrieves value matching dot notation path in the event payload"
                />
                <Toggle
                  data-testid="toggle-test-id"
                  id={InputProperty.Required}
                  labelText="Required"
                  onToggle={(value: string) =>
                    this.handleOnFieldValueChange(value, InputProperty.Required, setFieldValue)
                  }
                  orientation="vertical"
                  toggled={values.required}
                />

                {this.renderDefaultValue(formikProps)}
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button disabled={!isValid || isLoading} type="submit" data-testid="property-modal-confirm-button">
                  {isEdit ? (isLoading ? "Saving..." : "Save") : isLoading ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default PropertiesModalContent;
