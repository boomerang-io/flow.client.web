import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as workflowActions } from "State/workflow";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash.get";
import clonedeep from "lodash.clonedeep";
import { TextArea, TextInput } from "carbon-components-react";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import Toggle from "@boomerang/boomerang-components/lib/Toggle";
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
class InputsModalContent extends Component {
  static propTypes = {
    updateInputs: PropTypes.func.isRequired,
    input: PropTypes.object,
    isEdit: PropTypes.bool,
    workflowActions: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    inputsNames: PropTypes.array,
    loading: PropTypes.bool.isRequired
  };

  handleOnChange = (e, formikChange) => {
    this.props.shouldConfirmExit(true);
    formikChange(e);
  };

  handleOnFieldValueChange = (value, id, setFieldValue) => {
    this.props.shouldConfirmExit(true);
    setFieldValue(id, value);
  };

  handleOnTypeChange = (value, setFieldValue) => {
    this.props.shouldConfirmExit(true);
    setFieldValue(FIELD.TYPE, value.value);
    setFieldValue(FIELD.DEFAULT_VALUE, value.value === INPUT_TYPES.BOOLEAN ? false : undefined);
  };

  // Only save an array of strings to match api and simplify renderDefaultValue()
  handleValidValuesChange = (values, setFieldValue) => {
    this.props.shouldConfirmExit(true);
    setFieldValue(FIELD.VALID_VALUES, values.map(option => option.value));
  };

  /* Check if key contains space or special characters, only underline is allowed */
  validateKey = key => {
    const regexp = new RegExp("[^a-z|^A-Z|^0-9|^_|/.]");
    return !regexp.test(key);
  };

  // dispatch Redux action to update store
  handleConfirm = formikProps => {
    const inputProperties = clonedeep(formikProps.values);

    //remove in case they are present if the user changed their mind
    if (inputProperties.type !== INPUT_TYPES.SELECT) {
      delete inputProperties.validValues;
    }

    if (inputProperties.type === INPUT_TYPES.BOOLEAN) {
      if (!inputProperties.defaultValue) inputProperties.defaultValue = false;
    }

    console.log(inputProperties);

    if (this.props.isEdit) {
      new Promise(resolve => resolve(this.props.workflowActions.updateWorkflowInput(inputProperties)))
        .then(() =>
          this.props.updateInputs({ title: "Edit Input", message: "Successfully edited input", type: "edit" })
        )
        .then(() => {
          this.props.closeModal();
        });
    } else {
      new Promise(resolve => resolve(this.props.workflowActions.createWorkflowInput(inputProperties)))
        .then(() =>
          this.props.updateInputs({ title: "Create Input", message: "Successfully created input", type: "create" })
        )
        .then(() => {
          this.props.closeModal();
        });
    }
  };

  renderDefaultValue = formikProps => {
    const { values, handleBlur, handleChange, setFieldValue } = formikProps;

    switch (values.type) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <div className="b-inputs-modal-toggle">
            <div className="b-inputs-modal-toggle__title">Default Value</div>
            <Toggle
              id={FIELD.DEFAULT_VALUE}
              aria-labelledby="toggle-default-value"
              onChange={(checked, event, id) => this.handleOnFieldValueChange(checked.toString(), id, setFieldValue)}
              checked={values.defaultValue === "true"}
              theme="bmrg-flow"
            />
          </div>
        );
      case INPUT_TYPES.SELECT:
        let validValues = clonedeep(values.validValues);

        //convert to object so it works with SelectDropdown component
        if (Array.isArray(validValues)) {
          validValues = validValues.map(value => ({
            value: value,
            label: value
          }));
        }
        return (
          <>
            <div className="b-inputs-modal-select">
              <SelectDropdown
                id={FIELD.VALID_VALUES}
                multi
                isCreatable
                titleClass="b-inputs-modal-select__title"
                styles={{ width: "100%", marginBottom: "2rem" }}
                onChange={values => this.handleValidValuesChange(values, setFieldValue)}
                options={validValues || []}
                value={validValues || []}
                theme="bmrg-flow"
                title="Options"
                placeholder="Enter option"
                noResultsText="No options entered"
              />
            </div>
            <div className="b-inputs-modal-select">
              <SelectDropdown
                id={FIELD.DEFAULT_VALUE}
                titleClass="b-inputs-modal-select__title"
                styles={{ width: "100%" }}
                onChange={value => this.handleOnFieldValueChange(value.value, FIELD.DEFAULT_VALUE, setFieldValue)}
                options={validValues || []}
                value={values.defaultValue || {}}
                theme="bmrg-flow"
                title="Default Option"
                placeholder="Select option"
                noResultsText="No options entered"
                clearable
              />
            </div>
          </>
        );
      case INPUT_TYPES.TEXT_AREA:
        return (
          <div className="b-inputs-modal-text-area">
            <TextArea
              id={FIELD.DEFAULT_VALUE}
              labelText="Default Value"
              placeholder="Default Value"
              value={values.defaultValue || ""}
              onBlur={handleBlur}
              onChange={e => this.handleOnChange(e, handleChange)}
            />
          </div>
        );
      default:
        // Fallback to text input here because it covers text, password, and url
        return (
          <div className="b-inputs-modal-text-input">
            <TextInput
              id={FIELD.DEFAULT_VALUE}
              labelText="Default Value"
              placeholder="Default Value"
              type={values.type}
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
          [FIELD.TYPE]: get(input, "type", INPUT_TYPES.TEXT),
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
          [FIELD.TYPE]: Yup.string(),
          [FIELD.VALID_VALUES]: Yup.array()
        })}
      >
        {formikProps => {
          const { values, touched, errors, handleBlur, handleChange, setFieldValue, isValid } = formikProps;

          return (
            <fieldset disabled={loading}>
              <ModalContentBody className="c-inputs-modal-body">
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
                    <div className="b-inputs-modal-toggle__title">Required</div>
                    <Toggle
                      id={FIELD.REQUIRED}
                      aria-labelledby="toggle-required"
                      checked={values.required}
                      onChange={(checked, event, id) => this.handleOnFieldValueChange(checked, id, setFieldValue)}
                      theme="bmrg-flow"
                    />
                  </div>
                </div>
                <div className="c-inputs-modal-body-right">
                  <div className="b-inputs-modal-type">
                    <SelectDropdown
                      id={FIELD.TYPE}
                      titleClass="b-inputs-modal-type__title"
                      onChange={value => this.handleOnTypeChange(value, setFieldValue)}
                      options={[
                        { label: "Boolean", value: "boolean" },
                        { label: "Number", value: "number" },
                        { label: "Password", value: "password" },
                        { label: "Select", value: "select" },
                        { label: "Text", value: "text" },
                        { label: "Text Area", value: "textarea" }
                      ]}
                      value={values.type}
                      theme="bmrg-flow"
                      title="Type"
                      styles={{ width: "100%" }}
                    />
                  </div>
                  {this.renderDefaultValue(formikProps)}
                </div>
              </ModalContentBody>
              <ModalContentFooter style={{ paddingTop: "1rem" }}>
                <ModalConfirmButton
                  disabled={!isValid || loading}
                  text={isEdit ? "SAVE" : "CREATE"}
                  theme="bmrg-flow"
                  type="submit"
                  onClick={() => this.handleConfirm(formikProps)}
                />
              </ModalContentFooter>
            </fieldset>
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
