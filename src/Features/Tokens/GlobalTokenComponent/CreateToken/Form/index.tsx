import React from "react";
import moment from "moment";
import * as Yup from "yup";
import {
  ModalFlowForm,
  Button,
  DatePicker,
  DatePickerInput,
  InlineNotification,
  ModalBody,
  ModalFooter,
  TextArea,
  Tooltip,
  Loading,
} from "@carbon/react";
import { Formik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { TokenRequest } from "Types";
import styles from "./form.module.scss";

const InputKey = {
  ExpiryDate: "date",
  Description: "description",
};

interface CreateServiceTokenFormProps {
  closeModal: () => void;
  goToStep: (args: any) => void;
  saveValues: (args: any) => void;
  setIsTokenCreated: () => any;
  cancelRequestRef: any;
}

function CreateServiceTokenForm({
  closeModal,
  goToStep,
  saveValues,
  setIsTokenCreated,
  cancelRequestRef,
}: CreateServiceTokenFormProps | any) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: postGlobalTokenRequestMutator,
    isLoading: postGlobalTokenIsLoading,
    error: postGlobalTokenError,
  } = useMutation(
    (args: { body: TokenRequest }) => {
      const { promise, cancel } = resolver.postGlobalToken(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries([serviceUrl.getGlobalTokens()]),
    }
  );

  const createToken = async (values: any) => {
    const request = {
      expiryDate: values.date ? parseInt(moment.utc(values.date).startOf("day").format("x"), 10) : null,
      description: values.description,
    };

    try {
      const response = await postGlobalTokenRequestMutator({ body: request });
      const formData = { token: response.data.tokenValue };
      saveValues(formData);
      setIsTokenCreated();
      goToStep(1);
    } catch (error) {
      //noop
    }
  };

  const handleSelectDate = (setFieldValue: any, id: string, value: any) => {
    if (Array.isArray(value) && value[0]) {
      setFieldValue("date", String(moment.utc(value[0]).format("YYYY/MM/DD")));
    } else {
      setFieldValue("date", value?.target?.value);
    }
  };

  return (
    <Formik
      initialValues={{
        date: "",
        description: "",
      }}
      validateOnMount
      onSubmit={(values) => createToken(values)}
      validationSchema={Yup.object().shape({
        [InputKey.ExpiryDate]: Yup.string()
          .max(10)
          .matches(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/, "Enter a valid date"),
        [InputKey.Description]: Yup.string().nullable(),
      })}
    >
      {({ errors, handleBlur, handleSubmit, setFieldValue, isValid, isSubmitting, values }) => {
        return (
          <ModalFlowForm className={styles.container} onSubmit={handleSubmit}>
            <ModalBody>
              {isSubmitting && <Loading />}
              <DatePicker
                id="token-date-picker"
                dateFormat="Y/m/d"
                datePickerType="single"
                onChange={(value: any) => handleSelectDate(setFieldValue, InputKey.ExpiryDate, value)}
                minDate={moment.utc(new Date()).add(1, "days").format("YYYY/MM/DD")}
              >
                <DatePickerInput
                  autoComplete="off"
                  data-testid="token-expiration-id"
                  id={InputKey.ExpiryDate}
                  dateFormat="MM-DD-YYYY"
                  invalid={errors.date}
                  invalidText={errors.date}
                  labelText={
                    <div className={styles.inputLabelContainer}>
                      <p>Expiration Date (optional)</p>
                      <Tooltip direction="top" iconDescription="Additional Documentation">
                        <p>
                          Expiration date will be saved in Coordinated Universal Time (UTC) with the token expiring at
                          the start of the entered day. The token will not expire by default if no expiration date is
                          entered.
                        </p>
                      </Tooltip>
                    </div>
                  }
                  onChange={(value: any) => handleSelectDate(setFieldValue, InputKey.ExpiryDate, value)}
                  pattern={null}
                  placeholder="2063/04/05"
                />
              </DatePicker>
              <TextArea
                labelText="Description"
                placeholder="Provide a short description for this Token"
                id="description"
                data-testid="token-description"
                onChange={(value: any) => setFieldValue("description", value.target.value)}
                value={values.description}
              />
              {postGlobalTokenError ? (
                <InlineNotification
                  lowContrast
                  className={styles.errorNotification}
                  kind="error"
                  title="Error"
                  subtitle="Failed to create global token"
                  style={{ marginTop: "1rem" }}
                />
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                disabled={!isValid || isSubmitting || postGlobalTokenIsLoading}
                type="submit"
                data-testid="create-token-submit"
              >
                {isSubmitting ? "Creating..." : postGlobalTokenError ? "Try again" : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default CreateServiceTokenForm;
