import React from "react";
import matchSorter from "match-sorter";
import {
  FeatureSideNav as SideNav,
  FeatureSideNavLink as SideNavLink, 
  FeatureSideNavLinks as SideNavLinks,
  Search
} from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import { FlowTeam } from "Types";
import styles from "./Sidenav.module.scss";

const DESCRIPTION = "Manage quotas for individiual teams";

interface SideInfoProps {
  teams: FlowTeam[];
}

const SideInfo: React.FC<SideInfoProps> = ({ teams }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [teamsToDisplay, setTeamsToDisplay] = React.useState<Array<FlowTeam>>(teams);

  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTeamsToDisplay(matchSorter(teams, searchQuery, { keys: ["name"] }));
  };

  return (
    <SideNav className={styles.container} border="right">
      <h1 className={styles.title}>Team quotas</h1>
      <p className={styles.description}>{DESCRIPTION}</p>
      <p className={styles.teamLabel}>Teams</p>
      <div className={styles.teamContainer}>
        <section className={styles.searchSection}>
          <Search
            id="team-quotas-search"
            size="sm"
            labelText="Search"
            onChange={handleOnSearchInputChange}
            placeHolderText="Search"
            value={searchQuery}
          />
        </section>
        <div className={styles.tasksInfo}>
          <p className={styles.info}>{`Showing ${teamsToDisplay.length} teams`}</p>
        </div>
      </div>
      <SideNavLinks>
        {teamsToDisplay.map((team) => {
          return (
            <SideNavLink to={appLink.quotasEdit({ teamId: team.id })}>{team.name}</SideNavLink>
          );
        })}
      </SideNavLinks>
    </SideNav>
  );
};

export default SideInfo;
