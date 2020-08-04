import React from "react";
import { queryCache, useMutation } from "react-query";
import { Formik } from "formik";
import { Button } from "carbon-components-react";
import {
  notify,
  ToastNotification,
  InlineNotification,
  ModalFlowForm,
  ModalBody,
  ModalFooter,
  TextInput,
  Loading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import * as Yup from "yup";
import styles from "./AddTeamContent.module.scss";
import { FlowTeam } from "Types";

export default function AddTeamContent({
  closeModal,
  cancelRequestRef,
  teamRecords,
  currentQuery,
}: {
  closeModal: () => void;
  cancelRequestRef: { current: any };
  teamRecords: FlowTeam[];
  currentQuery: string;
}) {
  const [createTeamMutator, { isLoading, error }] = useMutation(
    (args: { body: {} }) => {
      const { promise, cancel } = resolver.postCreateTeam(args);
      if (cancelRequestRef?.current) {
        cancelRequestRef.current = cancel;
      }
      return promise;
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries(serviceUrl.getManageTeams({ query: currentQuery }));
      },
    }
  );

  const teamNameList = teamRecords.map((team) => team.name);

  const updateTeamName = async (values: { name: string | undefined }) => {
    try {
      await createTeamMutator({ body: { name: values.name } });
      notify(
        <ToastNotification kind="success" title="Update Team Settings" subtitle="Team settings successfully updated" />
      );
      closeModal();
    } catch (error) {
      notify(<ToastNotification kind="error" subtitle="Failed to update team settings" title="Something's Wrong" />);
    }
  };

  let buttonText = "Save";
  if (isLoading) {
    buttonText = "Saving...";
  } else if (isLoading) {
    buttonText = "Try again";
  }

  return (
    <Formik
      initialValues={{
        name: undefined,
      }}
      onSubmit={updateTeamName}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Enter a team name")
          .matches(/^[a-zA-Z0-9 ]+$/, "Team name must only contains alphanumeric characters or spaces")
          .notOneOf(teamNameList, "Please try again, select a team name that is not already in use"),
      })}
    >
      {(formikProps) => {
        const { values, setFieldValue, handleSubmit, errors, touched, dirty } = formikProps;
        return (
          <ModalFlowForm>
            <ModalBody>
              <div className={styles.modalInputContainer}>
                {isLoading && <Loading />}
                <TextInput
                  id="team-update-name-id"
                  data-testid="text-input-team-name"
                  labelText="Name"
                  helperText="Must be unique"
                  value={values.name}
                  onChange={(value: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("name", value.target.value);
                  }}
                  invalid={errors.name && !touched.name}
                  invalidText={errors.name}
                />
                {error && (
                  <InlineNotification
                    kind="error"
                    lowContrast
                    title="Name changed failed!"
                    subtitle="Give it another go or try again later."
                  />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button kind="secondary" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button disabled={!dirty || errors.name || isLoading} onClick={handleSubmit} data-testid="save-team-name">
                {buttonText}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
}
