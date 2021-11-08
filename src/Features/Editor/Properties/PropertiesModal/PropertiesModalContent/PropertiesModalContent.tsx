// @ts-nocheck
import React, { Component } from "react";
import {
  Button,
  ComboBox,
  ComboBoxMultiSelect,
  Creatable,
  DateInput,
  Loading,
  ModalBody,
  ModalFooter,
  TextArea,
  TextInput,
  Toggle,
  ModalFlowForm,
} from "@boomerang-io/carbon-addons-boomerang-react";
import {} from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import clonedeep from "lodash/cloneDeep";
import { InputProperty, InputType, InputTypeCopy, WorkflowPropertyUpdateType, PROPERTY_KEY_REGEX } from "Constants";
import { DataDrivenInput, FormikSetFieldValue } from "Types";
import { Launch20 } from "@carbon/icons-react";
import styles from "./PropertiesModalContent.module.scss";

const textInputItem = { label: InputTypeCopy[InputType.Text], value: InputType.Text };

const inputTypeItems = [
  { label: InputTypeCopy[InputType.Boolean], value: InputType.Boolean },
  { label: InputTypeCopy[InputType.CreatablePair], value: InputType.CreatablePair },
  { label: InputTypeCopy[InputType.CreatableSingle], value: InputType.CreatableSingle },
  { label: InputTypeCopy[InputType.Date], value: InputType.Date },
  { label: InputTypeCopy[InputType.DateRange], value: InputType.DateRange },
  { label: InputTypeCopy[InputType.Email], value: InputType.Email },
  { label: InputTypeCopy[InputType.MultiSelect], value: InputType.MultiSelect },
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

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  validateKey = (key: string) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  handleConfirm = (values: DataDrivenInput) => {
    let property = clonedeep(values);
    property.type = property.type.value;

    if (property.type !== InputType.Date && property.type !== InputType.DateRange) {
      delete property[InputProperty.DateFormat];
    }

    // Remove in case they are present if the user changed their mind
    if (property.type !== InputType.Select && property.type !== InputType.MultiSelect) {
      delete property.options;
    } else {
      // Create options in correct type for service - { key, value }
      property.options = property.options.map((option) => {
        let propertyKeyLabel = option.split(":");
        return { key: propertyKeyLabel[0], value: propertyKeyLabel[1] };
      });
    }

    if (property.type === InputType.MultiSelect) {
      if (property.defaultValue) {
        const defaultKeys = property.defaultValue.split(",");
        let defaultOptionLabel = [];
        property.options.forEach((option) => {
          if (defaultKeys.some((key) => key === option.key)) {
            defaultOptionLabel.push(option.value);
          }
        });
        property.defaultOptionLabel = defaultOptionLabel.join();
      }
    }

    if (property.type === InputType.Boolean) {
      if (!property.defaultValue) property.defaultValue = false;
    }

    if (property.type !== InputType.CreatableSingle && property.type !== InputType.CreatablePair) {
      delete property.max;
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

    // If editing an option, values will be an array of { key, value}
    let options = [];
    let keyValueOptions = [];
    if (Array.isArray(values.options)) {
      options = clonedeep(values.options);
      keyValueOptions =
        options.map((option) => {
          let keyLabel = option.split(":");
          return { key: keyLabel[0], value: keyLabel[1] };
        }) ?? [];
    }

    const type = values?.type?.value;

    switch (type) {
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
      case InputType.CreatableSingle:
      case InputType.CreatablePair:
        const isPair = type === InputType.CreatablePair;
        return (
          <Creatable
            data-testid="creatable"
            id={isPair ? `${InputProperty.DefaultValue}-pair` : InputProperty.DefaultValue}
            onChange={(createdItems) => setFieldValue(InputProperty.DefaultValue, createdItems?.join() ?? "")}
            label="Default Value"
            keyLabelText="Default Value"
            helperText="Initial value that can be changed"
            value={values.defaultValue || null}
            max={values.max}
            createKeyValuePair={isPair}
          />
        );
      case InputType.Date:
        return (
          <DateInput
            data-testid="date-input"
            id={InputProperty.DefaultValue}
            label="Default Value"
            helperText="Initial value that can be changed"
            onChange={handleChange}
            onCalendarChange={(dateArray) => setFieldValue(InputProperty.DefaultValue, dateArray[0]?.toISOString())}
            dateFormat={values.dateFormat}
            value={values.defaultValue}
          />
        );
      case InputType.DateRange:
        return (
          <DateInput
            data-testid="date-input"
            id={`${InputProperty.DefaultValue}-date-range`}
            label="Default Value"
            helperText="Initial value that can be changed"
            onChange={(dateArray) => {
              const isoDates = Array.isArray(dateArray) ? dateArray.map((date) => date.toISOString()).join() : "";
              setFieldValue(InputProperty.DefaultValue, isoDates);
            }}
            dateFormat={values.dateFormat}
            value={values.defaultValue}
            type={InputType.DateRange}
          />
        );
      case InputType.Select:
        let keyValueDefaultOption = keyValueOptions.find((option) => option.key === values.defaultValue);
        return (
          <>
            <Creatable
              data-testid="creatable"
              id={InputProperty.Options}
              onChange={(createdItems) => {
                if (Boolean(values.defaultValue) && !createdItems.includes(values.defaultValue)) {
                  setFieldValue(InputProperty.DefaultValue, "");
                }
                setFieldValue(InputProperty.Options, createdItems);
              }}
              values={options || []}
              createKeyValuePair
              keyLabel="Option key"
              valueLabel="Option label"
            />
            <ComboBox
              data-testid="select"
              id={InputProperty.DefaultValue}
              itemToString={(item) => item?.value}
              onChange={({ selectedItem }) => setFieldValue(InputProperty.DefaultValue, selectedItem?.key)}
              items={keyValueOptions}
              initialSelectedItem={keyValueDefaultOption}
              selectedItem={keyValueDefaultOption}
              shouldFilterItem={({ item, inputValue }) => {
                if (item?.value) {
                  return item.value.toLowerCase().includes(inputValue?.toLowerCase());
                }

                return item;
              }}
              label="Default Option"
            />
          </>
        );
      case InputType.MultiSelect:
        let keyValueDefaultOptions = [];

        if (typeof values.defaultValue === "string" && values.defaultValue.length) {
          const defaultOptionsKeys = values.defaultValue.split(",");
          keyValueDefaultOptions = keyValueOptions.filter((option) =>
            defaultOptionsKeys.some((defaultOptionKey) => defaultOptionKey === option.key)
          );
        }

        return (
          <>
            <Creatable
              data-testid="creatable"
              id={InputProperty.Options}
              onChange={(createdItems) => {
                if (typeof values.defaultValue === "string" && values.defaultValue.length) {
                  const defaultOptionsKeys = values.defaultValue.split(",");
                  const newDefaultValues = defaultOptionsKeys.filter((defaultValue) =>
                    createdItems.some((createdItem) => createdItem.split(":")[0] === defaultValue)
                  );
                  setFieldValue(InputProperty.DefaultValue, newDefaultValues.join());
                }
                setFieldValue(InputProperty.Options, createdItems);
              }}
              values={options || []}
              createKeyValuePair
              keyLabel="Option key"
              valueLabel="Option label"
            />
            <ComboBoxMultiSelect
              data-testid="mulitiselect"
              id={InputProperty.DefaultValue}
              items={keyValueOptions}
              itemToString={(item) => item?.value}
              onChange={({ selectedItems }) => {
                const selectedItemsString = Array.isArray(selectedItems)
                  ? selectedItems.map((selectedItem) => selectedItem.key).join()
                  : "";
                setFieldValue(InputProperty.DefaultValue, selectedItemsString);
              }}
              selectedItems={keyValueDefaultOptions}
              initialSelectedItems={keyValueDefaultOptions}
              shouldFilterItem={({ item, inputValue }) => {
                if (item?.value) {
                  return (
                    item.value.toLowerCase().includes(inputValue?.toLowerCase()) &&
                    !keyValueDefaultOptions.some((option) => option.value === item.value)
                  );
                }

                return item;
              }}
              label="Default Options"
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
      case InputType.Date:
        return Yup.date();
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
          [InputProperty.DateFormat]: property?.dateFormat ?? "Y-m-d",
          [InputProperty.DefaultValue]: property?.defaultValue ?? "",
          [InputProperty.Description]: property?.description ?? "",
          [InputProperty.JsonPath]: property?.jsonPath ?? "",
          [InputProperty.Key]: property?.key ?? "",
          [InputProperty.Label]: property?.label ?? "",
          [InputProperty.Max]: property?.max ?? 0,
          // Read in values as an array of strings. Service returns object { key, value }
          [InputProperty.Options]:
            property?.type === InputType.Select || property?.type === InputType.MultiSelect
              ? property?.options?.map((option) => `${option.key}:${option.value}`)
              : property?.options?.map((option) => (typeof option === "object" ? option.key : option)) ?? [],
          [InputProperty.Required]: property?.required ?? false,
          [InputProperty.Type]: property ? inputTypeItems.find((type) => type.value === property.type) : textInputItem,
        }}
        validationSchema={Yup.object().shape({
          [InputProperty.Key]: Yup.string()
            .required("Enter a key")
            .max(128, "Key must not be greater than 128 characters")
            .notOneOf(propertyKeys || [], "Enter a unique key value for this workflow")
            .test(
              "is-valid-key",
              "Only alphanumeric, hyphen and underscore characters allowed. Must begin with a letter or underscore",
              this.validateKey
            ),
          [InputProperty.Label]: Yup.string()
            .required("Enter a Name")
            .max(128, "Name must not be greater than 128 characters"),
          [InputProperty.Description]: Yup.string().max(128, "Description must not be greater than 128 characters"),
          [InputProperty.Required]: Yup.boolean(),
          [InputProperty.Type]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [InputProperty.Options]: Yup.array().when(InputProperty.Type, {
            is: (type) => type === InputType.Select || type === InputType.MultiSelect,
            then: Yup.array().required("Enter an option").min(1, "Enter at least one option"),
          }),
          [InputProperty.DefaultValue]: this.determineDefaultValueSchema(defaultValueType),
          [InputProperty.JsonPath]: Yup.string(),
        })}
      >
        {(formikProps) => {
          const {
            dirty,
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
                  helperText="Reference value for parameter in workflow. It can't be changed after parameter creation."
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
                  labelText="Description (optional)"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                />
                <TextInput
                  id={InputProperty.JsonPath}
                  invalid={errors.jsonPath && touched.jsonPath}
                  invalidText={errors.jsonPath}
                  labelText="Event Payload JsonPath (optional)"
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
                {values.type?.value.includes("creatable") && (
                  <TextInput
                    data-testid="text-input"
                    id={InputProperty.Max}
                    labelText="Values Limit"
                    helperText="Specify 0 for no limit to how many values a user can provide"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      if (
                        e.target.valueAsNumber < values.defaultValue?.split(",").length &&
                        e.target.valueAsNumber > 0
                      ) {
                        setFieldValue(InputProperty.DefaultValue, "");
                      }
                    }}
                    type="number"
                    value={values.max}
                    min={0}
                  />
                )}
                {values.type?.value.includes(InputType.Date) && (
                  <TextInput
                    id={InputProperty.DateFormat}
                    invalid={errors.dateFormat && touched.dateFormat}
                    invalidText={errors.dateFormat}
                    labelText="Date format"
                    helperText={
                      <p className={styles.dateFormat}>
                        Provide a date format following
                        <a
                          className={styles.flatpickrLink}
                          rel="noopener noreferrer"
                          target="_blank"
                          href="https://flatpickr.js.org/formatting/"
                        >
                          flatpickr docs
                          <Launch20 className={styles.flatpickrIcon} />
                        </a>
                      </p>
                    }
                    placeholder="e.g. Y-m-d"
                    onBlur={handleBlur}
                    onChange={(e) => handleChange(e)}
                    value={values.dateFormat}
                  />
                )}
                {this.renderDefaultValue(formikProps)}
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" onClick={this.props.closeModal} type="button">
                  Cancel
                </Button>
                <Button
                  disabled={!isValid || !dirty || isLoading}
                  type="submit"
                  data-testid="parameter-modal-confirm-button"
                >
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
