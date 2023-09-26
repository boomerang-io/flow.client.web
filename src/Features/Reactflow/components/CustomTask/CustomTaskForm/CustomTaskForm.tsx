import React from "react";
import * as Yup from "yup";
import {
  AutoSuggest,
  Creatable,
  DynamicFormik,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import TextEditorModal from "Components/TextEditorModal";
import { SUPPORTED_AUTOSUGGEST_TYPES, TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { TaskTemplate, WorkflowNode } from "Types";
import styles from "./CustomTaskForm.module.scss";

const AutoSuggestInput = (props: any) => {
  if (!SUPPORTED_AUTOSUGGEST_TYPES.includes(props.type)) {
    return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  }

  return (
    <div key={props.id}>
      <AutoSuggest
        {...props}
        initialValue={Boolean(props?.initialValue) ? props?.initialValue : props?.inputProps?.defaultValue}
      >
        <TextInput tooltipContent={props.tooltipContent} disabled={props?.inputProps?.readOnly} />
      </AutoSuggest>
    </div>
  );
};

const TextAreaSuggestInput = (props: any) => {
  return (
    <div key={props.id}>
      <AutoSuggest
        {...props}
        initialValue={props?.initialValue !== "" ? props?.initialValue : props?.item?.defaultValue}
      >
        <TextArea
          disabled={props?.item?.readOnly}
          helperText={props?.item?.helperText}
          id={`['${props.id}']`}
          labelText={props?.label}
          placeholder={props?.item?.placeholder}
          tooltipContent={props.tooltipContent}
        />
      </AutoSuggest>
    </div>
  );
};

const TextEditorInput = (props: any) => {
  return <TextEditorModal {...props} {...props.item} />;
};

const TaskNameTextInput = ({ formikProps, ...otherProps }: any) => {
  const { errors, touched } = formikProps;
  const error = errors[otherProps.id];
  const touch = touched[otherProps.id];
  return (
    <>
      <TextInput
        {...otherProps}
        invalid={error && touch}
        id={`['${otherProps.id}']`}
        invalidText={error}
        onChange={formikProps.handleChange}
      />
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Specifics</h2>
    </>
  );
};

function formatAutoSuggestProperties(inputProperties: Array<string>) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

interface CustomTaskFormProps {
  closeModal: () => void;
  inputProperties: Array<string>;
  node: WorkflowNode["data"];
  onSave: (...args: any) => void;
  textEditorProps: any;
  task: TaskTemplate;
  taskNames: Array<string>;
}

function CustomTaskForm(props: CustomTaskFormProps) {
  const { node, taskNames, task } = props;

  const handleOnSave = (values) => {
    const { results, ...rest } = values;
    const formattedOutputs: Array<Record<string, string>> = [];
    results.forEach((result) => {
      let index = result.indexOf(":");
      formattedOutputs.push({ name: result.slice(0, index), description: result.slice(index + 1) });
    });

    props.onSave({ inputs: rest, results: formattedOutputs });
    props.closeModal();
  };

  const textAreaProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      inputProperties: props.inputProperties,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

  const textEditorProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      inputProperties: props.inputProperties,
      item: input,
      ...props.textEditorProps,
      ...itemConfig,
      ...rest,
    };
  };

  const textInputProps = ({ formikProps, input }) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestProperties(props.inputProperties),
      onChange: (value: any) => setFieldValue(`['${key}']`, value),
      initialValue: values[key],
      inputProps: {
        id: `['${key}']`,
        onBlur: handleBlur,
        invalid: touched[`['${key}']`] && errors[`['${key}']`],
        invalidText: errors[`['${key}']`],
        ...rest,
      },
    };
  };

  const toggleProps = () => {
    return {
      orientation: "vertical",
    };
  };

  const takenTaskNames = taskNames.filter((name) => name !== node.name);

  const ResultsInput = ({ formikProps, ...otherProps }) => {
    return (
      <>
        <hr className={styles.divider} />
        <h2 className={styles.inputsTitle}>Result Parameters</h2>
        <Creatable
          {...otherProps}
          createKeyValuePair
          keyLabelText="Name"
          valueLabelText="Description"
          onChange={(value) => formikProps.setFieldValue("results", value)}
        />
      </>
    );
  };

  const taskVersionConfig = task.config;

  // Add the name and future inputs
  const inputs = [
    {
      key: "taskName",
      id: "taskName",
      label: "Task Name",
      placeholder: "Enter a task name",
      type: "custom",
      required: true,
      customComponent: TaskNameTextInput,
    },
    ...taskVersionConfig,
    {
      results: task?.results,
      key: "results",
      type: "custom",
      customComponent: ResultsInput,
    },
  ];

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        results: Yup.array(),
      })}
      initialValues={{
        taskName: node.name,
        results: task?.results?.map((output) => `${output?.name}:${output?.description}`) ?? [],
      }}
      inputs={inputs}
      onSubmit={handleOnSave}
      dataDrivenInputProps={{
        TextInput: AutoSuggestInput,
        TextEditor: TextEditorInput,
        TextArea: TextAreaSuggestInput,
      }}
      textAreaProps={textAreaProps}
      textEditorProps={textEditorProps}
      textInputProps={textInputProps}
      toggleProps={toggleProps}
    >
      {({ inputs, formikProps }) => (
        <ModalForm noValidate className={styles.container} onSubmit={formikProps.handleSubmit}>
          <ModalBody aria-label="inputs">{inputs}</ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formikProps.isValid}>
              Apply
            </Button>
          </ModalFooter>
        </ModalForm>
      )}
    </DynamicFormik>
  );
}

export default CustomTaskForm;
