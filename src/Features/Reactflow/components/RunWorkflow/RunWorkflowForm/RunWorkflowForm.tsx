import React, { useState } from "react";
import { useEditorContext } from "Hooks";
import { FormikProps } from "formik";
import { ComboBox, DynamicFormik, ModalForm } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import * as Yup from "yup";
import {
  AutoSuggestInput,
  TextAreaSuggestInput,
  TextEditorInput,
  TaskNameTextInput,
  formatAutoSuggestParameters,
} from "../../shared/inputs";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { DataDrivenInput, TaskTemplate, WorkflowNodeData } from "Types";
import styles from "./RunWorkflowForm.module.scss";

interface RunWorkflowFormProps {
  closeModal: () => void;
  availableParameters: Array<string>;
  node: WorkflowNodeData;
  onSave: (inputs: Record<string, string>, results?: Array<{ name: string; description: string }>) => void;
  textEditorProps: any;
  task: TaskTemplate;
  taskNames: Array<string>;
}

function RunWorkflowForm(props: RunWorkflowFormProps) {
  const { workflowsQueryData } = useEditorContext();
  const [activeWorkflowId, setActiveWorkflowId] = useState("");
  const { node, taskNames } = props;

  const workflows = workflowsQueryData.content;
  const workflowsMapped = workflows?.map((workflow) => ({ label: workflow.name, value: workflow.id })) ?? [];
  const workflowId = node?.params.find((param) => param.name === "workflowId")?.value;
  const workflowProperties = workflows.find((workflow) => workflow.id === workflowId)?.config;

  const [activeProperties, setActiveProperties] = useState(workflowProperties ?? []);

  const handleOnSave = (values: { taskName: any; timezone: { value: any } }) => {
    props.node.name = values.taskName;
    const valuesToSave = { ...values, timezone: values.timezone.value };
    props.onSave(valuesToSave);
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

  const activeInputs: Record<string, string> = {};
  if (activeProperties) {
    activeProperties.forEach((prop) => {
      const name = prop.name;
      if (name) {
        //@ts-ignore
        activeInputs[name] = prop.defaultValue;
      }
    });
  }

  const WorkflowSelectionInput = ({
    formikProps,
    ...input
  }: DataDrivenInput & {
    formikProps: FormikProps<any>;
  }) => {
    const { errors, touched, setFieldValue, values } = formikProps;
    const error = errors[input.id];
    const touch = touched[input.id];
    const initialSelectedItem = values.workflowId
      ? workflowsMapped.find((workflow) => workflow.value === values.workflowId)
      : "";
    return (
      <ComboBox
        helperText={input.helperText}
        id="workflow-select"
        onChange={({ selectedItem }) => {
          setFieldValue("workflowId", selectedItem?.value ?? "");
          setActiveWorkflowId(selectedItem?.value ?? "");
          console.log({ selectedItem });
          if (selectedItem?.value) {
            const workflowProperties = workflows.find((workflow) => workflow.id === selectedItem?.value)?.config;
            if (workflowProperties) {
              setActiveProperties(workflowProperties);
            } else {
              setActiveProperties([]);
            }
          } else {
            setActiveProperties([]);
          }
        }}
        items={workflowsMapped}
        initialSelectedItem={initialSelectedItem}
        titleText="Workflow"
        placeholder="Select a Workflow"
        invalid={Boolean(error) && Boolean(touch)}
        invalidText={error}
      />
    );
  };

  // Add the name and future inputs
  const inputs: Array<any> = [
    {
      key: "taskName",
      id: "taskName",
      label: "Task Name",
      placeholder: "Enter a task name",
      type: "custom",
      required: true,
      customComponent: TaskNameTextInput,
    },
    {
      key: "workflowId",
      id: "workflowId",
      type: "custom",
      required: true,
      helperText: "When in the future you want the Workflow to execute",
      customComponent: WorkflowSelectionInput,
    },
    ...activeProperties,
  ];

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        workflowId: Yup.string().required("Select a workflow"),
      })}
      initialValues={{
        taskName: node.name,
        workflowId: activeWorkflowId,
        ...activeInputs,
        ...node.params,
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

export default RunWorkflowForm;
