import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFlowForm,
  ModalFooter,
  notify,
  ToastNotification,
  TextInput,
  Toggle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { InputType, PROPERTY_KEY_REGEX } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";

const configUrl = serviceUrl.getGlobalConfiguration();

function CreateEditPropertiesContent({ closeModal, isEdit, property, propertyKeys, cancelRequestRef }) {
  /** Add property */
  const [addGlobalPropertyMutation, { isLoading: addLoading, error: addError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.postGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(configUrl),
    }
  );

  /** Update property */
  const [updateGlobalPropertyMutation, { isLoading: updateLoading, error: updateError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(configUrl),
    }
  );

  const loading = addLoading || updateLoading;

  const handleSubmit = async (values) => {
    const type = values.secured ? InputType.Password : InputType.Text;
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
      } catch (err) {}
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
      } catch (err) {}
    }
  };

  // Check if key contains alpahanumeric, underscore, dash, and period chars
  const validateKey = (key) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  return (
    <Formik
      initialValues={{
        label: property && property.label ? property.label : "",
        description: property && property.description ? property.description : "",
        key: property && property.key ? property.key : "",
        value: property && property.value ? property.value : "",
        secured: property ? property.type === InputType.Password : false,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        label: Yup.string().required("Enter a label"),
        key: Yup.string()
          .required("Enter a key")
          .max(128, "Key must not be greater than 128 characters")
          .notOneOf(propertyKeys || [], "Enter a unique key value for this workflow")
          .test("is-valid-key", "Only alphanumeric, underscore, dash, and period characters allowed", validateKey),
        value: Yup.string().required("Enter a value"),
        description: Yup.string(),
        secured: Yup.boolean(),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            {loading && <Loading />}
            <ModalBody hasScrollingContent aria-label="inputs">
              <TextInput
                data-testid="create-property-key"
                id="key"
                labelText="Key"
                name="key"
                value={values.key}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.key && touched.key}
                invalidText={errors.key}
              />
              <TextInput
                data-testid="create-property-label"
                id="label"
                labelText="Label"
                name="label"
                value={values.label}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.label && touched.label}
                invalidText={errors.label}
              />
              <TextInput
                data-testid="create-property-description"
                id="description"
                labelText="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextInput
                data-testid="create-property-value"
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
              {addError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title={"Create Property Failed"}
                  subtitle={"Something's Wrong"}
                  data-testid="create-update-global-prop-notification"
                />
              )}
              {updateError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  title={"Update Property Failed"}
                  subtitle={"Something's Wrong"}
                  data-testid="create-update-global-prop-notification"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || loading}
                data-testid="global-property-create-submission-button"
              >
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
  cancelRequestRef: PropTypes.object.isRequired,
};

export default CreateEditPropertiesContent;
