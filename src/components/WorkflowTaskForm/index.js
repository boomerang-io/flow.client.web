import React, { Component } from "react";
import PropTypes from "prop-types";
import { transformAll } from "@overgear/yup-ast";
import { AutoSuggest, DynamicFormik, ModalFlowForm, TextInput } from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import TextEditorModal from "Components/TextEditorModal";
import { TEXT_AREA_TYPES, SELECT_TYPES } from "Constants/formInputTypes";
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

const NameTextInput = props => {
  return (
    <>
      <TextInput {...props} />
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

  yupAST = (taskConfig, taskNames) => {
    let yupShape = {
      taskName: [
        ["yup.string"],
        ["yup.required", "Name is required"],
        ["yup.notOneOf", taskNames, "Task name must be unique per workflow"]
      ]
    };

    taskConfig.forEach(item => {
      let yupValidationArray = [];
      const type = item.type;

      if (
        type === "text" ||
        type === "PASSWORD" ||
        Object.keys(TEXT_AREA_TYPES).includes(type) ||
        type === SELECT_TYPES.select.type
      ) {
        yupValidationArray.push(["yup.string"]);
      } else if (type === "url") {
        yupValidationArray.push(["yup.string"], ["yup.url"]);
      } else if (type === SELECT_TYPES.multiselect.type) {
        yupValidationArray.push(["yup.array"]);
      } else {
        yupValidationArray.push(["yup.boolean"]);
      }

      if (item.minValueLength) {
        yupValidationArray.push(["yup.required", `${item.label} is required`]);
        yupValidationArray.push([
          "yup.min",
          item.minValueLength,
          `${item.label} must be at least ${item.minValueLength} characters`
        ]);
      }
      if (item.maxValueLength) {
        yupValidationArray.push([
          "yup.max",
          item.maxValueLength,
          `${item.label} must be less than ${item.maxValueLength} characters`
        ]);
      }

      if (yupValidationArray.length > 0) {
        yupShape[item.key] = yupValidationArray;
      }
    });

    return [["yup.object"], ["yup.shape", yupShape]];
  };

  customProps = (input, formikProps) => {
    const { handleChange } = formikProps;
    return {
      onChange: e => this.formikHandleChange(e, handleChange),
      type: "text",
      label: "Name",
      invalid: !!formikProps.errors[input.key],
      invalidText: formikProps.errors[input.key]
    };
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

    const otherTaskNames = taskNames.filter(name => name !== node.taskName);
    const inputs = [
      { key: "taskName", labelText: "Task Name", placeholder: "Enter a task name", type: "taskName" },
      ...task.config
    ];

    return (
      <DynamicFormik
        initialValues={{ taskName: node.taskName, ...nodeConfig.inputs }}
        inputs={inputs}
        onSubmit={this.handleOnSave}
        validationSchema={transformAll(this.yupAST(task.config, otherTaskNames))}
        customType="taskName"
        customProps={this.customProps}
        CustomComponent={NameTextInput}
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
        {({ inputs, propsFormik }) => (
          <ModalFlowForm onSubmit={propsFormik.handleSubmit} className={styles.container}>
            <ModalBody>{inputs}</ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={this.props.closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!propsFormik.isValid}>
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
