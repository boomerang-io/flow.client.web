import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import {
  ComboBox,
  Creatable,
  TextArea,
  TextInput,
  Toggle,
  ModalFlowForm
} from "@boomerang/carbon-addons-boomerang-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash.get";
import clonedeep from "lodash/cloneDeep";
import INPUT_TYPES from "Constants/workflowInputTypes";
import "./styles.scss";

const FIELD = {
  KEY: "key",
  DESCRIPTION: "description",
  LABEL: "label",
  REQUIRED: "required",
  TYPE: "type",
  DEFAULT_VALUE: "defaultValue",
  VALID_VALUES: "validValues"
};

const INPUT_TYPES_LABELS = [
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Password", value: "password" },
  { label: "Select", value: "select" },
  { label: "Text", value: "text" },
  { label: "Text Area", value: "textarea" }
];

class InputsModalContent extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    input: PropTypes.object,
    inputsNames: PropTypes.array,
    isEdit: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    updateInputs: PropTypes.func.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  handleOnChange = (e, formikChange) => {
    this.props.setShouldConfirmModalClose(true);
    formikChange(e);
  };

  handleOnFieldValueChange = (value, id, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(id, value);
  };

  handleOnTypeChange = (selectedItem, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(FIELD.TYPE, selectedItem);
    setFieldValue(FIELD.DEFAULT_VALUE, selectedItem.value === INPUT_TYPES.BOOLEAN ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleValidValuesChange = (values, setFieldValue) => {
    this.props.setShouldConfirmModalClose(true);
    setFieldValue(FIELD.VALID_VALUES, values);
  };

  /* Check if key contains space or special characters, only underline is allowed */
  validateKey = key => {
    const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_|/.]");
    return !regexp.test(key);
  };

  // dispatch Redux action to update store
  handleConfirm = formikProps => {
    let inputProperties = clonedeep(formikProps.values);
    inputProperties.type = inputProperties.type.value;

    //remove in case they are present if the user changed their mind
    if (inputProperties.type !== INPUT_TYPES.SELECT) {
      delete inputProperties.validValues;
    }

    if (inputProperties.type === INPUT_TYPES.BOOLEAN) {
      if (!inputProperties.defaultValue) inputProperties.defaultValue = false;
    }

    if (this.props.isEdit) {
      new Promise(resolve => resolve(this.props.workflowActions.updateWorkflowInput(inputProperties)))
        .then(() =>
          this.props.updateInputs({ title: "Edit Input", message: "Successfully edited input", type: "edit" })
        )
        .then(() => {
          this.props.setShouldConfirmModalClose(false);
          this.props.closeModal();
        });
    } else {
      new Promise(resolve => resolve(this.props.workflowActions.createWorkflowInput(inputProperties)))
        .then(() =>
          this.props.updateInputs({ title: "Create Input", message: "Successfully created input", type: "create" })
        )
        .then(() => {
          this.props.setShouldConfirmModalClose(false);
          this.props.closeModal();
        });
    }
  };

  renderDefaultValue = formikProps => {
    const { values, handleBlur, handleChange, setFieldValue } = formikProps;

    switch (values.type.value) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <div className="b-inputs-modal-toggle" data-testid="toggle">
            <Toggle
              id={FIELD.DEFAULT_VALUE}
              toggled={values.defaultValue === "true"}
              labelText="Default Value"
              onToggle={value => this.handleOnFieldValueChange(value.toString(), FIELD.DEFAULT_VALUE, setFieldValue)}
            />
          </div>
        );
      case INPUT_TYPES.SELECT:
        let validValues = clonedeep(values.validValues);
        return (
          <>
            <div className="b-inputs-modal-select" data-testid="select">
              <Creatable
                id={FIELD.VALID_VALUES}
                onChange={createdItems => this.handleValidValuesChange(createdItems, setFieldValue)}
                values={validValues || []}
                labelText="Options"
                placeholder="Enter option"
              />
            </div>
            <div className="b-inputs-modal-select">
              <ComboBox
                id={FIELD.DEFAULT_VALUE}
                onChange={({ selectedItem }) =>
                  this.handleOnFieldValueChange(selectedItem, FIELD.DEFAULT_VALUE, setFieldValue)
                }
                items={validValues || []}
                initialSelectedItem={values.defaultValue || {}}
                titleText="Default Option"
                placeholder="Select option"
              />
            </div>
          </>
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <div className="b-inputs-modal-text-area" data-testid="text-area">
            <TextArea
              id={FIELD.DEFAULT_VALUE}
              labelText="Default Value"
              placeholder="Default Value"
              value={values.defaultValue || ""}
              onBlur={handleBlur}
              onChange={e => this.handleOnChange(e, handleChange)}
              style={{ resize: "none" }}
            />
          </div>
        );
      default:
        // Fallback to text input here because it covers text, password, and url
        return (
          <div className="b-inputs-modal-text-input" data-testid="text-input">
            <TextInput
              id={FIELD.DEFAULT_VALUE}
              labelText="Default Value"
              placeholder="Default Value"
              type={values.type.value}
              value={values.defaultValue || ""}
              onBlur={handleBlur}
              onChange={e => this.handleOnChange(e, handleChange)}
            />
          </div>
        );
    }
  };

  render() {
    const { input, isEdit, inputsKeys, loading } = this.props;

    return (
      <Formik
        initialValues={{
          [FIELD.KEY]: get(input, "key", ""),
          [FIELD.LABEL]: get(input, "label", ""),
          [FIELD.DESCRIPTION]: get(input, "description", ""),
          [FIELD.REQUIRED]: get(input, "required", false),
          [FIELD.TYPE]: input ? INPUT_TYPES_LABELS.find(type => type.value === input.type) : INPUT_TYPES_LABELS[4],
          [FIELD.DEFAULT_VALUE]: get(input, "defaultValue", ""),
          [FIELD.VALID_VALUES]: get(input, "validValues", [])
        }}
        validationSchema={Yup.object().shape({
          [FIELD.KEY]: Yup.string()
            .required("Enter a key")
            .notOneOf(inputsKeys || [], "Property key already exist")
            .test("is-valid-key", "Invalid key, space and special characters aren't allowed", this.validateKey),
          [FIELD.LABEL]: Yup.string().required("Enter a label"),
          [FIELD.DESCRIPTION]: Yup.string(),
          [FIELD.REQUIRED]: Yup.boolean(),
          [FIELD.TYPE]: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }),
          [FIELD.VALID_VALUES]: Yup.array()
        })}
      >
        {formikProps => {
          const { values, touched, errors, handleBlur, handleChange, setFieldValue, isValid } = formikProps;

          return (
            <ModalFlowForm>
              <fieldset disabled={loading}>
                <ModalBody className="c-inputs-modal-body">
                  <div className="c-inputs-modal-body-left">
                    <div className="b-inputs-modal-text">
                      <TextInput
                        id={FIELD.KEY}
                        labelText="Key"
                        placeholder="key.value"
                        value={values.key}
                        onBlur={handleBlur}
                        onChange={e => this.handleOnChange(e, handleChange)}
                        invalid={errors.key && touched.key}
                        invalidText={errors.key}
                      />
                    </div>
                    <div className="b-inputs-modal-text">
                      <TextInput
                        id={FIELD.LABEL}
                        labelText="Label"
                        placeholder="Label"
                        value={values.label}
                        onBlur={handleBlur}
                        onChange={e => this.handleOnChange(e, handleChange)}
                        invalid={errors.label && touched.label}
                        invalidText={errors.label}
                      />
                    </div>
                    <div className="b-inputs-modal-text">
                      <TextInput
                        id={FIELD.DESCRIPTION}
                        labelText="Description"
                        placeholder="Description"
                        value={values.description}
                        onBlur={handleBlur}
                        onChange={e => this.handleOnChange(e, handleChange)}
                      />
                    </div>
                    <div className="b-inputs-modal-toggle">
                      <Toggle
                        id={FIELD.REQUIRED}
                        toggled={values.required}
                        labelText="Required"
                        onToggle={value => this.handleOnFieldValueChange(value, FIELD.REQUIRED, setFieldValue)}
                      />
                    </div>
                  </div>
                  <div className="c-inputs-modal-body-right">
                    <div className="b-inputs-modal-type">
                      <ComboBox
                        id={FIELD.TYPE}
                        onChange={({ selectedItem }) =>
                          this.handleOnTypeChange(
                            selectedItem !== null ? selectedItem : { label: "", value: "" },
                            setFieldValue
                          )
                        }
                        items={INPUT_TYPES_LABELS}
                        initialSelectedItem={values.type}
                        itemToString={item => item && item.label}
                        placeholder="Select an item"
                        titleText="Type"
                      />
                    </div>
                    {this.renderDefaultValue(formikProps)}
                  </div>
                </ModalBody>
              </fieldset>
              <ModalFooter>
                <Button
                  data-testid="inputs-modal-confirm-button"
                  disabled={!isValid || loading}
                  type="submit"
                  onClick={() => this.handleConfirm(formikProps)}
                >
                  {isEdit ? "Save" : "Create"}
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  workflowActions: bindActionCreators(workflowActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(InputsModalContent);
