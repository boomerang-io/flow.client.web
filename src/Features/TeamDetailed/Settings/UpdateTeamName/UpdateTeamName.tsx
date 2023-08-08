import React from "react";
import { useQueryClient, useMutation } from "react-query";
import { Formik } from "formik";
import { Button, ModalBody, ModalFooter, InlineNotification } from "@carbon/react";
import {
  notify,
  ToastNotification,
  ModalFlowForm,
  TextInput,
  Loading,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import * as Yup from "yup";
import styles from "./UpdateTeamName.module.scss";
import { FlowTeam } from "Types";

interface UpdateTeamNameProps {
  closeModal: () => void;
  team: FlowTeam;
}

const UpdateTeamName: React.FC<UpdateTeamNameProps> = ({ closeModal, team }) => {
  const {
    mutateAsync: validateTeamNameMutator,
    error: validateTeamNameIsError,
    isLoading: validateTeamNameIsLoading,
  } = useMutation(resolver.postTeamValidateName);

  const queryClient = useQueryClient();
  const updateTeamMutator = useMutation(resolver.patchUpdateTeam);
  const updateTeamName = async (values: { name: string }) => {
    try {
      await updateTeamMutator.mutateAsync({ teamId: team.id, body: { name: values.name } });
      queryClient.invalidateQueries(serviceUrl.resourceTeam({ teamId: team.id }));
      notify(
        <ToastNotification kind="success" title="Update Team Settings" subtitle="Team settings successfully updated" />
      );
      closeModal();
    } catch (error) {
      notify(<ToastNotification kind="error" subtitle="Failed to update team settings" title="Something's Wrong" />);
    }
  };

  let buttonText = "Save";
  if (updateTeamMutator.isLoading) {
    buttonText = "Saving...";
  } else if (updateTeamMutator.isLoading) {
    buttonText = "Try again";
  }

  //TODO - update the error message to include the value of the Text Input
  //TODO - update to not error on current team name
  return (
    <Formik
      initialValues={{
        name: team.name,
      }}
      onSubmit={updateTeamName}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Enter a team name")
          .max(100, "Enter team name that is at most 100 characters in length"),
      })}
    >
      {(formikProps) => {
        const { values, setFieldValue, handleSubmit, errors, touched } = formikProps;
        return (
          <ModalFlowForm>
            <ModalBody>
              <div className={styles.modalInputContainer}>
                {updateTeamMutator.isLoading && <Loading />}
                <TextInput
                  id="team-update-name-id"
                  data-testid="text-input-team-name"
                  labelText="Name"
                  helperText="Enter a unique Team name."
                  value={values.name}
                  onChange={(value: React.ChangeEvent<HTMLInputElement>) => {
                    validateTeamNameMutator({ body: { name: value.target.value } });
                    setFieldValue("name", value.target.value);
                  }}
                  invalid={Boolean(errors.name && !touched.name) || validateTeamNameIsError ? true : false}
                  invalidText={validateTeamNameIsError ? `The specified name is already taken.` : errors.name}
                />
                {updateTeamMutator.error && (
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
              <Button
                disabled={
                  errors.name || updateTeamMutator.isLoading || validateTeamNameIsError || validateTeamNameIsLoading
                }
                onClick={handleSubmit}
                data-testid="save-team-name"
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </ModalFlowForm>
        );
      }}
    </Formik>
  );
};

export default UpdateTeamName;
