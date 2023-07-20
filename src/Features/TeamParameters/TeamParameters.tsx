import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useAppContext } from "Hooks";
import ParametersTable from "./ParametersTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import styles from "./teamParameters.module.scss";

function TeamParameters() {
  const history = useHistory();
  const { activeTeam } = useAppContext();

  /** Get team properties */
  const teamPropertiesUrl = serviceUrl.getTeamParameters({ id: activeTeam?.id });
  const {
    data: propertiesData,
    isLoading,
    error: propertiesError,
  } = useQuery(teamPropertiesUrl, resolver.query(teamPropertiesUrl), { enabled: Boolean(activeTeam?.id) });

  /** Check if there is an active team or redirect to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Parameters</title>
      </Helmet>
      <ParametersTable
        properties={propertiesData ?? []}
        propertiesAreLoading={isLoading}
        propertiesError={propertiesError}
        //@ts-ignore
        activeTeam={activeTeam}
      />
    </div>
  );
}

export default TeamParameters;
