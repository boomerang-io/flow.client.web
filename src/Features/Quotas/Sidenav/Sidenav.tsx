import React from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import cx from "classnames";
import matchSorter from "match-sorter";
import { Search } from "@boomerang-io/carbon-addons-boomerang-react";
import { appLink } from "Config/appConfig";
import { AppPath } from "Config/appConfig";
import { FlowTeam } from "Types";
import styles from "./Sidenav.module.scss";

const DESCRIPTION = "Manage quotas for indivdiual teams";

interface SideInfoProps {
  teams: FlowTeam[];
}

const SideInfo: React.FC<SideInfoProps> = ({ teams }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [teamsToDisplay, setTeamsToDisplay] = React.useState<Array<FlowTeam>>(teams);
  const location = useLocation();
  const globalMatch = matchPath(location.pathname, { path: AppPath.QuotasEdit });

  const handleOnSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchQuery(searchQuery);
    setTeamsToDisplay(matchSorter(teams, searchQuery, { keys: ["name"] }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Team quotas</h1>
      <p className={styles.description}>{DESCRIPTION}</p>
      <p className={styles.teamLabel}>Teams</p>
      <div className={styles.teamContainer}>
        <section className={styles.searchSection}>
          <Search
            data-testid="task-templates-search"
            id="task-templates-search"
            size="sm"
            labelText="Search for a task"
            onChange={handleOnSearchInputChange}
            placeHolderText="Search for a task"
            value={searchQuery}
          />
        </section>
        <div className={styles.tasksInfo}>
          <p className={styles.info}>{`Showing ${teamsToDisplay.length} teams`}</p>
        </div>
      </div>
      <section>
        {teamsToDisplay.map((team) => {
          //@ts-ignore
          return <Task team={team} isActive={globalMatch?.params?.teamId === team.id} />;
        })}
      </section>
    </div>
  );
};

interface TaskProps {
  isActive: boolean;
  team: FlowTeam;
}
const Task: React.FC<TaskProps> = (props) => {
  const { team } = props;

  return (
    <Link
      className={cx(styles.team, { [styles.active]: props.isActive })}
      to={appLink.quotasEdit({ teamId: team.id })}
      id={team.id}
    >
      <p className={cx(styles.teamName, { [styles.active]: props.isActive })}>{team.name}</p>
    </Link>
  );
};

export default SideInfo;
