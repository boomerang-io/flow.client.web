// @sts-nocheck
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
import { timezoneOptions, defaultTimeZone, transformTimeZone } from "Utils/dateHelper";
import { SUPPORTED_AUTOSUGGEST_TYPES, TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { WorkflowNode } from "Types";
import styles from "./WorkflowTaskForm.module.scss";

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

function formatAutoSuggestProperties(inputProperties) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

interface ConfigureInputsFormProps {
  closeModal: () => void;
  inputProperties: Array<any>;
  node: WorkflowNode["data"];
  onSave: (...args: any) => void;
  textEditorProps: any;
  task: any;
  taskNames: Array<any>;
}

function ConfigureInputsForm(props: ConfigureInputsFormProps) {
  const { workflowsQueryData } = useEditorContext();
  const [activeWorkflowId, setActiveWorkflowId] = useState("");
  const { node, taskNames } = props;

  const workflows = workflowsQueryData.content;
  const workflowsMapped = workflows?.map((workflow) => ({ label: workflow.name, value: workflow.id })) ?? [];
  const workflowId = node?.params.find((param) => param.name === "workflowId")?.value;
  const workflowProperties = workflows.find((workflow) => workflow.id === workflowId)?.config;

  const [activeProperties, setActiveProperties] = useState(workflowProperties ?? []);
  console.log({ activeProperties });

  const formikSetFieldValue = (value: any, id: string, setFieldValue: (arg0: any, arg1: any) => void) => {
    setFieldValue(id, value);
  };

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
      formikSetFieldValue: (value) => formikSetFieldValue(value, key, setFieldValue),
      onChange: (value) => formikSetFieldValue(value, key, setFieldValue),
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
      formikSetFieldValue: (value) => formikSetFieldValue(value, key, setFieldValue),
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
      onChange: (value) => formikSetFieldValue(value, `['${key}']`, setFieldValue),
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

  const TimeInput = ({ formikProps, ...otherProps }) => {
    const { errors, touched, handleChange, values } = formikProps;
    const error = errors[otherProps.id];
    const hasBeenTouched = touched[otherProps.id];
    if (values.futurePeriod === "minutes" || values.futurePeriod === "hours") {
      return null;
    }

    return (
      <TextInput
        helperText={otherProps.helperText}
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

  const TimeZoneInput = ({ formikProps, ...otherProps }) => {
    const { errors, touched, values } = formikProps;
    const error = errors[otherProps.id];
    const hasBeenTouched = touched[otherProps.id];
    if (values.futurePeriod === "minutes" || values.futurePeriod === "hours") {
      return null;
    }

    return (
      <ComboBox
        helperText={otherProps.helperText}
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

  console.log(inputs);

  const initTime = node?.params.find((param) => param.name === "time")?.value ?? "";
  const initTimeZone = transformTimeZone(node?.params.find((param) => param.name === "timezone") ?? defaultTimeZone);

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
      initialValues={{
        taskName: node.name,
        workflowId: activeWorkflowId,
        ...activeInputs,
        ...node.params,
        time: initTime,
        timezone: initTimeZone,
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

export default ConfigureInputsForm;
