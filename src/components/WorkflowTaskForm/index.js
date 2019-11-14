import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { AutoSuggest, DynamicFormik, ModalFlowForm, TextInput } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES } from "Constants/formInputTypes";
import styles from "./WorkflowTaskForm.module.scss";

const AutoSuggestInput = props => {
  return (
    <div key={props.id} style={{ paddingBottom: "1rem", position: "relative" }}>
      <AutoSuggest {...props}>
        <TextInput />
      </AutoSuggest>
    </div>
  );
};

const TextEditorInput = props => {
  return (
    <div key={props.id} style={{ position: "relative", cursor: "pointer", paddingBottom: "1rem" }}>
      <TextEditorModal {...props} />
    </div>
  );
};

const TaskNameTextInput = ({ formikProps, ...rest }) => {
  const { errors, touched } = formikProps;
  const error = errors[rest.id];
  const touch = touched[rest.id];
  return (
    <>
      <TextInput {...rest} invalid={touch && error} invalidText={error} />
      <hr className={styles.divider} />
      <h2 className={styles.inputsTitle}>Specifics</h2>
    </>
  );
};

/**
 * @param {property} inputProperties - property object for workflow
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
  return inputProperties.map(property => ({
    value: `\${p:${property.key}}`,
    label: property.key
  }));
}

class WorkflowTaskForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    inputProperties: PropTypes.array,
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    setShouldConfirmModalClose: PropTypes.func,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.setIsModalOpen({ isModalOpen: true });
    this.props.setShouldConfirmModalClose(false);
  }
  componentWillUnmount() {
    this.props.setIsModalOpen({ isModalOpen: false });
  }

  formikSetFieldValue = (value, id, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(id, value);
  };

  formikHandleChange = (e, handleChange) => {
    this.props.setShouldConfirmModalClose(true);
    handleChange(e);
  };

  handleOnSave = values => {
    this.props.node.taskName = values.taskName;
    this.props.onSave(values);
    this.props.setShouldConfirmModalClose(false);
    this.props.closeModal();
  };

  selectProps = (input, formikProps) => {
    const { setFieldValue } = formikProps;
    const { key } = input;

    return {
      onChange: ({ selectedItem }) => this.formikSetFieldValue(selectedItem ? selectedItem : "", key, setFieldValue),
      shouldFilterItem: () => true
    };
  };

  multiSelectProps = (input, formikProps) => {
    const { setFieldValue } = formikProps;
    const { key } = input;

    return {
      onChange: ({ selectedItems }) => this.formikSetFieldValue(selectedItems.map(item => item.key), key, setFieldValue)
    };
  };

  textAreaProps = (input, formikProps) => {
    const { values, setFieldValue } = formikProps;
    const { key, type, ...rest } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      formikSetFieldValue: value => this.formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProperties: this.props.inputProperties,
      item: input,
      ...itemConfig,
      ...rest
    };
  };

  textInputProps = (input, formikProps) => {
    const { errors, handleBlur, touched, values, setFieldValue } = formikProps;
    const { key, ...rest } = input;

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      onChange: value => this.formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProps: {
        id: key,
        onBlur: handleBlur,
        invalid: touched[key] && errors[key],
        invalidText: errors[key],
        ...rest
      }
    };
  };

  toggleProps = (input, formikProps) => {
    return {
      orientation: "vertical"
    };
  };

  render() {
    const { node, nodeConfig, task, taskNames } = this.props;

    const takenTaskNames = taskNames.filter(name => name !== node.taskName);
    const inputs = [
      {
        key: "taskName",
        label: "Task Name",
        placeholder: "Enter a task name",
        type: "custom",
        required: true,
        customComponent: TaskNameTextInput
      },
      ...task.config
    ];

    return (
      <DynamicFormik
        validationSchemaExtension={Yup.object().shape({
          taskName: Yup.string()
            .required("Enter a Task Name")
            .notOneOf(takenTaskNames, "Enter a unique value for task name")
        })}
        initialValues={{ taskName: node.taskName, ...nodeConfig.inputs }}
        inputs={inputs}
        onSubmit={this.handleOnSave}
        dataDrivenProps={{
          TextInput: AutoSuggestInput,
          TextEditor: TextEditorInput
        }}
        multiSelectProps={this.multiSelectProps}
        selectProps={this.selectProps}
        textAreaProps={this.textAreaProps}
        textEditorProps={this.textAreaProps}
        textInputProps={this.textInputProps}
        toggleProps={this.toggleProps}
      >
        {({ inputs, formikProps }) => (
          <ModalFlowForm onSubmit={formikProps.handleSubmit} className={styles.container}>
            <ModalBody>{inputs}</ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formikProps.isValid}>
                Apply
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        )}
      </DynamicFormik>
    );
  }
}

export default WorkflowTaskForm;
