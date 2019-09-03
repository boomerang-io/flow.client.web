import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput, Toggle } from "carbon-components-react";
import Body from "@boomerang/boomerang-components/lib/ModalContentBody";
import ConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import Footer from "@boomerang/boomerang-components/lib/ModalContentFooter";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import { notify, Notification } from "@boomerang/boomerang-components/lib/Notifications";
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
    updatePropertyInStore: PropTypes.func
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
      data: newProperty
    })
      .then(response => {
        storeUpdate(newProperty);
        notify(
          <Notification
            type="success"
            title={isEdit ? "Property Updated" : "Property Created"}
            message={
              isEdit ? `Request to update ${newProperty.label} succeeded` : "Request to create property succeeded"
            }
          />
        );
        options.setSubmitting(false);
      })
      .then(() => {
        isEdit ? this.props.handleEditClose() : this.props.closeModal();
      })
      .catch(error => {
        notify(
          <Notification
            type="error"
            title={isEdit ? "Update Property Failed" : "Create Property Failed"}
            message={"Something went wrong"}
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
          secured: property ? property.type === INPUT_TYPES.PASSWORD : false
        }}
        onSubmit={this.handleSubmit}
        validationSchema={Yup.object().shape({
          label: Yup.string().required("Enter a label"),
          key: Yup.string()
            .required("Enter a key")
            .notOneOf(propertyKeys, "Key must be unique"),
          value: Yup.string().required("Enter a value"),
          description: Yup.string(),
          secured: Yup.boolean()
        })}
      >
        {props => {
          const { values, touched, errors, isSubmitting, isValid, handleChange, handleBlur, handleSubmit } = props;

          if (isSubmitting) {
            return <LoadingAnimation theme="bmrg-flow" message="We'll be right with you" />;
          }

          return (
            <form onSubmit={handleSubmit}>
              <Body
                style={{
                  display: "block",
                  margin: "auto",
                  width: "60%",
                  height: "28rem",
                  padding: "0 0.25rem 2rem",
                  overflowY: "auto"
                }}
              >
                <div className={styles.input}>
                  <TextInput
                    id="label"
                    labelText="Label"
                    placeholder="Label"
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
                    placeholder="Key"
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
                    placeholder="Description"
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.input}>
                  <TextInput
                    id="value"
                    labelText="Value"
                    placeholder="Value"
                    value={values.value}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={errors.value && touched.value}
                    invalidText={errors.value}
                  />
                </div>
                <div className={styles.toggleContainer}>
                  <Toggle name="secured" checked={values.secured} onChange={handleChange} labelText="Secured" />
                </div>
              </Body>
              <Footer style={{ flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
                <ConfirmButton
                  text={isEdit ? "SAVE" : "CREATE"}
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  theme="bmrg-flow"
                />
              </Footer>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default CreateEditPropertiesContent;
