import React, { useState } from "react";
import * as Yup from "yup";
import { useEditorContext } from "Hooks";
import {
  AutoSuggest,
  ComboBox,
  DynamicFormik,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import TextEditorModal from "Components/TextEditorModal";
import { SUPPORTED_AUTOSUGGEST_TYPES, TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { TaskTemplate, WorkflowNode } from "Types";
import styles from "./RunWorkflowForm.module.scss";

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

/**
 * @param {parameter} inputProperties - parameter object for workflow
 * {
 *   defaultValue: String
 *   description: String
 *   key: String
 *   label: String
 *   required: Bool
 *   type: String
 * }
 */

function formatAutoSuggestProperties(inputProperties: Array<string>) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

interface RunWorkflowFormProps {
  closeModal: () => void;
  inputProperties: Array<string>;
  node: WorkflowNode["data"];
  onSave: (...args: any) => void;
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

  const activeInputs: Record<string, string> = {};
  if (activeProperties) {
    activeProperties.forEach((prop) => {
      activeInputs[prop?.name] = prop.defaultValue;
    });
  }

  const WorkflowSelectionInput = ({ formikProps, ...otherProps }) => {
    const { errors, touched, setFieldValue, values } = formikProps;
    const error = errors[otherProps.id];
    const touch = touched[otherProps.id];
    const initialSelectedItem = values.workflowId
      ? workflowsMapped.find((workflow) => workflow.value === values.workflowId)
      : "";
    return (
      <ComboBox
        helperText={otherProps.helperText}
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
        invalid={error && touch}
        invalidText={error}
      />
    );
  };

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
