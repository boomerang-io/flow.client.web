import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useAppContext } from "Hooks";
import TeamPropertiesTable from "./TeamPropertiesTable";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam } from "Types";
import styles from "./teamProperties.module.scss";

function TeamProperties() {
  const [activeTeam, setActiveTeam] = useState<FlowTeam | null>(null);
  const { teams } = useAppContext();

  const teamPropertiesUrl = serviceUrl.getTeamProperties({ id: activeTeam?.id });
  /** Get team properties */
  const { data: propertiesData, isLoading, error: propertiesError } = useQuery(
    teamPropertiesUrl,
    resolver.query(teamPropertiesUrl),
    { enabled: Boolean(activeTeam?.id) }
  );
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Team Parameters</title>
      </Helmet>
      <TeamPropertiesTable
        teams={teams}
        properties={propertiesData ?? []}
        propertiesAreLoading={isLoading}
        propertiesError={propertiesError}
        //@ts-ignore
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
      />
    </div>
  );
}

export default TeamProperties;
