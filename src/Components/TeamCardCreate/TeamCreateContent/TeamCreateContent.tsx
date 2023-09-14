import React from "react";
import { useQueryClient, useMutation } from "react-query";
import { Formik } from "formik";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import {
  notify,
  ToastNotification,
  ModalFlowForm,
  TextInput,
  Loading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import * as Yup from "yup";
import styles from "./TeamCreateContent.module.scss";
import { FlowTeam } from "Types";

export default function TeamCreateContent({
  closeModal,
  teamRecords,
}: {
  closeModal: () => void;
  teamRecords: FlowTeam[] | null;
}) {
  const queryClient = useQueryClient();
  const {
    mutateAsync: createTeamMutator,
    isLoading,
    error,
  } = useMutation(resolver.postCreateTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries(serviceUrl.getUserProfile());
    },
  });

  const teamNameList = teamRecords ? teamRecords.map((team) => team.name) : [];

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
          .max(100, "Enter team name that is at most 100 characters in length")
          .notOneOf(teamNameList, "Please try again, enter a team name that is not already in use"),
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
                  invalid={Boolean(errors.name && !touched.name)}
                  invalidText={errors.name}
                />
                {error && (
                  <InlineNotification
                    lowContrast
                    kind="error"
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
              {/* @ts-ignore */}
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
