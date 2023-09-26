import React from "react";
import * as Yup from "yup";
import { DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import {
  AutoSuggestInput,
  ResultsInput,
  TextAreaSuggestInput,
  TextEditorInput,
  TaskNameTextInput,
  formatAutoSuggestParameters,
} from "../../shared/inputs";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import type { FormikProps } from "formik";
import { DataDrivenInput, TaskTemplate, WorkflowNodeData } from "Types";
import styles from "./CustomTaskForm.module.scss";

interface CustomTaskFormProps {
  closeModal: () => void;
  availableParameters: Array<string>;
  node: WorkflowNodeData;
  onSave: (inputs: Record<string, string>, results?: Array<{ name: string; description: string }>) => void;
  textEditorProps: Record<string, any>;
  task: TaskTemplate;
  taskNames: Array<string>;
}

function CustomTaskForm(props: CustomTaskFormProps) {
  const { node, taskNames, task } = props;

  const handleOnSave = (values: Record<string, string> & { results: Array<string> }) => {
    const { results, ...rest } = values;
    const formattedOutputs: Array<{ name: string; description: string }> = [];
    results.forEach((result) => {
      let index = result.indexOf(":");
      formattedOutputs.push({ name: result.slice(0, index), description: result.slice(index + 1) });
    });

    props.onSave(rest, formattedOutputs);
    props.closeModal();
  };

  const textAreaProps = ({ input, formikProps }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestParameters(props.availableParameters),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      availableParameters: props.availableParameters,
      item: input,
      ...itemConfig,
      ...rest,
    };
  };

  const textEditorProps = ({ input, formikProps }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestParameters(props.availableParameters),
      formikSetFieldValue: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      availableParameters: props.availableParameters,
      item: input,
      ...props.textEditorProps,
      ...itemConfig,
      ...rest,
    };
  };

  const textInputProps = ({ formikProps, input }: { formikProps: FormikProps<any>; input: DataDrivenInput }) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestParameters(props.availableParameters),
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
      results: node?.results,
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
        results: node?.results?.map((output) => `${output?.name}:${output?.description}`) ?? [],
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
