import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useAppContext } from "Hooks";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { appLink } from "Config/appConfig";
import styles from "./teamProperties.module.scss";

function TeamProperties() {
  const history = useHistory();
  const { activeTeam } = useAppContext();

  /** Get team properties */
  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });
  const {
    data: propertiesData,
    isLoading,
    error: propertiesError,
  } = useQuery(teamPropertiesUrl, resolver.query(teamPropertiesUrl), { enabled: Boolean(activeTeam?.id) });

  /** Check if there is an active team or redirec to home */
  if (!activeTeam) {
    return history.push(appLink.home());
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Parameters</title>
      </Helmet>
      <TeamPropertiesTable
        properties={propertiesData ?? []}
        propertiesAreLoading={isLoading}
        propertiesError={propertiesError}
        //@ts-ignore
        activeTeam={activeTeam}
      />
    </div>
  );
}

export default TeamProperties;
