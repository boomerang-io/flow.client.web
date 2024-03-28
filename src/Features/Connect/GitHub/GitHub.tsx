import React from "react";
import { Helmet } from "react-helmet";
import { notify, ToastNotification } from "@boomerang-io/carbon-addons-boomerang-react";
import { Button, Dropdown, TextInput, DropdownSkeleton } from "@carbon/react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Link } from "@carbon/pictograms-react";
import { resolver, serviceUrl } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { useAppContext } from "Hooks";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./github.module.scss";

interface GitHubProps {
  installId: string;
}

export default function Github({ installId }: GitHubProps) {
  const { teams, name, user } = useAppContext();
  const history = useHistory();
  // const queryClient = useQueryClient();

  const getGitHubInstallationUrl = serviceUrl.getGitHubAppInstallation({
    id: installId,
  });

  const getGitHubInstallationQuery = useQuery({
    queryKey: getGitHubInstallationUrl,
    queryFn: resolver.query(getGitHubInstallationUrl),
    enabled: Boolean(user?.id),
  });

  const postGitHubAppLinkMutation = useMutation(resolver.postGitHubAppLink);

  /**
   * Options
   * 1. Ask which team to map the install to. If this works, then we can just use the installation_id without having to work abou tthe user auth loop
   * 2. Use the Callback to retrieve the users organisations that have the app installed and show this to the user on the page and ask which team to map this to.
   */

  const handleLink = async (values: any) => {
    const requestBody = {
      team: values.team,
      ref: installId,
    };
    try {
      await postGitHubAppLinkMutation.mutateAsync({ body: requestBody });
      notify(
        <ToastNotification
          kind="success"
          title="Link Successfull"
          subtitle={`${values.team} successfully linked with ${values.org}`}
        />,
      );
      history.push({
        pathname: appLink.integrations({ team: values.team }),
      });
    } catch (error) {
      notify(
        <ToastNotification kind="error" title="Something's Wrong" subtitle="Request to link GitHub App failed." />,
      );
    }
  };

  const handleCancel = () => {
    history.push({
      pathname: appLink.home(),
    });
  };

  const teamOptions = teams?.map((t) => ({ id: t.name, text: t.displayName }));

  const installedOrg = getGitHubInstallationQuery.data?.orgSlug ?? "---";
  const initialValues = {
    team: "",
    org: installedOrg,
  };

  return (
    <section aria-label="User Settings" className={styles.settingsContainer}>
      <Helmet>
        <title>Integration Connect</title>
      </Helmet>
      <section className={styles.container}>
        <h1>GitHub App Integration</h1>
        <p>Thank you for installing the GitHub App!</p>
        <br />
        <p>Last step - connect the GitHub App installation to a {name} team.</p>
        <br />
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values) => handleLink(values)}
          validationSchema={Yup.object().shape({
            team: Yup.string().required("Team is required"),
          })}
        >
          {(props) => {
            const { isValid, values, handleSubmit, errors, touched, setFieldValue } = props;
            return (
              <>
                <div className={styles.linkRow}>
                  {getGitHubInstallationQuery.isLoading ? (
                    <>
                      <DropdownSkeleton className={styles.skeletonField} />
                    </>
                  ) : (
                    <>
                      <TextInput id="org" readOnly={true} value={values.org} className={styles.field} />
                      <Link style={{ height: "2rem", width: "2rem", marginLeft: "1rem", marginRight: "1rem" }} />
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
                        className={styles.field}
                        invalid={Boolean(errors.team && touched.team)}
                        onChange={({ selectedItem }: any) => {
                          console.log(selectedItem);
                          setFieldValue("team", selectedItem.id);
                        }}
                      />
                    </>
                  )}
                </div>
                <br />
                <p>
                  Once connected, your Team will be able to receive events from GitHub and use these events to trigger
                  Workflows. Make sure to let them know!
                </p>
                <br />
                <div className={styles.buttonContainer}>
                  <Button
                    disabled={!isValid || getGitHubInstallationQuery.isLoading}
                    iconDescription="Cancel"
                    onClick={handleCancel}
                    size="sm"
                    kind="ghost"
                  >
                    Return home
                  </Button>
                  <Button
                    className={styles.button}
                    disabled={!isValid || getGitHubInstallationQuery.isLoading}
                    iconDescription="Link"
                    onClick={handleSubmit}
                    size="sm"
                    kind="tertiary"
                    renderIcon={Link}
                  >
                    Connect
                  </Button>
                </div>
              </>
            );
          }}
        </Formik>
      </section>
    </section>
  );
}
