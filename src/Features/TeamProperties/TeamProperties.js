import React, { useState } from "react";
import { useQuery } from "react-query";
import { useAppContext } from "Hooks";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./teamProperties.module.scss";

function TeamProperties() {
  const [activeTeam, setActiveTeam] = useState({});
  const { teams } = useAppContext();

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });
  /** Get team properties */
  const { data: propertiesData, isLoading, error: propertiesError } = useQuery(
    teamPropertiesUrl,
    resolver.query(teamPropertiesUrl),
    { enabled: activeTeam?.id }
  );
  return (
    <div className={styles.container}>
      <TeamPropertiesTable
        teams={teams}
        properties={propertiesData ?? []}
        propertiesAreLoading={isLoading}
        propertiesError={propertiesError}
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
      />
    </div>
  );
}

export default TeamProperties;
