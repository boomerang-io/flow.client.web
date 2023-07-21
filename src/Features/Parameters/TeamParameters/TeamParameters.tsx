import React from "react";
import { Helmet } from "react-helmet";
import { useHistory, Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useAppContext } from "Hooks";
import ParametersTable from "../ParametersTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { Breadcrumb, BreadcrumbItem } from "@carbon/react";
import {
  notify,
  ToastNotification,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { Property } from "Types";
import { formatErrorMessage } from "@boomerang-io/utils";
import styles from "./teamParameters.module.scss";

function TeamParameters() {
  const history = useHistory();
  const { activeTeam } = useAppContext();
  const queryClient = useQueryClient();

  /** Get team properties */
  const teamParametersUrl = serviceUrl.getTeamParameters({ id: activeTeam?.id });
  const teamParametersQuery = useQuery(teamParametersUrl, resolver.query(teamParametersUrl), {
    enabled: Boolean(activeTeam?.id),
  });

  /** Add / Update / Delete Team parameter */
  const addParameterMutation = useMutation(resolver.postTeamParameter);
  const updateParameterMutation = useMutation(resolver.patchTeamParameter);
  const deleteParameterMutation = useMutation(resolver.deleteTeamParameter);

  const handleSubmit = async (isEdit: boolean, parameter: any) => {
    if (isEdit) {
      try {
        const response = await updateParameterMutation.mutateAsync({
          id: activeTeam?.id,
          key: parameter.key,
          body: parameter,
        });
        queryClient.invalidateQueries([teamParametersUrl]);
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Updated"}
            subtitle={`Request to update ${response.data.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
      } catch (err) {}
    } else {
      try {
        const response = await addParameterMutation.mutateAsync({ id: activeTeam?.id, body: parameter });
        queryClient.invalidateQueries([teamParametersUrl]);
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Created"}
            subtitle={`Request to create ${response.data.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
      } catch (err) {
        //no-op
      }
    }
  };

  const handleDelete = async (parameter: Property) => {
    try {
      await deleteParameterMutation.mutateAsync({ id: activeTeam?.id, key: parameter.key });
      queryClient.invalidateQueries([teamParametersUrl]);
      notify(
        <ToastNotification
          kind="success"
          title={"Team Configuration Deleted"}
          subtitle={`Request to delete ${parameter.label} succeeded`}
          data-testid="delete-team-prop-notification"
        />
      );
    } catch (err) {
      const errorMessages = formatErrorMessage({ error: err, defaultMessage: "Delete Configuration Failed" });
      notify(
        <ToastNotification
          kind="error"
          title={errorMessages.title}
          subtitle={errorMessages.message}
          data-testid="delete-team-prop-notification"
        />
      );
    }
  };

  /** Check if there is an active team or redirect to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  const NavigationComponent = () => {
    return (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.home()}>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{activeTeam?.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Parameters</title>
      </Helmet>
      <Header
        className={styles.header}
        includeBorder={false}
        nav={<NavigationComponent />}
        header={
          <>
            <HeaderTitle className={styles.headerTitle}>Team Parameters</HeaderTitle>
            <HeaderSubtitle>
              Set team-level parameters that are accessible to all workflows owned by the team.
            </HeaderSubtitle>
          </>
        }
      />
      <ParametersTable
        parameters={teamParametersQuery.data ?? []}
        isLoading={teamParametersQuery.isLoading}
        isSubmitting={updateParameterMutation.isLoading}
        errorLoading={teamParametersQuery.isError}
        errorSubmitting={updateParameterMutation.isError}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default TeamParameters;
