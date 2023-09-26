import React, { Component } from "react";
import * as Yup from "yup";
import {
  AutoSuggest,
  DynamicFormik,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Tag } from "@carbon/react";
import TextEditorModal from "Components/TextEditorModal";
import { SUPPORTED_AUTOSUGGEST_TYPES, TEXT_AREA_TYPES } from "Constants/formInputTypes";
import styles from "./TaskForm.module.scss";
import { TaskTemplate, WorkflowNodeData } from "Types";

const AutoSuggestInput = (props: any) => {
  if (!SUPPORTED_AUTOSUGGEST_TYPES.includes(props.type)) {
    return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  }

  return (
    <div key={props.id}>
      <AutoSuggest
        {...props}
        initialValue={props?.initialValue !== "" ? props?.initialValue : props?.inputProps?.defaultValue}
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

const TaskNameTextInput = ({ formikProps, ...otherProps }) => {
  const { errors, touched } = formikProps;
  const error = errors[otherProps.id];
  const touch = touched[otherProps.id];
  return (
    <>
      <TextInput {...otherProps} invalid={error && touch} invalidText={error} onChange={formikProps.handleChange} />
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Specifics</h2>
    </>
  );
};

const ResultsInput = (props: { formikProps: any; results: TaskTemplate["results"] }) => {
  console.log({ props });
  const { results } = props;
  if (!results || results.length === 0) return null;
  else
    return (
      <>
        <hr className={styles.divider} />
        <h2 className={styles.inputsTitle}>Result Parameters</h2>
        <div className={styles.resultParamsContainer}>
          {results.map((result) => (
            <Tag type="teal">{`${result.name}:${result.description}`}</Tag>
          ))}
        </div>
      </>
    );
};

function formatAutoSuggestProperties(inputProperties: Array<string>) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

interface WorkflowTaskFormProps {
  additionalConfig: Array<Record<string, string>>;
  closeModal: () => void;
  inputProperties: Array<string>;
  node: WorkflowNodeData;
  onSave: (...args: any) => void;
  textEditorProps: any;
  task: TaskTemplate;
  taskNames: Array<string>;
}

class WorkflowTaskForm extends Component<WorkflowTaskFormProps> {
  handleOnSave = (values: Record<string, string>) => {
    this.props.onSave(values);
    this.props.closeModal();
  };

  textAreaProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      inputProperties: this.props.inputProperties,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

  textEditorProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      inputProperties: this.props.inputProperties,
      item: input,
      ...this.props.textEditorProps,
      ...itemConfig,
      ...rest,
    };
  };

  textInputProps = ({ formikProps, input }) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key] !== null && values[key] !== undefined ? values[key] : input.value,
      inputProps: {
        id: key,
        onBlur: handleBlur,
        invalid: touched[key] && errors[key],
        invalidText: errors[key],
        ...rest,
      },
    };
  };

  toggleProps = () => {
    return {
      orientation: "vertical",
    };
  };

  render() {
    const { additionalConfig = [], node, task, taskNames } = this.props;
    const taskVersionConfig = task.config;
    const takenTaskNames = taskNames.filter((name) => name !== node.name);

    const taskResults = task.spec.results;

    // Add the name input
    const inputs = [
      {
        key: "taskName",
        label: "Task Name",
        placeholder: "Enter a task name",
        type: "custom",
        required: true,
        customComponent: TaskNameTextInput,
      },
      ...taskVersionConfig,
      ...additionalConfig,
      {
        key: "results",
        type: "custom",
        results: taskResults,
        customComponent: ResultsInput,
      },
    ];

    const initValues = { taskName: node.name, results: taskResults };
    task.config.forEach((input) => {
      const initialValue = node.params.find((param) => param.name === input.key)?.["value"] ?? "";
      initValues[input.key] = Boolean(initialValue) ? initialValue : input.defaultValue;
    });

    return (
      <DynamicFormik
        allowCustomPropertySyntax
        validateOnMount
        validationSchemaExtension={Yup.object().shape({
          taskName: Yup.string()
            .required("Enter a task name")
            .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        })}
        initialValues={initValues}
        inputs={inputs}
        onSubmit={this.handleOnSave}
        dataDrivenInputProps={{
          TextInput: AutoSuggestInput,
          TextEditor: TextEditorInput,
          TextArea: TextAreaSuggestInput,
        }}
        textAreaProps={this.textAreaProps}
        textEditorProps={this.textEditorProps}
        textInputProps={this.textInputProps}
        toggleProps={this.toggleProps}
      >
        {({ inputs, formikProps }) => (
          <ModalForm noValidate className={styles.container} onSubmit={formikProps.handleSubmit}>
            <ModalBody aria-label="inputs">{inputs}</ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={this.props.closeModal}>
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
}

export default WorkflowTaskForm;
