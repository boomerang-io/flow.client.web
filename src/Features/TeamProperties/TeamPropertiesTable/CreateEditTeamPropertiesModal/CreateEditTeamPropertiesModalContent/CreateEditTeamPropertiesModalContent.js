import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
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
import { InputType, PROPERTY_KEY_REGEX } from "Constants";
import styles from "./createEditTeamPropertiesModalContent.module.scss";

function CreateEditTeamPropertiesModalContent({ closeModal, isEdit, property, propertyKeys, team, cancelRequestRef }) {
  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: team.id });

  /** Add Team Property */
  const [addTeamPropertyMutation, { isLoading: addIsLoading, error: addError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.postTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(teamPropertiesUrl),
    }
  );

  /** Update Team Property */
  const [updateTeamPropertyMutation, { isLoading: updateIsLoading, error: updateError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(teamPropertiesUrl),
    }
  );

  const loading = addIsLoading || updateIsLoading;

  const handleSubmit = async (values) => {
    const type = values.secured ? InputType.Password : InputType.Text;
    const newTeamProperty = isEdit ? { ...values, type, id: property.id } : { ...values, type };
    delete newTeamProperty.secured;

    if (isEdit) {
      try {
        const response = await updateTeamPropertyMutation({
          teamId: team.id,
          configurationId: newTeamProperty.id,
          body: newTeamProperty,
        });
        notify(
          <ToastNotification
            kind="success"
            title={"Property Updated"}
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
            title={"Property Created"}
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
  const validateKey = (key) => {
    return PROPERTY_KEY_REGEX.test(key);
  };

  return (
    <Formik
      initialValues={{
        value: property && property.value ? property.value : "",
        key: property && property.key ? property.key : "",
        label: property && property.label ? property.label : "",
        description: property && property.description ? property.description : "",
        secured: property ? property.type === InputType.Password : false,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        label: Yup.string().required("Enter a label"),
        key: Yup.string()
          .required("Enter a key")
          .max(128, "Key must not be greater than 128 characters")
          .notOneOf(propertyKeys || [], "Enter a unique key value for this property")
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
            <ModalBody aria-label="inputs" className={styles.formBody}>
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
                id="secured-team-properties-toggle"
                data-testid="secured-team-properties-toggle"
                labelText="Secured"
                name="secured"
                onChange={handleChange}
                orientation="vertical"
                toggled={values.secured}
              />
              {addError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  subtitle={"Request to create property failed"}
                  title={"Something's Wrong"}
                  data-testid="create-update-team-prop-notification"
                />
              )}
              {updateError && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  subtitle={"Request to update property failed"}
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
                data-testid="team-property-create-edit-submission-button"
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

CreateEditTeamPropertiesModalContent.propTypes = {
  isEdit: PropTypes.bool,
  property: PropTypes.object,
  propertyKeys: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  cancelRequestRef: PropTypes.object.isRequired,
};

export default CreateEditTeamPropertiesModalContent;
