import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache } from "react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, InlineNotification, ModalBody, ModalFooter, TextInput, Toggle } from "carbon-components-react";
import { ModalFlowForm, notify, ToastNotification, Loading } from "@boomerang/carbon-addons-boomerang-react";
import { serviceUrl, resolver } from "Config/servicesConfig";
import INPUT_TYPES from "Constants/inputTypes";
import styles from "./createEditTeamPropertiesModalContent.module.scss";
import { QueryStatus } from "Constants";

function CreateEditTeamPropertiesModalContent({ closeModal, isEdit, property, propertyKeys, team, cancelRequestRef }) {
  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: team.id });

  /** Add Team Property */
  const [addTeamPropertyMutation, { status: addStatus, error: addError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.postTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.refetchQueries(teamPropertiesUrl),
    }
  );
  const addIsLoading = addStatus === QueryStatus.Loading;

  /** Update Team Property */
  const [updateTeamPropertyMutation, { status: updateStatus, error: updateError }] = useMutation(
    (args) => {
      const { promise, cancel } = resolver.patchTeamPropertyRequest(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.refetchQueries(teamPropertiesUrl),
    }
  );
  const updateIsLoading = updateStatus === QueryStatus.Loading;

  const loading = addIsLoading || updateIsLoading;

  const handleSubmit = async (values) => {
    const type = values.secured ? INPUT_TYPES.PASSWORD : INPUT_TYPES.TEXT;
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
      } catch (err) {
      }
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
      }
    }
  };

  return (
    <Formik
      initialValues={{
        value: property && property.value ? property.value : "",
        key: property && property.key ? property.key : "",
        label: property && property.label ? property.label : "",
        description: property && property.description ? property.description : "",
        secured: property ? property.type === INPUT_TYPES.PASSWORD : false,
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        label: Yup.string().required("Enter a label"),
        key: Yup.string().required("Enter a key").notOneOf(propertyKeys, "Key must be unique"),
        value: Yup.string().required("Enter a value"),
        description: Yup.string(),
        secured: Yup.boolean(),
      })}
    >
      {(props) => {
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit } = props;

        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody className={styles.formBody}>
              {loading && <Loading />}
              <div className={styles.input}>
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
                  placeholder="Description"
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
                  placeholder="Value"
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
              {addError && (
                <InlineNotification
                  kind="error"
                  title={"Create Property Failed"}
                  subtitle={"Something's Wrong"}
                  data-testid="create-update-team-prop-notification"
                />
              )}
              {updateError && (
                <InlineNotification
                  kind="error"
                  lowContrast
                  title={"Update Property Failed"}
                  subtitle={"Something's Wrong"}
                  data-testid="create-update-team-prop-notification"
                />
              )}
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

CreateEditTeamPropertiesModalContent.propTypes = {
  isEdit: PropTypes.bool,
  property: PropTypes.object,
  propertyKeys: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired,
  cancelRequestRef: PropTypes.object.isRequired,
};

export default CreateEditTeamPropertiesModalContent;
