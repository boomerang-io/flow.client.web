import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { Dropdown, DropdownSkeleton } from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button } from "@carbon/react";
import type { FlowUser } from "Types";
import { resolver, serviceUrlIntegrations } from "Config/servicesConfig";
import queryString from "query-string";
import { useAppContext } from "Hooks";
import { Formik, FormikProps } from "formik";
import { DataDrivenInput } from "Types";
import styles from "./github.module.scss";

interface GitHubProps {
  installId: string;
}

export default function Github({ installId }: GitHubProps) {
  const { teams, name, user } = useAppContext();
  // const queryClient = useQueryClient();

  const getGitHubInstallationUrl = serviceUrlIntegrations.getGitHubAppInstallations({
    id: installId,
  });

  const getGitHubInstallationQuery = useQuery({
    queryKey: getGitHubInstallationUrl,
    queryFn: resolver.query(getGitHubInstallationUrl),
    enabled: Boolean(user?.id),
  });

  // const deleteTokenMutator = useMutation(resolver.deleteToken);

  // const deleteToken = async (tokenId: string) => {
  //   try {
  //     await deleteTokenMutator.mutateAsync({ tokenId });
  //     queryClient.invalidateQueries([getTokensUrl]);
  //     notify(<ToastNotification kind="success" title="Delete Token" subtitle={`Token successfully deleted`} />);
  //   } catch (error) {
  //     notify(<ToastNotification kind="error" title="Something's Wrong" subtitle="Request to delete token failed" />);
  //   }
  // };

  /**
   * Options
   * 1. Ask which team to map the install to. If this works, then we can just use the installation_id without having to work abou tthe user auth loop
   * 2. Use the Callback to retrieve the users organisations that have the app installed and show this to the user on the page and ask which team to map this to.
   */

  const handleOnSave = async (
    values: { [key: string]: any },
    setFieldError: (key: string, value: string) => void
  ) => {};

  const teamOptions = teams?.map((t) => ({ id: t.name, text: t.displayName }));

  const initialValues = {
    team: "",
  };

  return (
    <section aria-label="User Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>Integration Connect</title>
      </Helmet>
      <section className={styles.container}>
        <h1>GitHub App Connection</h1>
        <p>Thank you for installing the GitHub App!</p>
        <br />
        <Formik enableReinitialize initialValues={initialValues} onSubmit={() => {}}>
          {(props) => {
            const { isValid, values, handleSubmit } = props;
            return (
              <>
                {getGitHubInstallationQuery.isLoading ? (
                  <DropdownSkeleton />
                ) : (
                  <Dropdown
                    id="team"
                    name="team"
                    type="default"
                    label="Team"
                    ariaLabel="Dropdown"
                    light={false}
                    items={teamOptions}
                    itemToString={(item) => (item ? item.text : "")}
                    value={values.team}
                  />
                )}
                <Button
                  className={styles.saveButton}
                  disabled={!isValid}
                  iconDescription="Save settings"
                  onClick={handleSubmit}
                  size="md"
                >
                  Save
                </Button>
              </>
            );
          }}
        </Formik>
        <br />
        <p>
          Your Team will now be able to receive events from GitHub and use these events to trigger Workflows. Make sure
          to let them know!
        </p>
        <br />
        <Button kind="tertiary" type="button" size="sm">
          Go to Home
        </Button>
      </section>
    </section>
  );
}
