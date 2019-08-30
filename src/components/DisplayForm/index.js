import React, { Component } from "react";
import PropTypes from "prop-types";
import { transformAll } from "@overgear/yup-ast";
import { DynamicFormik, TextInput } from "@boomerang/carbon-addons-boomerang-react";
import { AutoSuggestTextInput } from "@boomerang/boomerang-components";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import AutoSuggest from "Components/AutoSuggest";
import Toggle from "./Toggle";
import TextAreaModal from "Components/TextAreaModal";
import formatAutoSuggestProperties from "Utilities/formatAutoSuggestProperties";
import { INPUT_TYPES, TEXT_AREA_TYPES, SELECT_TYPES } from "Constants/formInputTypes";
import "./styles.scss";

const AutoSuggestInput = props => {
  return (
    <div key={props.key} style={{ paddingBottom: "2.125rem", position: "relative" }}>
      <AutoSuggest {...props}>
        <AutoSuggestTextInput />
      </AutoSuggest>
    </div>
  );
};

const TextAreaInput = props => {
  return (
    <div key={props.key} style={{ position: "relative", cursor: "pointer" }}>
      <TextAreaModal {...props} />
    </div>
  );
};

class DisplayForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    inputProperties: PropTypes.array,
    node: PropTypes.object.isRequired,
    nodeConfig: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    shouldConfirmExit: PropTypes.func,
    task: PropTypes.object.isRequired,
    taskNames: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.setIsModalOpen({ isModalOpen: true });
  }
  componentWillUnmount() {
    this.props.setIsModalOpen({ isModalOpen: false });
  }

  formikSetFieldValue = (value, id, setFieldValue) => {
    this.props.shouldConfirmExit(true);
    setFieldValue(id, value);
  };

  formikHandleChange = (e, handleChange) => {
    this.props.shouldConfirmExit(true);
    handleChange(e);
  };

  handleOnSave = values => {
    this.props.node.taskName = values.taskName;
    this.props.onSave(values);
    this.props.closeModal();
  };

  validateInput = ({ value, maxValueLength, minValueLength, validationFunction, validationText }) => {
    if (maxValueLength !== undefined && value.length > maxValueLength) {
      return { message: `Must be less than ${maxValueLength} characters` };
    } else if (minValueLength !== undefined && value.length < minValueLength) {
      return { message: `Must be more than ${minValueLength} characters` };
    } else if (validationFunction && !validationFunction(value)) {
      return { message: validationText };
    } else {
      return { message: "" };
    }
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
        yupValidationArray.push(["yup.min", item.minValueLength]);
      }
      if (item.maxValueLength) {
        yupValidationArray.push(["yup.max", item.maxValueLength]);
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
      onChange: handleChange,
      type: "text"
    };
  };

  selectProps = (input, formikProps) => {
    const { setFieldValue } = formikProps;
    const { key } = input;

    return {
      itemToString: item => item,
      onChange: ({ selectedItem }) => this.formikSetFieldValue(selectedItem, key, setFieldValue),
      shouldFilterItem: () => true
    };
  };

  multiSelectProps = (input, formikProps) => {
    const { setFieldValue } = formikProps;
    const { key } = input;

    return {
      itemToString: item => item,
      onChange: ({ selectedItems }) => this.formikSetFieldValue(selectedItems, key, setFieldValue),
      shouldFilterItem: () => true
    };
  };

  textAreaProps = (input, formikProps) => {
    const { values, setFieldValue } = formikProps;
    const { key, maxValueLength, minValueLength, type } = input;
    const itemConfig = TEXT_AREA_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      formikSetFieldValue: value => this.formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProperties: this.props.inputProperties,
      item: input,
      itemConfig,
      minValueLength,
      maxValueLength,
      validateInput: this.validateInput
    };
  };

  textInputProps = (input, formikProps) => {
    const { values, setFieldValue } = formikProps;
    const { description, key, label, maxValueLength, minValueLength, type } = input;
    const itemConfig = INPUT_TYPES[type];

    return {
      autoSuggestions: formatAutoSuggestProperties(this.props.inputProperties),
      handleChange: value => this.formikSetFieldValue(value, key, setFieldValue),
      initialValue: values[key],
      inputProps: {
        placeholder: description,
        alwaysShowTitle: true,
        title: label,
        type,
        theme: "bmrg-flow"
      },
      theme: "bmrg-flow",
      validationFunction: value =>
        this.validateInput({
          value,
          maxValueLength,
          minValueLength,
          validationFunction: itemConfig.validationFunction,
          validationText: itemConfig.validationText
        })
    };
  };

  toggleProps = (input, formikProps) => {
    const { values, setFieldValue } = formikProps;
    const { description, key, label } = input;

    return {
      checked: values[key],
      onChange: (checked, event, id) => this.formikSetFieldValue(checked, id, setFieldValue),
      label,
      description
    };
  };

  submitButton = ({ form, isValid }) => (
    <ModalContentFooter>
      <ModalConfirmButton form={form} theme="bmrg-flow" text="Apply" type="submit" disabled={!isValid} />
    </ModalContentFooter>
  );

  render() {
    const { node, nodeConfig, task, taskNames } = this.props;

    const otherTaskNames = taskNames.filter(name => name !== node.taskName);
    const inputs = [
      { key: "taskName", label: "Task Name", placeholder: "Enter a task name", type: "taskName" },
      ...task.config
    ];

    return (
      <DynamicFormik
        customType="taskName"
        customProps={this.customProps}
        CustomComponent={TextInput}
        dataDrivenProps={{
          TextInput: AutoSuggestInput,
          TextArea: TextAreaInput,
          Toggle
        }}
        formProps={{ className: "c-display-form", id: "display-form" }}
        initialValues={{ taskName: node.taskName, ...nodeConfig.inputs }}
        inputs={inputs}
        inputsWrapperProps={{ className: "b-display-form__inputs" }}
        multiSelectProps={this.multiSelectProps}
        onSubmit={this.handleOnSave}
        selectProps={this.selectProps}
        submitButton={this.submitButton}
        textAreaProps={this.textAreaProps}
        textInputProps={this.textInputProps}
        toggleProps={this.toggleProps}
        validationSchema={transformAll(this.yupAST(task.config, otherTaskNames))}
      />
    );
  }
}

export default DisplayForm;
