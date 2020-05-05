import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput, Toggle } from "carbon-components-react";
import { Button, ModalBody, ModalFooter } from "carbon-components-react";
import { ModalFlowForm, notify, ToastNotification } from "@boomerang/carbon-addons-boomerang-react";
import Loading from "Components/Loading";
import INPUT_TYPES from "Constants/inputTypes";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import styles from "./createEditPropertiesContent.module.scss";

class CreateEditPropertiesContent extends Component {
  static propTypes = {
    addPropertyInStore: PropTypes.func,
    closeModal: PropTypes.func,
    handleEditClose: PropTypes.func,
    isEdit: PropTypes.bool,
    property: PropTypes.object,
    propertyKeys: PropTypes.array.isRequired,
    updatePropertyInStore: PropTypes.func,
  };

  handleSubmit = (values, options) => {
    const { addPropertyInStore, isEdit, property, updatePropertyInStore } = this.props;
    const type = values.secured ? INPUT_TYPES.PASSWORD : INPUT_TYPES.TEXT;
    const newProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    const storeUpdate = isEdit ? updatePropertyInStore : addPropertyInStore;
    delete newProperty.secured;

    axios({
      method: isEdit ? "put" : "post",
      url: isEdit ? `${BASE_SERVICE_URL}/config/${newProperty.id}` : `${BASE_SERVICE_URL}/config`,
      data: newProperty,
    })
      .then((response) => {
        storeUpdate(newProperty);
        notify(
          <ToastNotification
            kind="success"
            title={isEdit ? "Property Updated" : "Property Created"}
            subtitle={
              isEdit ? `Request to update ${newProperty.label} succeeded` : "Request to create property succeeded"
            }
          />
        );
        options.setSubmitting(false);
      })
      .then(() => {
        isEdit ? this.props.handleEditClose() : this.props.closeModal();
      })
      .catch((error) => {
        notify(
          <ToastNotification
            kind="error"
            title={isEdit ? "Update Property Failed" : "Create Property Failed"}
            subtitle={"Something went wrong"}
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
          label: property ? property.label : "",
          description: property ? property.description : "",
          key: property ? property.key : "",
          value: property ? property.value : "",
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
              <ModalBody>
                {isSubmitting && <Loading />}
                <div className={styles.input}>
                  <TextInput
                    id="label"
                    labelText="Label"
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
                    labelText="key"
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
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.input}>
                  <TextInput
                    id="value"
                    labelText="Value"
                    value={values.value}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.value && touched.value}
                    invalidText={errors.value}
                  />
                </div>
                <div className={styles.toggleContainer}>
                  <Toggle
                    id="secured"
                    name="secured"
                    toggled={values.secured}
                    onChange={handleChange}
                    labelText="Secured"
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

export default CreateEditPropertiesContent;
