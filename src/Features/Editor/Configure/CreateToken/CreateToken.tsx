import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import { Edit16 } from "@carbon/icons-react";
import {
  Button,
  ComposedModal,
  InlineNotification,
  Loading,
  ModalBody,
  ModalFooter,
  ModalForm,
  notify,
  ToastNotification,
  TextInput,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { serviceUrl } from "Config/servicesConfig";

import styles from "./CreateToken.module.scss";

interface CreateTokenProps {
  tokenData: [
    {
      token: string;
      label: string;
    }
  ];
  formikPropsSetFieldValue: Function;
  workflowId: string;
}

const CreateToken: React.FC<CreateTokenProps> = ({ tokenData, formikPropsSetFieldValue, workflowId }) => {
  const takenTokenLabels: Array<string> = [];
  tokenData.forEach((token) => takenTokenLabels.push(token.label));

  return (
    <ComposedModal
      composedModalProps={{
        containerClassName: styles.modalContainer,
      }}
      modalHeaderProps={{
        title: "Create Token",
        subtitle: "Select a label for the token",
      }}
      modalTrigger={({ openModal }: { openModal: () => void }) => (
        <Button kind="ghost" renderIcon={Edit16} onClick={openModal} className={styles.editDetailsLink}>
          Add a new token
        </Button>
      )}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <CreateTokenModalContent
          tokenData={tokenData}
          takenTokenLabels={takenTokenLabels}
          closeModal={closeModal}
          formikPropsSetFieldValue={formikPropsSetFieldValue}
          workflowId={workflowId}
        />
      )}
    </ComposedModal>
  );
};

export default CreateToken;

interface CreateTokenModalContentProps {
  tokenData: [
    {
      token: string;
      label: string;
    }
  ];
  takenTokenLabels: Array<string>;
  closeModal: Function;
  formikPropsSetFieldValue: Function;
  workflowId: string;
}

const CreateTokenModalContent: React.FC<CreateTokenModalContentProps> = ({
  closeModal,
  takenTokenLabels,
  formikPropsSetFieldValue,
  tokenData,
  workflowId,
}) => {
  const [isError, setisError] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const generateToken = (values: { label: string }) => {
    setisLoading(true);
    axios
      .post(serviceUrl.postCreateWorkflowToken({ workflowId, label: encodeURI(values.label) }))
      .then((response) => {
        let newTokens = tokenData;
        let tokenIndex = newTokens.findIndex((obj) => obj.label === values.label);

        if (tokenIndex === -1) {
          newTokens.push(response.data);
        } else {
          newTokens[tokenIndex].token = response.data.token;
        }

        formikPropsSetFieldValue(`tokens`, newTokens);

        setisLoading(false);
        setisError(false);
        closeModal();

        notify(<ToastNotification kind="success" title="Generate Token" subtitle={`Successfully generated token`} />);
      })
      .catch((err) => {
        setisLoading(false);
        setisError(true);
      });
  };

  let buttonText = "Create";
  if (isLoading) {
    buttonText = "Creating...";
  } else if (isError) {
    buttonText = "Try again";
  }

  return (
    <Formik
      initialValues={{
        label: "",
      }}
      onSubmit={generateToken}
      validationSchema={Yup.object().shape({
        label: Yup.string()
          .required("Enter a team name")
          .min(4, "Token label must be at least four characters")
          .max(80, "Token label must be 80 characters or less")
          .matches(/^[a-zA-Z0-9 ]+$/, "Token label must only contain ASCII alphanumeric characters and spaces")
          .notOneOf(takenTokenLabels, "Token label must not already be in use"),
      })}
    >
      {(formikProps) => {
        const { values, setFieldValue, handleSubmit, errors, touched } = formikProps;
        return (
          <ModalForm>
            <ModalBody>
              <div className={styles.modalInputContainer}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <TextInput
                    id="create-label-id"
                    labelText="Label"
                    helperText="Must be unique"
                    value={values.label}
                    onChange={(value: any) => {
                      setFieldValue("label", value.target.value);
                    }}
                    invalid={errors.label && !touched.label}
                    invalidText={errors.label}
                  />
                )}
                {isError && (
                  <InlineNotification
                    kind="error"
                    lowContrast
                    title="Token creation failed!"
                    subtitle="Give it another go or try again later."
                  />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={Boolean(errors.label) || values.label === "" || isLoading} onClick={handleSubmit}>
                {buttonText}
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </Formik>
  );
};
