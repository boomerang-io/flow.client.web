import { DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter, Tag } from "@carbon/react";
import React from "react";
import * as Yup from "yup";
import {
  AutoSuggestInput,
  TextAreaSuggestInput,
  TextEditorInput,
  TaskNameTextInput,
  textAreaProps,
  textEditorProps,
  textInputProps,
  toggleProps,
} from "../../../shared/inputs";
import styles from "./TaskForm.module.scss";
import type { DataDrivenInput, TaskTemplate, WorkflowNodeData } from "Types";

const ResultsDisplay = (props: { results: WorkflowNodeData["results"] }) => {
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
  additionalFormInputs?: Array<Partial<DataDrivenInput>>;
  availableParameters: Array<string>;
  closeModal: () => void;
  node: WorkflowNodeData;
  onSave: (inputs: Record<string, string>, results?: Array<{ name: string; description: string }>) => void;
  otherTaskNames: Array<string>;
  textEditorProps?: any;
  task: TaskTemplate;
}

function WorkflowTaskForm(props: WorkflowTaskFormProps) {
  const { availableParameters, additionalFormInputs = [], node, task, otherTaskNames } = props;

  const taskResults = task.spec.results;
  const handleOnSave = (values: Record<string, string>) => {
    props.onSave(values);
    props.closeModal();
  };

  // Add the name input
  const inputs: Array<any> = [
    {
      key: "taskName",
      name: "taskName",
      label: "Task Name",
      placeholder: "Enter a task name",
      type: "custom",
      required: true,
      customComponent: TaskNameTextInput,
    },
    ...task.config,
    ...additionalFormInputs,
    {
      key: "results",
      name: "results",
      type: "custom",
      results: taskResults,
      customComponent: ResultsDisplay,
    },
  ];

  const initialValues: Record<string, any> = {
    taskName: node.name,
    results: taskResults,
    ...node.params.reduce(
      (accum, curr) => {
        accum[curr.name] = curr.value;
        return accum;
      },
      {} as Record<string, string>,
    ),
  };

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(otherTaskNames, "Enter a unique value for task name"),
      })}
      initialValues={initialValues}
      inputs={inputs}
      onSubmit={handleOnSave}
      dataDrivenInputProps={{
        TextInput: AutoSuggestInput,
        TextEditor: TextEditorInput,
        TextArea: TextAreaSuggestInput,
      }}
      textAreaProps={textAreaProps(availableParameters)}
      textEditorProps={textEditorProps(availableParameters, props.textEditorProps)}
      textInputProps={textInputProps(availableParameters)}
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

export default WorkflowTaskForm;
