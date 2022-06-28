import React from "react";
import { useMutation, useQueryClient } from "react-query";
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
import { InputType, PROPERTY_KEY_REGEX, PASSWORD_CONSTANT } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Property, PatchProperty } from "Types";
import { updatedDiff } from "deep-object-diff";

type Props = {
  closeModal: () => void;
  isEdit: boolean;
  property: Property;
  propertyKeys: string[];
  cancelRequestRef: any;
};

const configUrl = serviceUrl.getGlobalConfiguration();

function CreateEditPropertiesContent({ closeModal, isEdit, property, propertyKeys, cancelRequestRef }: Props) {
  const initialState = {
    label: property?.label ?? "",
    description: property?.description ?? "",
    key: property?.key ?? "",
    value: property?.value ?? "",
    secured: property?.type === InputType.Secured ?? false,
  };

  const queryClient = useQueryClient();
  /** Add property */
  const { mutateAsync: addGlobalPropertyMutation, isLoading: addLoading, error: addError } = useMutation(
    (args: { body: Property }) => {
      const { promise, cancel } = resolver.postGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(configUrl),
    }
  );

  /** Update property */
  const { mutateAsync: updateGlobalPropertyMutation, isLoading: updateLoading, error: updateError } = useMutation(
    (args: { id: string; body: PatchProperty }) => {
      const { promise, cancel } = resolver.patchGlobalPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(configUrl),
    }
  );

  const loading = addLoading || updateLoading;

  const handleSubmit = async (values: any) => {
    const type = values.secured ? InputType.Secured : InputType.Text;
    const newProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    delete newProperty.secured;

    if (isEdit) {
      const updatedFields = updatedDiff(initialState, newProperty);
      try {
        await updateGlobalPropertyMutation({ id: newProperty.id, body: updatedFields });
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
  const validateKey = (key: any) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  return (
    <Formik
      initialValues={initialState}
      onSubmit={handleSubmit}
      validateOnMount
      validationSchema={Yup.object().shape({
        label: Yup.string().required("Enter a label"),
        key: Yup.string()
          .required("Enter a key")
          .max(128, "Key must not be greater than 128 characters")
          .notOneOf(propertyKeys || [], "Enter a unique key value for this property")
          .test(
            "is-valid-key",
            "Only alphanumeric, hyphen and underscore characters allowed. Must begin with a letter or underscore",
            validateKey
          ),
        value: Yup.string().when("secured", {
          is: (value: boolean) => value && isEdit,
          then: Yup.string(),
          otherwise: Yup.string().required("Enter a value"),
        }),
        description: Yup.string(),
        secured: Yup.boolean(),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            {loading && <Loading />}
            <ModalBody aria-label="inputs">
              <TextInput
                data-testid="create-parameter-key"
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
                data-testid="create-parameter-label"
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
                data-testid="create-parameter-description"
                id="description"
                labelText="Description (optional)"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextInput
                data-testid="create-parameter-value"
                id="value"
                labelText="Value"
                placeholder={isEdit && values.secured ? PASSWORD_CONSTANT : "Value"}
                name="value"
                value={values.value}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={errors.value && touched.value}
                invalidText={errors.value}
                type={values.secured ? "password" : "text"}
                helperText={
                  isEdit && values.secured
                    ? "Default values are stored securely and cannot be viewed once created. To update, provide a new default value."
                    : null
                }
              />
              <Toggle
                id="secured-global-parameters-toggle"
                disabled={isEdit}
                labelText="Secured"
                name="secured"
                onChange={handleChange}
                orientation="vertical"
                toggled={values.secured}
                data-testid="secured-global-parameters-toggle"
                helperText="Once a parameter is securely created - you will not be able to view it or make it unsecure."
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
                data-testid="global-parameter-create-submission-button"
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

export default CreateEditPropertiesContent;
