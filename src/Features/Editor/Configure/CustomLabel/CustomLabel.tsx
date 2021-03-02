//@ts-nocheck
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Edit16 } from "@carbon/icons-react";
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalForm,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import styles from "./CustomLabel.module.scss";

interface AddLabelProps {
  formikPropsSetFieldValue: Function;
  labels: Array<{ key: string; value: string }>;
}

const keyPrefixRegex = /^[a-zA-Z0-9]*([.\1][a-zA-Z0-9]+)*$/;
const keyNameAndValueRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*([a-zA-Z0-9])+$/;

const CustomLabel: React.FC<AddLabelProps> = ({ formikPropsSetFieldValue, labels }) => {
  const addLabel = ({ values }: { values: any }) => {
    const { key, value } = values;
    const newLabels = labels.concat({ key, value });
    formikPropsSetFieldValue("labels", newLabels);
  };

  return (
    <ComposedModal
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Add Custom Label",
        subtitle: "Create a key value pair for custom kubernetes label",
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" size="field" renderIcon={Edit16} onClick={openModal} className={styles.addNewToken}>
          Add a new label
        </Button>
      )}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <AddLabelModalContent
          labels={labels}
          formikPropsSetFieldValue={formikPropsSetFieldValue}
          addLabel={addLabel}
          closeModal={closeModal}
        />
      )}
    </ComposedModal>
  );
};

export default CustomLabel;

interface AddLabelModalContentProps {
  formikPropsSetFieldValue: Function;
  labels: Array<{ key: string; value: string }>;
  addLabel: Function;
  closeModal: Function;
}

const AddLabelModalContent: React.FC<AddLabelModalContentProps> = ({
  labels,
  formikPropsSetFieldValue,
  closeModal,
  addLabel,
}) => {
  function validateKey(key) {
    const keyParts: Array<string> | string = key?.split("/") ?? "";
    const prefix = keyParts[0];
    const name = keyParts[1];

    const isValidPrefix =
      key?.includes("/") && keyParts?.length === 2 ? keyPrefixRegex.test(prefix) && prefix?.length <= 253 : true;
    const isValidName =
      keyParts.length === 2
        ? keyNameAndValueRegex.test(name) && name?.length <= 63
        : keyNameAndValueRegex.test(key) && key?.length <= 63;
    if (isValidPrefix && isValidName) return true;
    else if (!isValidPrefix)
      return this.createError({ message: "Key Prefix must be a DNS subdomain not longer than 253 characters." });
    else
      return this.createError({
        message: "Key Name must have only alphanumeric and between them dashes, underscores, dots and not longer than 63 characters.",
      });
  }

  const validateValue = (value) => {
    return keyNameAndValueRegex.test(value) && value?.length <= 63;
  };

  return (
    <Formik
      initialValues={{
        key: "",
        value: "",
      }}
      onSubmit={(values) => {
        addLabel({ values });
        closeModal();
      }}
      validationSchema={Yup.object().shape({
        key: Yup.string()
          .required("Enter a label key")
          .test("validate-k8s-key", "Type a valid Kubernetes key", validateKey),
        value: Yup.string()
          .required("Enter a label value")
          .test("validate-k8s-value", "Value must have only alphanumeric and between them dashes, underscores, dots and not longer than 63 characters.", validateValue),
      })}
    >
      {(formikProps) => {
        const { values, handleSubmit, errors, touched, handleChange, handleBlur, dirty } = formikProps;
        return (
          <ModalForm>
            <ModalBody>
              <div className={styles.modalInputContainer}>
                <TextInput
                  id="key"
                  labelText="Label Key"
                  value={values.key}
                  onChange={handleChange}
                  invalid={errors.key && touched.key}
                  invalidText={errors.key}
                  onBlur={handleBlur}
                />
                <TextInput
                  id="value"
                  labelText="Label Value"
                  value={values.value}
                  onChange={handleChange}
                  invalid={errors.value && touched.value}
                  onBlur={handleBlur}
                  invalidText={errors.value}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={Boolean(errors.key) || Boolean(errors.value) || !dirty} onClick={handleSubmit}>
                Add
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </Formik>
  );
};
