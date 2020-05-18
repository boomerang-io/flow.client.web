import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ComboBox,
  Creatable,
  Loading,
  TextArea,
  TextInput,
  Toggle,
  ModalFlowForm,
} from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { Formik } from "formik";
import ValidateFormikOnMount from "Components/ValidateFormikOnMount";
import * as Yup from "yup";
import clonedeep from "lodash/cloneDeep";
import INPUT_TYPES from "Constants/workflowInputTypes";
import WORKFLOW_PROPERTY_UPDATE_TYPES from "Constants/workflowPropertyUpdateTypes";
import styles from "./WorkflowPropertiesModalContent.module.scss";

const FIELD = {
  KEY: "key",
  DESCRIPTION: "description",
  LABEL: "label",
  REQUIRED: "required",
  TYPE: "type",
  DEFAULT_VALUE: "defaultValue",
  OPTIONS: "options",
};

const INPUT_TYPES_LABELS = [
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Password", value: "password" },
  { label: "Select", value: "select" },
  { label: "Text", value: "text" },
  { label: "Text Area", value: "textarea" },
];

class WorkflowPropertiesModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    property: PropTypes.object,
    propertyKeys: PropTypes.array,
    isEdit: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    updateWorkflowProperties: PropTypes.func.isRequired,
  };

  state = {
    defaultValueType: "text",
  };

  handleOnChange = (e, formikChange) => {
    this.props.setShouldConfirmModalClose(true);
    formikChange(e);
  };

  handleOnFieldValueChange = (value, id, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(id, value);
  };

  handleOnTypeChange = (selectedItem, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    this.setState({ defaultValueType: selectedItem.value });
    setFieldValue(FIELD.TYPE, selectedItem);
    setFieldValue(FIELD.DEFAULT_VALUE, selectedItem.value === INPUT_TYPES.BOOLEAN ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleOptionsChange = (values, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(FIELD.OPTIONS, values);
  };

  /* Check if key contains space or special characters, only underline is allowed */
  validateKey = (key) => {
    const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_|/.]");
    return !regexp.test(key);
  };

  handleConfirm = (values) => {
    let property = clonedeep(values);
    property.type = property.type.value;

    // Remove in case they are present if the user changed their mind
    if (property.type !== INPUT_TYPES.SELECT) {
      delete property.options;
    } else {
      // Create options in correct type for service - { key, value }
      property.options = property.options.map((property) => ({ key: property, value: property }));
    }

    if (property.type === INPUT_TYPES.BOOLEAN) {
      if (!property.defaultValue) property.defaultValue = false;
    }

    if (this.props.isEdit) {
      this.props
        .updateWorkflowProperties({
          property,
          type: WORKFLOW_PROPERTY_UPDATE_TYPES.UPDATE,
        })
        .then(() => {
          this.props.forceCloseModal();
        });
    } else {
      this.props
        .updateWorkflowProperties({
          property,
          type: WORKFLOW_PROPERTY_UPDATE_TYPES.CREATE,
        })
        .then(() => {
          this.props.forceCloseModal();
        });
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
              placeholder="Select option"
            />
          </>
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <TextArea
            data-testid="text-area"
            id={FIELD.DEFAULT_VALUE}
            labelText="Default Value"
            onBlur={handleBlur}
            onChange={(e) => this.handleOnChange(e, handleChange)}
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
            id={FIELD.DEFAULT_VALUE}
            labelText="Default Value"
            onBlur={handleBlur}
            onChange={(e) => this.handleOnChange(e, handleChange)}
            placeholder="Default Value"
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
    const { property, isEdit, propertyKeys, loading } = this.props;
    let defaultValueType = this.state.defaultValueType;

    return (
      <Formik
        onSubmit={this.handleConfirm}
        initialValues={{
          [FIELD.KEY]: property?.key ?? "",
          [FIELD.LABEL]: property?.label ?? "",
          [FIELD.DESCRIPTION]: property?.description ?? "",
          [FIELD.REQUIRED]: property?.required ?? false,
          [FIELD.TYPE]: property
            ? INPUT_TYPES_LABELS.find((type) => type.value === property.type)
            : INPUT_TYPES_LABELS[4],
          [FIELD.DEFAULT_VALUE]: property?.defaultValue ?? "",
          // Read in values as an array of strings. Service returns object { key, value }
          [FIELD.OPTIONS]: property?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
        }}
        validationSchema={Yup.object().shape({
          [FIELD.KEY]: Yup.string()
            .required("Enter a key")
            .max(64, "Key must not be greater than 64 characters")
            .notOneOf(propertyKeys || [], "Enter a unique key value for this workflow")
            .test("is-valid-key", "Space and special characters not allowed", this.validateKey),
          [FIELD.LABEL]: Yup.string()
            .required("Enter a Name")
            .max(64, "Name must not be greater than 64 characters"),
          [FIELD.DESCRIPTION]: Yup.string().max(64, "Description must not be greater than 64 characters"),
          [FIELD.REQUIRED]: Yup.boolean(),
          [FIELD.TYPE]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [FIELD.OPTIONS]: Yup.array().when(FIELD.TYPE, {
            is: (type) => type.value === INPUT_TYPES.SELECT,
            then: Yup.array()
              .required("Enter an option")
              .min(1, "Enter at least one option"),
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
            <ModalFlowForm onSubmit={handleSubmit} disabled={loading}>
              <ModalBody className={styles.container}>
                {loading && <Loading />}
                <TextInput
                  id={FIELD.LABEL}
                  invalid={errors.label && touched.label}
                  invalidText={errors.label}
                  labelText="Name"
                  placeholder="Name"
                  value={values.label}
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                />
                {!isEdit && (
                  <TextInput
                    helperText="Reference value for property in workflow"
                    id={FIELD.KEY}
                    invalid={errors.key && touched.key}
                    invalidText={errors.key}
                    labelText="Key"
                    onBlur={handleBlur}
                    onChange={(e) => this.handleOnChange(e, handleChange)}
                    placeholder="key.value"
                    value={values.key}
                  />
                )}

                <TextInput
                  id={FIELD.DESCRIPTION}
                  invalid={errors.description && touched.description}
                  invalidText={errors.description}
                  labelText="Description"
                  onBlur={handleBlur}
                  onChange={(e) => this.handleOnChange(e, handleChange)}
                  placeholder="Description"
                  value={values.description}
                />

                <Toggle
                  data-testid="toggle-test-id"
                  id={FIELD.REQUIRED}
                  labelText="Required"
                  onToggle={(value) => this.handleOnFieldValueChange(value, FIELD.REQUIRED, setFieldValue)}
                  orientation="vertical"
                  toggled={values.required}
                />

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
                  placeholder="Select an item"
                  titleText="Type"
                  data-testid="input-type"
                />

                {this.renderDefaultValue(formikProps)}
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button data-testid="inputs-modal-confirm-button" disabled={!isValid || loading} type="submit">
                  {isEdit ? (loading ? "Saving..." : "Save") : loading ? "Creating" : "Create"}
                </Button>
              </ModalFooter>
              <ValidateFormikOnMount validateForm={formikProps.validateForm} />
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default WorkflowPropertiesModalContent;
