import React from "react";
import { useQueryClient, useMutation } from "react-query";
import { useAppContext } from "Hooks";
import { Formik } from "formik";
import { Button, InlineNotification, ModalBody, ModalFooter } from "@carbon/react";
import { notify, ToastNotification, ModalForm, TextInput, Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { MemberRole } from "Types";
import kebabcase from "lodash/kebabCase";
import * as Yup from "yup";
import styles from "./TeamCreateContent.module.scss";

export default function TeamCreateContent({ closeModal }: { closeModal: () => void }) {
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  const validateTeamNameMutator = useMutation(resolver.postTeamValidateName);
  const createTeamMutator = useMutation(resolver.postTeam);

  const createTeam = async (values: { name: string | undefined }) => {
    try {
      await createTeamMutator.mutateAsync({
        body: {
          name: kebabcase(values.name?.replace(`'`, "-")),
          displayName: values.name,
          members: [
            {
              email: user.email,
              role: MemberRole.Owner,
            },
          ],
        },
      });
      queryClient.invalidateQueries(serviceUrl.getUserProfile());
      notify(<ToastNotification kind="success" title="Create Team" subtitle="Team created successfully" />);
      closeModal();
    } catch (error) {
      notify(<ToastNotification kind="error" subtitle="Failed to create team" title="Something's Wrong" />);
    }
  };

  let buttonText = "Create";
  if (createTeamMutator.isLoading) {
    buttonText = "Creating...";
  } else if (createTeamMutator.error) {
    buttonText = "Try again";
  } else if (validateTeamNameMutator.isLoading) {
    buttonText = "Validating...";
  }

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      onSubmit={createTeam}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required("Enter a team name")
          .max(100, "Enter team name that is at most 100 characters in length")
          .test("isUnique", "Please try again, enter a team name that is not already taken", async (value) => {
            let isValid = true;
            if (value) {
              try {
                await validateTeamNameMutator.mutateAsync({ body: { name: kebabcase(value.replace(`'`, "-")) } });
              } catch (e) {
                console.error(e);
                isValid = false;
              }
            }
            // Need to return promise for yup to do async validation
            return Promise.resolve(isValid);
          }),
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
                  labelText="Display Name"
                  helperText="The display name of your team must make a unique name identifier."
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
                    title="Create team failed!"
                    subtitle="Give it another go or try again later."
                  />
                )}
                <div className={styles.text}>
                  {values.name ? (
                    <p>
                      Your unique team name identifier will be "
                      <b>{kebabcase(values ? values.name.replace(`'`, "-") : "")}</b>", which has been adjusted to
                      remove spaces and special characters.
                    </p>
                  ) : (
                    <p>Your unique team name identifier will be adjusted to remove spaces and special characters.</p>
                  )}
                </div>
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
