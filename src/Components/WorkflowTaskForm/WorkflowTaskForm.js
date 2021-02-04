import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import {
  AutoSuggest,
  DynamicFormik,
  ModalForm,
  TextInput,
  TextArea,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "@boomerang-io/carbon-addons-boomerang-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import styles from "./WorkflowTaskForm.module.scss";

const AutoSuggestInput = (props) => {
  //number inputs doesn't support AutoSuggest setSelectionRange
  if (props.type === "number") return <TextInput {...props} onChange={(e) => props.onChange(e.target.value)} />;
  else
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
      <TextInput {...otherProps} invalid={error && touch} invalidText={error} onChange={formikProps.handleChange} />
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

class WorkflowTaskForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    inputProperties: PropTypes.array,
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    textEditorProps: PropTypes.object,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired,
  };

  formikSetFieldValue = (value, id, setFieldValue) => {
    setFieldValue(id, value);
  };

  formikHandleChange = (e, handleChange) => {
    handleChange(e);
  };

  handleOnSave = (values) => {
    this.props.node.taskName = values.taskName;
    this.props.onSave(values);
    this.props.closeModal();
  };

  textAreaProps = ({ input, formikProps }) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      formikSetFieldValue: (value) => this.formikSetFieldValue(value, key, setFieldValue),
      onChange: (value) => this.formikSetFieldValue(value, key, setFieldValue),
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
      formikSetFieldValue: (value) => this.formikSetFieldValue(value, key, setFieldValue),
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
      onChange: (value) => this.formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProps: {
        id: key,
        onBlur: handleBlur,
        invalid: touched[key] && errors[key],
        invalidText: errors[key],
        ...rest,
      },
    };
  };

  toggleProps = ({ input, formikProps }) => {
    return {
      orientation: "vertical",
    };
  };

  render() {
    const { node, task, taskNames, nodeConfig } = this.props;
    const taskRevisions = task?.revisions ?? [];
    console.log("nodeConfig");
    console.log(nodeConfig);
    // Find the matching task config for the version
    const taskVersionConfig = nodeConfig
      ? taskRevisions.find((revision) => nodeConfig.taskVersion === revision.version)?.config ?? []
      : [];
    const takenTaskNames = taskNames.filter((name) => name !== node.taskName);

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
    ];

    return (
      <DynamicFormik
        allowCustomPropertySyntax
        validateOnMount
        validationSchemaExtension={Yup.object().shape({
          taskName: Yup.string()
            .required("Enter a task name")
            .notOneOf(takenTaskNames, "Enter a unique value for task name"),
        })}
        initialValues={{ taskName: node.taskName, ...nodeConfig.inputs }}
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
