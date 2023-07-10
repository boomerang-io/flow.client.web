import React from "react";
import moment from "moment";
import * as Yup from "yup";
import { Button, DatePicker, DatePickerInput, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { ModalFlowForm, TextArea, TextInput, Loading, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
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
  activeTeam: FlowTeam | null;
  getTeamTokensUrl: string;
}

function CreateServiceTokenForm({
  closeModal,
  goToStep,
  saveValues,
  setIsTokenCreated,
  activeTeam,
  getTeamTokensUrl,
}: CreateServiceTokenFormProps | any) {
  const queryClient = useQueryClient();
  const tokenRequestMutation = useMutation(resolver.postToken);

  const createToken = async (values: any) => {
    const request = {
      name: values.name,
      type: values.type,
      expirationDate: values.date ? parseInt(moment.utc(values.date).startOf("day").format("x"), 10) : null,
      description: values.description,
      principal: values.principal,
    };

    try {
      const response = await tokenRequestMutation.mutateAsync({ body: request });
      queryClient.invalidateQueries(getTeamTokensUrl);
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
        name: "",
        type: "team",
        expirationDate: "",
        description: "",
        principal: activeTeam.id,
      }}
      validateOnMount
      onSubmit={(values) => createToken(values)}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .matches(/^[a-z0-9-]+$/, "Name can only contain lowercase alphanumeric characters and dashes"),
        expirationDate: Yup.string()
          .max(10)
          .matches(/([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/, "Enter a valid date"),
        description: Yup.string().nullable(),
      })}
    >
      {({ errors, touched, handleBlur, handleSubmit, setFieldValue, isValid, isSubmitting, values }) => {
        return (
          <ModalFlowForm className={styles.container} onSubmit={handleSubmit}>
            <ModalBody>
              {isSubmitting && <Loading />}
              <div>
                <label className={styles.modalLabel} htmlFor="uploadTemplate">
                  Create a new new {values.type} token.
                </label>
                <p className={styles.modalHelper}>
                  A token must have a name. If no expiry is set, this token will never expire - this is dangerous
                </p>
                <TextInput
                  id="name"
                  invalid={Boolean(errors.name && touched.name)}
                  invalidText={errors.name}
                  labelText="Name"
                  helperText="Must be unique and only contain lowercase alphanumeric characters and dashes"
                  onBlur={handleBlur}
                  onChange={(value: any) => setFieldValue("name", value.target.value)}
                  placeholder="my-unique-task-name"
                  value={values.name}
                />
                {/* <TextInput id="type" labelText="Type" onBlur={handleBlur} value={values.type} readOnly disabled /> */}
                <DatePicker
                  id="token-date-picker"
                  dateFormat="Y/m/d"
                  datePickerType="single"
                  onChange={(value: any) => handleSelectDate(setFieldValue, "expirationDate", value)}
                  minDate={moment.utc(new Date()).add(1, "days").format("YYYY/MM/DD")}
                >
                  <DatePickerInput
                    autoComplete="off"
                    data-testid="token-expiration-id"
                    id="expirationDate"
                    dateFormat="MM-DD-YYYY"
                    invalid={Boolean(errors.expirationDate)}
                    invalidText={errors.expirationDate}
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
                    onChange={(value: any) => handleSelectDate(setFieldValue, "expirationDate", value)}
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
                {tokenRequestMutation.error ? (
                  <InlineNotification
                    lowContrast
                    className={styles.errorNotification}
                    kind="error"
                    title="Error"
                    subtitle="Failed to create team token"
                    style={{ marginTop: "1rem" }}
                  />
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                disabled={!isValid || isSubmitting || tokenRequestMutation.isLoading}
                type="submit"
                data-testid="create-token-submit"
              >
                {isSubmitting ? "Creating..." : tokenRequestMutation.error ? "Try again" : "Create"}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}

export default CreateServiceTokenForm;
