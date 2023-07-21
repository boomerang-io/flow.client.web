//@ts-nocheck
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { Add } from "@carbon/react/icons";
import { ModalFlow, ModalFlowForm, TextInput, Toggle } from "@boomerang-io/carbon-addons-boomerang-react";
import { InputType, PROPERTY_KEY_REGEX, PASSWORD_CONSTANT } from "Constants";
import { Property } from "Types";
import { updatedDiff } from "deep-object-diff";
import styles from "./createEditparametersModal.module.scss";

type Props = {
  handleClose?: () => void;
  handleSubmit: (isEdit: boolean, values: any) => Promise<void>;
  isEdit?: boolean;
  isOpen?: boolean;
  parameter?: Property;
  parameters: Property[];
};

function CreateEditParametersModal({ handleClose, handleSubmit, isEdit, isOpen, parameter, parameters }: Props) {
  /**
   * arrays of values for making the key unique
   * filter out own value if editing a property, pass through all if creating
   */
  let parameterKeys: string[] | [] = [];
  if (Array.isArray(parameters)) {
    parameterKeys = parameters.map((configurationObj) => configurationObj.key);
    if (isEdit && parameter) {
      parameterKeys = parameterKeys.filter((item) => item !== parameter.key);
    }
  }
  const initialState = {
    label: parameter?.label ?? "",
    description: parameter?.description ?? "",
    key: parameter?.key ?? "",
    value: parameter?.value ?? "",
    secured: parameter?.type === InputType.Password ?? false,
  };

  const handleInternalSubmit = async (values: any) => {
    const type = values.secured ? InputType.Password : InputType.Text;
    const newParameter = isEdit ? { ...values, type, id: parameter.id } : { ...values, type };
    delete newParameter.secured;

    if (isEdit) {
      const updatedFields = updatedDiff(initialState, newParameter);
      handleSubmit(true, updatedFields);
    } else {
      handleSubmit(false, newParameter);
    }
  };

  return (
    //TODO - make ComposedModal
    <ModalFlow
      isOpen={isOpen}
      composedModalProps={{ containerClassName: styles.modalContainer }}
      modalProps={{ shouldCloseOnOverlayClick: false }}
      modalTrigger={({ openModal }: { openModal: () => void }) =>
        !isEdit ? (
          <Button
            data-testid="create-team-parameter-button"
            onClick={openModal}
            iconDescription="Create Parameter"
            renderIcon={Add}
            size="md"
            style={{ minWidth: "9rem" }}
          >
            Create Parameter
          </Button>
        ) : null
      }
      modalHeaderProps={{
        title: isEdit && parameter ? `Edit ${parameter.label.toUpperCase()}` : "Create Parameter",
      }}
      onCloseModal={() => {
        if (isEdit) handleClose();
      }}
    >
      {({ closeModal }) => (
        <Form
          handleSubmit={handleInternalSubmit}
          isSubmitting={isSubmitting}
          createError={createTaskTemplateMutation.error}
          taskTemplateNames={taskTemplateNames}
          closeModal={closeModal}
        />
      )}
    </ModalFlow>
  );
}

type FormProps = {
  closeModal: () => void;
  handleSubmit: (values: any) => void;
  isSubmitting: boolean;
  error: string | null;
  initialState: any;
};

function Form({ closeModal, handleSubmit, isSubmitting, error, initialState }: FormProps) {
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
          .notOneOf(parameterKeys || [], "Enter a unique key value for this parameter")
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
        const { values, touched, errors, isValid, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
        return (
          <ModalFlowForm onSubmit={handleSubmit}>
            <ModalBody aria-label="inputs">
              <TextInput
                id="key"
                labelText="Key"
                placeholder="Key"
                name="key"
                value={values.key}
                onBlur={handleBlur}
                onChange={handleChange}
                invalid={Boolean(errors.key && touched.key)}
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
                invalid={Boolean(errors.label && touched.label)}
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
                invalid={Boolean(errors.value && touched.value)}
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
                onToggle={(value: string) => setFieldValue("secured", value)}
                orientation="vertical"
                toggled={values.secured}
                helperText="Once a parameter is securely created - you will not be able to make it unsecure"
              />
              {error && (
                <InlineNotification
                  lowContrast
                  kind="error"
                  subtitle={`Request to ${isEdit ? "create" : "update"} parameter failed`}
                  title={"Something's Wrong"}
                  data-testid="create-update-parameter-notification"
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
                disabled={!isValid || isSubmitting}
              >
                {isEdit ? (isSubmitting ? "Saving..." : "Save") : isSubmitting ? "Creating..." : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default CreateEditParametersModal;
