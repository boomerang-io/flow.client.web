import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  InlineNotification,
  ModalBody,
  ModalFooter,
  TextInput,
  Toggle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { ModalFlowForm, notify, ToastNotification, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { InputType, PROPERTY_KEY_REGEX, PASSWORD_CONSTANT } from "Constants";
import { PatchProperty, Property, FlowTeam } from "Types";
import { updatedDiff } from "deep-object-diff";

type Props = {
  closeModal: () => void;
  isEdit: boolean;
  property: Property;
  propertyKeys: string[];
  team: FlowTeam;
  cancelRequestRef: any;
};

function CreateEditTeamPropertiesModalContent({
  closeModal,
  isEdit,
  property,
  propertyKeys,
  team,
  cancelRequestRef,
}: Props) {
  const initialState = {
    label: property?.label ?? "",
    description: property?.description ?? "",
    key: property?.key ?? "",
    value: property?.value ?? "",
    secured: property?.type === InputType.Password ?? false,
  };
  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: team.id });
  const queryClient = useQueryClient();

  /** Add Team Property */
  const { mutateAsync: addTeamPropertyMutation, isLoading: addIsLoading, error: addError } = useMutation(
    (args: { id: string; body: Property }) => {
      const { promise, cancel } = resolver.postTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(teamPropertiesUrl),
    }
  );

  /** Update Team Property */
  const { mutateAsync: updateTeamPropertyMutation, isLoading: updateIsLoading, error: updateError } = useMutation(
    (args: { teamId: string; configurationId: string; body: PatchProperty }) => {
      const { promise, cancel } = resolver.patchTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(teamPropertiesUrl),
    }
  );

  const loading = addIsLoading || updateIsLoading;

  const handleSubmit = async (values: any) => {
    const type = values.secured ? InputType.Password : InputType.Text;
    const newTeamProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    delete newTeamProperty.secured;

    if (isEdit) {
      const updatedFields = updatedDiff(initialState, newTeamProperty);
      try {
        const response = await updateTeamPropertyMutation({
          teamId: team.id,
          configurationId: newTeamProperty.id,
          body: updatedFields,
        });
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Updated"}
            subtitle={`Request to update ${response.data.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
        closeModal();
      } catch (err) {}
    } else {
      try {
        const response = await addTeamPropertyMutation({ id: team.id, body: newTeamProperty });
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Created"}
            subtitle={`Request to create ${response.data.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
        closeModal();
      } catch (err) {
        //no-op
      }
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
          .notOneOf(propertyKeys || [], "Enter a unique key value for this parameter")
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
            <ModalBody aria-label="inputs">
              {loading && <Loading />}
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
                id="description"
                labelText="Description (optional)"
                placeholder="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextInput
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
                    ? "Secure values are stored in our database. You can provide a new value to override"
                    : null
                }
              />
              <Toggle
                id="secured-team-parameters-toggle"
                data-testid="secured-team-parameters-toggle"
                disabled={isEdit}
                labelText="Secured"
                name="secured"
                onChange={handleChange}
                orientation="vertical"
                toggled={values.secured}
                helperText="Once a parameter is created, secured state will not be able to be updated"
              />
              {addError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  subtitle={"Request to create parameter failed"}
                  title={"Something's Wrong"}
                  data-testid="create-update-team-prop-notification"
                />
              )}
              {updateError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  subtitle={"Request to update parameter failed"}
                  title={"Something's Wrong"}
                  data-testid="create-update-team-prop-notification"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                data-testid="team-parameter-create-edit-submission-button"
                type="submit"
                disabled={!isValid || loading}
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

export default CreateEditTeamPropertiesModalContent;
