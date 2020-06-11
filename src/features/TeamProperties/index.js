import React, { useState } from "react";
import { useAppContext, useQuery } from "Hooks";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import styles from "./teamProperties.module.scss";

function TeamProperties() {
  const [activeTeam, setActiveTeam] = useState({});
  const {
    state: { teams },
  } = useAppContext();

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });
  /** Get team properties */
  const { data: propertiesData, status: propertiesStatus, error: propertiesError } = useQuery(
    activeTeam?.id && teamPropertiesUrl
  );

  const propertiesAreLoading = propertiesStatus === QueryStatus.Loading;

  return (
    <div className={styles.container}>
      <TeamPropertiesTable
        teams={teams}
        properties={propertiesData ?? []}
        propertiesAreLoading={propertiesAreLoading}
        propertiesError={propertiesError}
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
      />
    </div>
  );
}

export default TeamProperties;
