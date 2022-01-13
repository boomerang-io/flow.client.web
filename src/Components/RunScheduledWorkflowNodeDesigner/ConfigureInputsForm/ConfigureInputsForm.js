import React, { useState } from "react";
import { useQuery } from "react-query";
import PropTypes from "prop-types";
import * as Yup from "yup";
import moment from "moment";
import { useAppContext, useEditorContext } from "Hooks";
import {
  AutoSuggest,
  ComboBox,
  DynamicFormik,
  ErrorMessage,
  Loading,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { DATETIME_LOCAL_DISPLAY_FORMAT } from "Utils/dateHelper";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./WorkflowTaskForm.module.scss";

const AutoSuggestInput = (props) => {
  //number inputs doesn't support AutoSuggest setSelectionRange
  if (props.type === "number") return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  else
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

const TextAreaSuggestInput = (props) => {
  //if we have a default value in the input. We want to show user it is disabled
  return (
    <div key={props.id}>
      <AutoSuggest
        {...props}
        initialValue={props?.initialValue !== "" ? props?.initialValue : props?.item?.defaultValue}
      >
        <TextArea
          tooltipContent={props.tooltipContent}
          labelText={props?.label}
          disabled={props?.item?.readOnly}
          helperText={props?.item?.helperText}
          placeholder={props?.item?.placeholder}
          id={`['${props.id}']`}
        />
      </AutoSuggest>
    </div>
  );
};

const TextEditorInput = (props) => {
  return <TextEditorModal {...props} {...props.item} />;
};

const TaskNameTextInput = ({ formikProps, ...otherProps }) => {
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
// function formatAutoSuggestProperties(inputProperties) {
//   return inputProperties.map((parameter) => ({
//     value: `$(${parameter.key})`,
//     label: parameter.key,
//   }));
// }
function formatAutoSuggestProperties(inputProperties) {
  return inputProperties.map((parameter) => ({
    value: `$(${parameter})`,
    label: parameter,
  }));
}

ConfigureInputsForm.propTypes = {
  closeModal: PropTypes.func,
  inputProperties: PropTypes.array,
  node: PropTypes.object.isRequired,
  nodeConfig: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  textEditorProps: PropTypes.object,
  task: PropTypes.object.isRequired,
  taskNames: PropTypes.array.isRequired,
};

function ConfigureInputsForm(props) {
  const { teams, userWorkflows } = useAppContext();
  const { summaryData } = useEditorContext();
  const [activeWorkflowId, setActiveWorkflowId] = useState("");
  const { node, taskNames, nodeConfig } = props;

  const isSystem = summaryData?.scope === "system";
  const isUser = summaryData?.scope === "user";

  const systemWorkflowsQuery = useQuery(
    serviceUrl.getSystemWorkflows(),
    resolver.query(serviceUrl.getSystemWorkflows()),
    { enabled: isSystem }
  );

  let workflows = [];

  if (isSystem) {
    workflows = systemWorkflowsQuery.data;
  } else if (isUser) {
    workflows = userWorkflows?.workflows;
  } else {
    workflows = teams.find((team) => team.id === summaryData?.flowTeamId)?.workflows;
  }

  const workflowsMapped = workflows?.map((workflow) => ({ label: workflow.name, value: workflow.id })) ?? [];
  const workflowProperties = nodeConfig?.inputs?.workflowId
    ? workflows.find((workflow) => workflow.id === nodeConfig?.inputs?.workflowId).properties
    : null;
  const [activeProperties, setActiveProperties] = useState(
    workflowProperties
      ? workflowProperties.map((property) => {
          delete property.value;
          return property;
        })
      : []
  );

  if (systemWorkflowsQuery.isLoading) {
    return <Loading />;
  }

  if (systemWorkflowsQuery.isError) {
    return <ErrorMessage />;
  }

  const formikSetFieldValue = (value, id, setFieldValue) => {
    setFieldValue(id, value);
  };

  const handleOnSave = (values) => {
    props.node.taskName = values.taskName;
    props.onSave(values);
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
      // initialValue: values[`['${key}']`],
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

  const toggleProps = ({ input, formikProps }) => {
    return {
      orientation: "vertical",
    };
  };

  //   const formatPropertiesForEdit = () => {
  //     const { properties = [] } = workflow;
  //     return properties.filter((property) => !property.readOnly);
  //   };

  const takenTaskNames = taskNames.filter((name) => name !== node.taskName);

  const activeInputs = {};
  activeProperties.forEach((prop) => {
    // activeInputs[prop.key] = props?.value ? props.value : prop.defaultValue;
    activeInputs[prop?.key] = props?.value ? props.value : prop.defaultValue;
  });

  const WorkflowSelectionInput = ({ formikProps, ...otherProps }) => {
    const { errors, touched, setFieldValue, values } = formikProps;
    const error = errors[otherProps.id];
    const touch = touched[otherProps.id];
    const initialSelectedItem = values.workflowId
      ? workflowsMapped.find((workflow) => workflow.value === values.workflowId)
      : "";
    return (
      <ComboBox
        helperText="Which workflow you want to execute"
        id="workflow-select"
        onChange={({ selectedItem }) => {
          setFieldValue("workflowId", selectedItem?.value ?? "");
          setActiveWorkflowId(selectedItem?.value ?? "");
          if (selectedItem?.value) {
            const workflowProperties = workflows.find((workflow) => workflow.id === selectedItem?.value).properties;
            setActiveProperties(
              workflowProperties.map((property) => {
                delete property.value;
                return property;
              })
            );
          }
        }}
        items={workflowsMapped}
        initialSelectedItem={initialSelectedItem}
        titleText="Workflow"
        placeholder="Select a workflow"
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
    {
      key: "workflowId",
      label: "Task Name",
      placeholder: "Select a workflow",
      type: "custom",
      required: true,
      customComponent: WorkflowSelectionInput,
    },
    {
      key: "futureIn",
      id: "futureIn",
      label: "In",
      helperText: "The number of the selected time period",
      placeholder: "e.g. 10",
      type: "number",
      required: true,
    },
    {
      key: "futurePeriod",
      id: "futurePeriod",
      label: "Period",
      placeholder: "e.g. Days",
      helperText: "The type of time period",
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
      key: "futureAtTime",
      id: "futureAtTime",
      label: "At Time",
      helperText: "When in the future you want this to execute",
      type: "custom",
      required: true,
      customComponent: TimeInput,
    },
    ...activeProperties,
  ];

  const initTime = nodeConfig?.inputs?.time
    ? moment(nodeConfig?.inputs?.time).format(DATETIME_LOCAL_DISPLAY_FORMAT)
    : "";

  return (
    <DynamicFormik
      allowCustomPropertySyntax
      enableReinitialize
      validateOnMount
      validationSchemaExtension={Yup.object().shape({
        taskName: Yup.string()
          .required("Enter a task name")
          .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        workflowId: Yup.string().required("Select a workflow"),
        futureIn: Yup.number().required("In is required ").min(1, "Must be at least one increment in future"),
        futurePeriod: Yup.string().required("Period is required"),
        futureAtTime: Yup.string().when("period", {
          is: "days" || "weeks" || "months",
          then: Yup.string().required("Time is required"),
        }),
      })}
      initialValues={{
        taskName: node.taskName,
        workflowId: activeWorkflowId,
        ...activeInputs,
        ...nodeConfig.inputs,
        futureAtTime: initTime,
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
