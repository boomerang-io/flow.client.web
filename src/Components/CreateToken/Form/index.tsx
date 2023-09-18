import React from "react";
import moment from "moment";
import * as Yup from "yup";
import { useAppContext } from "Hooks";
import { Button, DatePicker, DatePickerInput, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import {
  ModalFlowForm,
  TextArea,
  TextInput,
  CheckboxList,
  RadioGroup,
  Loading,
  TooltipHover,
  ComboBoxMultiSelect,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Formik } from "formik";
import { Information } from "@carbon/react/icons";
import { useMutation, useQueryClient } from "react-query";
import { resolver } from "Config/servicesConfig";
import { TokenType } from "Types";
import styles from "./form.module.scss";

const ACCESS_TYPE_OPTIONS = [
  { labelText: "All teams", value: "all" },
  { labelText: "Only select teams", value: "select" },
];

interface CreateServiceTokenFormProps {
  closeModal: () => void;
  goToStep: (args: any) => void;
  saveValues: (args: any) => void;
  setIsTokenCreated: () => any;
  type: TokenType;
  principal: string | null;
  getTokensUrl: string;
}

function CreateServiceTokenForm({
  closeModal,
  goToStep,
  saveValues,
  setIsTokenCreated,
  type,
  principal,
  getTokensUrl,
}: CreateServiceTokenFormProps | any) {
  const { teams } = useAppContext();
  const [accessType, setAccessType] = React.useState<string>("all");
  const queryClient = useQueryClient();
  const tokenRequestMutation = useMutation(resolver.postToken);

  const teamsComboxBoxList = teams?.map((team: any) => ({
    label: team.displayName,
    value: team.name,
    disabled: team.satus === "active" ? true : false,
  }));

  const permissionsList = [
    {
      id: `**/${principal}/Read`,
      labelText: "Read",
    },
    {
      id: `**/${principal}/Write`,
      labelText: "Write",
    },
    {
      id: `**/${principal}/Action`,
      labelText: "Action",
    },
    {
      id: `**/${principal}/Delete`,
      labelText: "Delete",
    },
  ];

  const createToken = async (values: any) => {
    let request = {
      name: values.name,
      type: values.type,
      expirationDate: values.date ? parseInt(moment.utc(values.date).startOf("day").format("x"), 10) : null,
      description: values.description,
      principal: values.principal,
    };

    if (type === "user") {
      request = { ...request, teams: values.teams.map((t) => t.value) };
    } else {
      request = { ...request, permissions: values.permissions };
    }

    console.log("request", request);
    try {
      const response = await tokenRequestMutation.mutateAsync({ body: request });
      queryClient.invalidateQueries(getTokensUrl);
      saveValues(response.data);
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

  const handleCheckboxListChange = (setFieldValue: any, value: any, checked: boolean, label: string) => {
    value = checked ? [...value, label] : value.filter((item: string) => item !== label);
    setFieldValue("permissions", value);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        type: type,
        expirationDate: "",
        description: "",
        principal: principal,
        permissions: [`**/${principal}/Read`],
        teams: [],
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
              <p className={styles.modalHelper}>
                This token will allow{" "}
                {type === "global"
                  ? `system wide access access to the APIs. `
                  : `access to the APIs as if they were ${type === "user" ? "you" : "this " + type}. `}{" "}
                Be careful how you distribute this token.
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
              {type === "user" ? (
                <>
                  {" "}
                  <RadioGroup
                    id="access-type"
                    name="accesstype"
                    defaultSelected={accessType}
                    tooltipContent="Selecting 'All Teams' will allow this token to access all current and future teams this user has access. Selecting 'Select Teams' will allow you to specify at least one team this token can access. Access is based on the role in the current or future team."
                    labelText="Team Permissions"
                    onChange={(value) => setAccessType(value)}
                    options={ACCESS_TYPE_OPTIONS}
                    orientation="vertical"
                  />
                  <ComboBoxMultiSelect
                    onChange={({ selectedItems }) => setFieldValue("teams", selectedItems)}
                    id="access-teams"
                    items={teamsComboxBoxList}
                    placeholder="Choose teams"
                    titleText="Select Teams"
                    selectedItems={values.teams}
                    disabled={accessType === "all"}
                  />
                </>
              ) : (
                <CheckboxList
                  id="permissions"
                  helperText="Select at least one permission."
                  selectedItems={values.permissions}
                  labelText="Permissions"
                  options={permissionsList}
                  onChange={(checked: boolean, label: string) =>
                    handleCheckboxListChange(setFieldValue, values.permissions, checked, label)
                  }
                />
              )}
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
                  helperText="If no expiry is set, this token will never expire!"
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
