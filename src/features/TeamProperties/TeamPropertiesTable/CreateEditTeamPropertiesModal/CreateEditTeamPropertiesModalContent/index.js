import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, ModalBody, ModalFooter, TextInput, Toggle } from "carbon-components-react";
import { ModalFlowForm, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import Loading from "Components/Loading";
import { TEAM_PROPERTIES_ID_URL, TEAM_PROPERTIES_ID_PROPERTY_ID_URL } from "Config/servicesConfig";
import INPUT_TYPES from "Constants/inputTypes";
import styles from "./createEditTeamPropertiesModalContent.module.scss";

class CreateEditTeamPropertiesModalContent extends Component {
  static propTypes = {
    addTeamPropertyInStore: PropTypes.func,
    closeModal: PropTypes.func,
    handleEditClose: PropTypes.func,
    isEdit: PropTypes.bool,
    property: PropTypes.object,
    propertyKeys: PropTypes.array.isRequired,
    team: PropTypes.string.isRequired,
    updateTeamProperty: PropTypes.func,
  };

  handleSubmit = (values, options) => {
    const { isEdit, property, addTeamPropertyInStore, updateTeamProperty, team } = this.props;
    const type = values.secured ? INPUT_TYPES.PASSWORD : INPUT_TYPES.TEXT;
    const newTeamProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    const storeUpdate = isEdit ? updateTeamProperty : addTeamPropertyInStore;
    delete newTeamProperty.secured;

    axios({
      method: isEdit ? "patch" : "post",
      url: isEdit ? TEAM_PROPERTIES_ID_PROPERTY_ID_URL(team, newTeamProperty.id) : TEAM_PROPERTIES_ID_URL(team),
      data: newTeamProperty,
    })
      .then((response) => {
        storeUpdate(isEdit ? newTeamProperty : response.data);
        notify(
          <ToastNotification
            kind="success"
            title={isEdit ? "Property Updated" : "Property Created"}
            subtitle={
              isEdit
                ? `Request to update ${response.data.label} succeeded`
                : `Request to create ${response.data.label} succeeded`
            }
            data-testid="create-update-team-prop-notification"
          />
        );
        options.setSubmitting(false);
      })
      .then(() => {
        this.props.closeModal();
      })
      .catch((error) => {
        notify(
          <ToastNotification
            kind="error"
            title={isEdit ? "Update Property Failed" : "Create Property Failed"}
            subtitle={"Something went wrong"}
            data-testid="create-update-team-prop-notification"
          />
        );
        options.setSubmitting(false);
      });
  };

  render() {
    const { isEdit, property, propertyKeys } = this.props;

    return (
      <Formik
        initialValues={{
          value: property && property.value ? property.value : "",
          key: property && property.key ? property.key : "",
          label: property && property.label ? property.label : "",
          description: property && property.description ? property.description : "",
          secured: property ? property.type === INPUT_TYPES.PASSWORD : false,
        }}
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          label: Yup.string().required("Enter a label"),
          key: Yup.string()
            .required("Enter a key")
            .notOneOf(propertyKeys, "Key must be unique"),
          value: Yup.string().required("Enter a value"),
          description: Yup.string(),
          secured: Yup.boolean(),
        })}
      >
        {(props) => {
          const { values, touched, errors, isSubmitting, isValid, handleChange, handleBlur, handleSubmit } = props;

          return (
            <ModalFlowForm onSubmit={handleSubmit}>
              <ModalBody className={styles.formBody}>
                {isSubmitting && <Loading />}
                <div className={styles.input}>
                  <TextInput
                    id="label"
                    labelText="Label"
                    name="label"
                    value={values.label}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.label && touched.label}
                    invalidText={errors.label}
                  />
                </div>
                <div className={styles.input}>
                  <TextInput
                    id="key"
                    labelText="Key"
                    placeholder="Key"
                    name="key"
                    value={values.key}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.key && touched.key}
                    invalidText={errors.key}
                  />
                </div>
                <div className={styles.input}>
                  <TextInput
                    id="description"
                    labelText="Description"
                    name="description"
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.input}>
                  <TextInput
                    id="value"
                    labelText="Value"
                    name="value"
                    value={values.value}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.value && touched.value}
                    invalidText={errors.value}
                    type={values.secured ? "password" : "text"}
                  />
                </div>
                <div className={styles.toggleContainer}>
                  <Toggle
                    id="secured-team-properties-toggle"
                    data-testid="secured-team-properties-toggle"
                    labelText="Secured"
                    name="secured"
                    onChange={handleChange}
                    toggled={values.secured}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button kind="secondary" type="button" onClick={this.props.closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isEdit ? (isSubmitting ? "Saving..." : "Save") : isSubmitting ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </ModalFlowForm>
          );
        }}
      </Formik>
    );
  }
}

export default CreateEditTeamPropertiesModalContent;
