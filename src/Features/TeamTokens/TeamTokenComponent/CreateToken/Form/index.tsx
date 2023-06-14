import React from "react";
import moment from "moment";
import * as Yup from "yup";
import { Button, DatePicker, DatePickerInput, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { ModalFlowForm, TextArea, Loading, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import { Information } from "@carbon/react/icons";
import { useMutation, useQueryClient } from "react-query";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { TeamTokenRequest, FlowTeam } from "Types";
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
  activeTeam: FlowTeam | null;
}

function CreateServiceTokenForm({
  closeModal,
  goToStep,
  saveValues,
  setIsTokenCreated,
  cancelRequestRef,
  activeTeam,
}: CreateServiceTokenFormProps | any) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: postTeamTokenRequestMutator,
    isLoading: postTeamTokenIsLoading,
    error: postTeamTokenError,
  } = useMutation(
    (args: { body: TeamTokenRequest }) => {
      const { promise, cancel } = resolver.postTeamToken(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryClient.invalidateQueries([serviceUrl.getTeamTokens({ teamId: activeTeam.id })]),
    }
  );

  const createToken = async (values: any) => {
    const request = {
      expiryDate: values.date ? parseInt(moment.utc(values.date).startOf("day").format("x"), 10) : null,
      description: values.description,
      teamId: activeTeam.id,
    };

    try {
      const response = await postTeamTokenRequestMutator({ body: request });
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
      {({ errors, handleSubmit, setFieldValue, isValid, isSubmitting, values }) => {
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
                  invalid={Boolean(errors.date)}
                  invalidText={errors.date}
                  labelText={
                    <div className={styles.inputLabelContainer}>
                      <span>Expiration Date (optional)</span>
                      <TooltipHover
                        direction="top"
                        tooltipContent="Expiration date will be saved in Coordinated Universal Time (UTC) with the token expiring at
                          the start of the entered day. The token will not expire by default if no expiration date is
                          entered."
                      >
                        <Information />
                      </TooltipHover>
                    </div>
                  }
                  onChange={(value: any) => handleSelectDate(setFieldValue, InputKey.ExpiryDate, value)}
                  pattern={null}
                  placeholder="2063/04/05"
                />
              </DatePicker>
              <TextArea
                labelText="Description (optional)"
                placeholder="Provide a short description for this Token"
                id="description"
                data-testid="token-description"
                onChange={(value: any) => setFieldValue("description", value.target.value)}
                value={values.description}
              />
              {postTeamTokenError ? (
                <InlineNotification
                  lowContrast
                  className={styles.errorNotification}
                  kind="error"
                  title="Error"
                  subtitle="Failed to create team token"
                  style={{ marginTop: "1rem" }}
                />
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                disabled={!isValid || isSubmitting || postTeamTokenIsLoading}
                type="submit"
                data-testid="create-token-submit"
              >
                {isSubmitting ? "Creating..." : postTeamTokenError ? "Try again" : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default CreateServiceTokenForm;
