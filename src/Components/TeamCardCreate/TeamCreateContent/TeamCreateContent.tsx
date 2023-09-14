import React from "react";
import { useQueryClient, useMutation } from "react-query";
import { Formik } from "formik";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { notify, ToastNotification, ModalForm, TextInput, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import * as Yup from "yup";
import styles from "./TeamCreateContent.module.scss";

export default function TeamCreateContent({ closeModal }: { closeModal: () => void }) {
  const queryClient = useQueryClient();
  const validateTeamNameMutator = useMutation(resolver.postTeamValidateName);
  const createTeamMutator = useMutation(resolver.postCreateTeam);

  const updateTeamName = async (values: { name: string | undefined }) => {
    try {
      await createTeamMutator.mutateAsync({ body: { name: values.name } });
      queryClient.invalidateQueries(serviceUrl.getUserProfile());
      notify(
        <ToastNotification kind="success" title="Update Team Settings" subtitle="Team settings successfully updated" />
      );
      closeModal();
    } catch (error) {
      notify(<ToastNotification kind="error" subtitle="Failed to update team settings" title="Something's Wrong" />);
    }
  };

  let buttonText = "Save";
  if (createTeamMutator.isLoading) {
    buttonText = "Saving...";
  } else if (createTeamMutator.error) {
    buttonText = "Try again";
  } else if (validateTeamNameMutator.isLoading) {
    buttonText = "Validating...";
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
          .test("isUnique", "Please try again, enter a team name that is not already in use", async (value) => {
            let isValid = true;
            if (value) {
              try {
                await validateTeamNameMutator.mutateAsync({ body: { name: value } });
              } catch (e) {
                console.error(e);
                isValid = false;
              }
            }
            // Need to return promise for yup to do async validation
            return Promise.resolve(isValid);
          })
          .notOneOf(["system"], "Please try again, enter a team name that is not reserved"),
      })}
    >
      {(formikProps) => {
        const { values, setFieldValue, handleSubmit, errors, touched, dirty } = formikProps;
        return (
          <ModalForm>
            <ModalBody>
              <div className={styles.modalInputContainer}>
                {createTeamMutator.isLoading && <Loading />}
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
                {createTeamMutator.error && (
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
                disabled={!dirty || errors.name || createTeamMutator.isLoading}
                onClick={handleSubmit}
                data-testid="save-team-name"
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </ModalForm>
        );
      }}
    </Formik>
  );
}
