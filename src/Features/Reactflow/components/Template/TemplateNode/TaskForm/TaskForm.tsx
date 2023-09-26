import React, { Component } from "react";
import * as Yup from "yup";
import { DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Tag } from "@carbon/react";
import {
  AutoSuggestInput,
  TextAreaSuggestInput,
  TextEditorInput,
  TaskNameTextInput,
  formatAutoSuggestParameters,
} from "../../../shared/inputs";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import type { FormikProps } from "formik";
import type { DataDrivenInput, TaskTemplate, WorkflowNodeData } from "Types";
import styles from "./TaskForm.module.scss";

const ResultsInput = (props: { results: WorkflowNodeData["results"] }) => {
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

interface WorkflowTaskFormProps {
  additionalConfig?: Array<DataDrivenInput>;
  availableParameters: Array<string>;
  closeModal: () => void;
  node: WorkflowNodeData;
  onSave: (inputs: Record<string, string>, results?: Array<{ name: string; description: string }>) => void;
  textEditorProps?: any;
  task: TaskTemplate;
  taskNames: Array<string>;
}

class WorkflowTaskForm extends Component<WorkflowTaskFormProps> {
  handleOnSave = (values: Record<string, string>) => {
    this.props.onSave(values);
    this.props.closeModal();
  };

  textAreaProps = ({ input, formikProps }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestParameters(this.props.availableParameters),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      availableParameters: this.props.availableParameters,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

  textEditorProps = ({ input, formikProps }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestParameters(this.props.availableParameters),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      availableParameters: this.props.availableParameters,
      item: input,
      ...this.props.textEditorProps,
      ...itemConfig,
      ...rest,
    };
  };

  textInputProps = ({ formikProps, input }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestParameters(this.props.availableParameters),
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
