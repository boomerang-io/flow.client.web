import React from "react";
import { Helmet } from "react-helmet";
import { useHistory, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { useTeamContext } from "Hooks";
import ParametersTable from "../ParametersTable";
import { resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import { Breadcrumb, BreadcrumbItem } from "@carbon/react";
import {
  notify,
  ToastNotification,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { DataDrivenInput } from "Types";
import { formatErrorMessage } from "@boomerang-io/utils";

function TeamParameters() {
  const history = useHistory();
  const { team } = useTeamContext();

  /** Add / Update / Delete Team parameter */
  const parameterMutation = useMutation(resolver.patchTeam);
  const deleteParameterMutation = useMutation(resolver.deleteTeamParameters);

  const handleSubmit = async (isEdit: boolean, parameter: DataDrivenInput) => {
    try {
      await parameterMutation.mutateAsync({
        team: team?.name,
        body: { parameters: [parameter] },
      });
      if (isEdit) {
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Updated"}
            subtitle={`Request to update ${parameter.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
      } else {
        notify(
          <ToastNotification
            kind="success"
            title={"Parameter Created"}
            subtitle={`Request to create ${parameter.label} succeeded`}
            data-testid="create-update-team-prop-notification"
          />
        );
      }
    } catch (err) {
      //no-op
    }
  };

  const handleDelete = async (parameter: DataDrivenInput) => {
    try {
      await deleteParameterMutation.mutateAsync({ team: team?.name, body: [parameter.key] });
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
  if (!team) {
    return history.push(appLink.home());
  }

  const NavigationComponent = () => {
    return (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.home()}>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{team?.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <>
      <Helmet>
        <title>Team Parameters</title>
      </Helmet>
      <Header
        includeBorder={false}
        nav={<NavigationComponent />}
        header={
          <>
            <HeaderTitle>Team Parameters</HeaderTitle>
            <HeaderSubtitle>
              Set team-level parameters that are accessible to all workflows owned by the team.
            </HeaderSubtitle>
          </>
        }
      />
      <ParametersTable
        parameters={team.parameters ?? []}
        isLoading={false}
        isSubmitting={parameterMutation.isLoading}
        errorSubmitting={parameterMutation.isError}
        errorLoading={false}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default TeamParameters;
