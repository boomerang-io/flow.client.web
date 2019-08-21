import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { transformAll } from "@overgear/yup-ast";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ValueList from "Components/ValueList";
import { TEXT_AREA_TYPES, SELECT_TYPES } from "Constants/formInputTypes";

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

  state = {};

  componentDidMount() {
    this.props.setIsModalOpen({ isModalOpen: true });
  }
  componentWillUnmount() {
    this.props.setIsModalOpen({ isModalOpen: false });
  }

  handleAppsDropdownChange = items => {
    this.setState(() => ({
      items
    }));
  };

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

      if (type === "text" || type === "secured" || Object.keys(TEXT_AREA_TYPES).includes(type)) {
        yupValidationArray.push(["yup.string"]);
      } else if (type === "url") {
        yupValidationArray.push(["yup.string"], ["yup.url"]);
      } else if (type === SELECT_TYPES.select.type) {
        yupValidationArray.push(["yup.object"]);
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

  render() {
    const { inputProperties, node, nodeConfig, task, taskNames } = this.props;

    const otherTaskNames = taskNames.filter(name => name !== node.taskName);

    return (
      <Formik
        initialValues={{ taskName: node.taskName, ...nodeConfig.inputs }}
        validationSchema={transformAll(this.yupAST(task.config, otherTaskNames))}
        onSubmit={this.handleOnSave}
      >
        {formikProps => {
          const { isValid } = formikProps;

          return (
            <Form>
              <ModalContentBody
                style={{
                  maxWidth: "35rem",
                  height: "26rem",
                  width: "100%",
                  margin: "auto",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start"
                }}
              >
                <ValueList
                  formikHandleChange={this.formikHandleChange}
                  formikProps={formikProps}
                  formikSetFieldValue={this.formikSetFieldValue}
                  inputProperties={inputProperties}
                  task={task}
                />
              </ModalContentBody>
              <ModalContentFooter>
                <ModalConfirmButton theme="bmrg-flow" text="Apply" type="submit" disabled={!isValid}>
                  Apply
                </ModalConfirmButton>
              </ModalContentFooter>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default DisplayForm;
