import React, { useState } from "react";
import { useAppContext, useQuery } from "Hooks";
import { Loading } from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import { default as USER_TYPES } from "Constants/userTypes";
import styles from "./teamProperties.module.scss";

function TeamProperties() {
  const [activeTeam, setActiveTeam] = useState({});
  const { user, teams } = useAppContext();

  const { type, email } = user;
  const needTeamData = type !== USER_TYPES.ADMIN;

  const userTeamsUrl = serviceUrl.getUserTeams({ email });
  const { data: userTeamsData, status: userTeamsStatus, userTeamsError } = useQuery(
    needTeamData && email && userTeamsUrl
  );

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });
  /** Get team properties */
  const { data: propertiesData, status: propertiesStatus, error: propertiesError } = useQuery(
    activeTeam?.id && teamPropertiesUrl
  );

  const userTeamsIsLoading = userTeamsStatus === QueryStatus.Loading;
  const propertiesAreLoading = propertiesStatus === QueryStatus.Loading;

  if (userTeamsIsLoading || propertiesAreLoading) {
    return <Loading />;
  }

  if (userTeamsError || propertiesError) {
    return (
      <div className={styles.container}>
        <ErrorDragon />
      </div>
    );
  }

  if (teams || userTeamsData) {
    return (
      <div className={styles.container}>
        <TeamPropertiesTable
          teams={userTeamsData ? userTeamsData : teams}
          properties={propertiesData ?? []}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
        />
      </div>
    );
  }

  return null;
}

export default TeamProperties;
