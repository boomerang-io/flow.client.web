import React, { useState } from "react";
import * as Yup from "yup";
import { useEditorContext } from "Hooks";
import { ComboBox, DynamicFormik, ModalForm, TextInput } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@carbon/react";
import { timezoneOptions, defaultTimeZone, transformTimeZone } from "Utils/dateHelper";
import {
  AutoSuggestInput,
  TextAreaSuggestInput,
  TextEditorInput,
  TaskNameTextInput,
  formatAutoSuggestParameters,
} from "../../shared/inputs";
import { INPUT_TYPES, TEXT_AREA_TYPES } from "Constants/formInputTypes";
import type { FormikProps } from "formik";
import { DataDrivenInput, TaskTemplate, WorkflowNodeData } from "Types";
import styles from "./RunScheduledWorkflowForm.module.scss";

interface RunScheduledWorkflowFormProps {
  closeModal: () => void;
  availableParameters: Array<string>;
  node: WorkflowNodeData;
  onSave: (inputs: Record<string, string>, results?: Array<{ name: string; description: string }>) => void;
  textEditorProps: Record<string, any>;
  task: TaskTemplate;
  taskNames: Array<string>;
}

function RunScheduledWorkflowForm(props: RunScheduledWorkflowFormProps) {
  const { workflowsQueryData } = useEditorContext();
  const [activeWorkflowId, setActiveWorkflowId] = useState("");
  const { node, task, taskNames } = props;

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
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = INPUT_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestParameters(props.availableParameters),
      onChange: (value: any) => setFieldValue(key, value),
      initialValue: values[key],
      item: input,
      ...itemConfig,
      ...rest,
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

  const TimeInput = ({
    formikProps,
    ...input
  }: DataDrivenInput & {
    formikProps: FormikProps<any>;
  }) => {
    const { errors, touched, handleChange, values } = formikProps;
    const error = errors[input.id];
    const hasBeenTouched = Boolean(touched[input.id]);
    if (values.futurePeriod === "minutes" || values.futurePeriod === "hours") {
      return null;
    }

    return (
      <TextInput
        helperText={input.helperText}
        id="time"
        invalid={Boolean(error) && hasBeenTouched}
        invalidText={error}
        labelText="Time"
        name="time"
        onChange={handleChange}
        placeholder="e.g. 8:00"
        type="time"
        value={values["time"]}
      />
    );
  };

  const TimeZoneInput = ({
    formikProps,
    ...input
  }: DataDrivenInput & {
    formikProps: FormikProps<any>;
  }) => {
    const { errors, touched, values } = formikProps;
    const error = errors[input.id];
    const hasBeenTouched = Boolean(touched[input.id]);
    if (values.futurePeriod === "minutes" || values.futurePeriod === "hours") {
      return null;
    }

    return (
      <ComboBox
        helperText={input.helperText}
        id="timezone"
        initialSelectedItem={values.timezone}
        //@ts-ignore
        items={timezoneOptions}
        invalid={Boolean(error) && hasBeenTouched}
        invalidText={error}
        onChange={({ selectedItem }) => {
          formikProps.setFieldValue("timezone", selectedItem);
        }}
        placeholder="e.g. US/Central (UTC -06:00)"
        titleText="Time Zone"
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
      key: "futureIn",
      id: "futureIn",
      label: "Interval",
      helperText: "Length of the selected interval period",
      placeholder: "e.g. 10",
      type: "number",
      required: true,
      min: 1,
    },
    {
      key: "futurePeriod",
      id: "futurePeriod",
      label: "Interval Period",
      placeholder: "e.g. Days",
      type: "select",
      options: [
        { key: "minutes", value: "Minutes" },
        { key: "hours", value: "Hours" },
        { key: "days", value: "Days" },
        { key: "weeks", value: "Weeks" },
        { key: "months", value: "Months" },
      ],
      required: true,
    },
    {
      key: "time",
      id: "time",
      label: "At Time",
      helperText: "When in the future you want the Workflow to execute",
      type: "custom",
      required: true,
      customComponent: TimeInput,
    },
    {
      key: "timezone",
      id: "timezone",
      required: true,
      type: "custom",
      helperText: "What time zone to execute in",
      customComponent: TimeZoneInput,
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

  const initTime = node?.params.find((param) => param.name === "time")?.value ?? "";
  const initTimeZone = transformTimeZone(node?.params.find((param) => param.name === "timezone") ?? defaultTimeZone);

  const initialValues: Record<string, any> = {
    taskName: node.name,
    workflowId: activeWorkflowId,
    time: initTime,
    timezone: initTimeZone,
    ...activeInputs,
    ...node.params.reduce((accum, curr) => {
      accum[curr.name] = curr.value;
      return accum;
    }, {} as Record<string, string>),
  };

  task.config.forEach((input) => {
    const initialValue = node.params.find((param) => param.name === input.key)?.["value"];
    initialValues[input.key] = initialValue !== undefined ? initialValue : input.defaultValue;
  });

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        futureIn: Yup.number().required("Interval is required ").min(1, "Must be at least one interval in future"),
        futurePeriod: Yup.string().required("Interval period is required"),
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        time: Yup.string().test("timeRequired", "Time is required", (value, ctx) => {
          const futurePeriod = ctx.parent.futurePeriod;
          if (!value && (futurePeriod === "days" || futurePeriod === "weeks" || futurePeriod === "months")) {
            return false;
          } else {
            return true;
          }
        }),
        timezone: Yup.object().test("timeZoneRequired", "Time Zone is required", (value, ctx) => {
          const futurePeriod = ctx.parent.futurePeriod;
          if (!value.value && (futurePeriod === "days" || futurePeriod === "weeks" || futurePeriod === "months")) {
            return false;
          }
          return true;
        }),
        workflowId: Yup.string().required("Select a workflow"),
      })}
      initialValues={initialValues}
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

export default RunScheduledWorkflowForm;
