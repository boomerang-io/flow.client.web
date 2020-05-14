import React from "react";
import PropTypes from "prop-types";
import { isCancel } from "axios";
import { useMutation, queryCache } from "react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Loading,
  ModalBody,
  ModalFlowForm,
  ModalFooter,
  notify,
  ToastNotification,
  TextInput,
  Toggle
} from "@boomerang/carbon-addons-boomerang-react";
import { formatErrorMessage } from "@boomerang/boomerang-utilities";
import INPUT_TYPES from "Constants/inputTypes";
import { QueryStatus } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";

const configUrl = serviceUrl.getGlobalConfiguration();

function CreateEditPropertiesContent({ closeModal, isEdit, property, propertyKeys, cancelRequestRef }) {
  /** Add property */
  const [addGlobalPropertyMutation, { status: addStatusg }] = useMutation(
    args => {
      const { promise, cancel } = resolver.postGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.refetchQueries(configUrl)
    }
  );
  const addLoading = addStatusg === QueryStatus.Loading;

  /** Update property */
  const [updateGlobalPropertyMutation, { status: updateStatus }] = useMutation(
    args => {
      const { promise, cancel } = resolver.patchGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.refetchQueries(configUrl)
    }
  );
  const updateLoading = updateStatus === QueryStatus.Loading;

  const loading = addLoading || updateLoading;

  const handleSubmit = async values => {
    const type = values.secured ? INPUT_TYPES.PASSWORD : INPUT_TYPES.TEXT;
    const newProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    delete newProperty.secured;

    if (isEdit) {
      try {
        await updateGlobalPropertyMutation({ id: newProperty.id, body: newProperty });
        notify(
          <ToastNotification
            kind="success"
            title={"Property Updated"}
            subtitle={`Request to update ${newProperty.label} succeeded`}
            data-testid="create-update-global-prop-notification"
          />
        );
        closeModal();
      } catch (err) {
        if (!isCancel(err)) {
          const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Update Property Failed" });
          notify(
            <ToastNotification
              kind="error"
              title={errorMessages.title}
              subtitle={errorMessages.message}
              data-testid="create-update-global-prop-notification"
            />
          );
        }
      }
    } else {
      try {
        await addGlobalPropertyMutation({ body: newProperty });
        notify(
          <ToastNotification
            kind="success"
            title="Property Created"
            subtitle="Request to create property succeeded"
            data-testid="create-update-global-prop-notification"
          />
        );
        closeModal();
      } catch (err) {
        if (!isCancel(err)) {
          const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Create Property Failed" });
          notify(
            <ToastNotification
              kind="error"
              title={errorMessages.title}
              subtitle={errorMessages.message}
              data-testid="create-update-global-prop-notification"
            />
          );
        }
      }
    }
  };

  return (
    <Formik
      initialValues={{
        label: property && property.label ? property.label : "",
        description: property && property.description ? property.description : "",
        key: property && property.key ? property.key : "",
        value: property && property.value ? property.value : "",
        secured: property ? property.type === INPUT_TYPES.PASSWORD : false
      }}
      onSubmit={handleSubmit}
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
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody>
              {loading && <Loading />}
              <TextInput
                id="label"
                labelText="Label"
                placeholder="Label"
                name="label"
                value={values.label}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.label && touched.label}
                invalidText={errors.label}
              />
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
              <TextInput
                id="description"
                labelText="Description"
                placeholder="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextInput
                id="value"
                labelText="Value"
                placeholder="Value"
                name="value"
                value={values.value}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.value && touched.value}
                invalidText={errors.value}
                type={values.secured ? "password" : "text"}
              />
              <Toggle
                id="secured-global-properties-toggle"
                labelText="Secured"
                name="secured"
                onChange={handleChange}
                orientation="vertical"
                toggled={values.secured}
                data-testid="secured-global-properties-toggle"
              />
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || loading}>
                {isEdit ? (loading ? "Saving..." : "Save") : loading ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

CreateEditPropertiesContent.propTypes = {
  closeModal: PropTypes.func,
  isEdit: PropTypes.bool,
  property: PropTypes.object,
  propertyKeys: PropTypes.array.isRequired,
  cancelRequestRef: PropTypes.object.isRequired
};

export default CreateEditPropertiesContent;
