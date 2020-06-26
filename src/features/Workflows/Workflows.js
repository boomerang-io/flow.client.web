import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { Error404 } from "@boomerang-io/carbon-addons-boomerang-react";
import WelcomeBanner from "Components/WelcomeBanner";
import CreateWorkflow from "./CreateWorkflow";
import WorkflowsHeader from "./WorkflowsHeader";
import WorkflowCard from "./WorkflowCard";
import queryString from "query-string";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import styles from "./workflowHome.module.scss";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";
const initShowWelcomeBanner = window.localStorage.getItem(BANNER_STORAGE_ID) !== "true";

export default function WorkflowsHome() {
  const { isTutorialActive, setIsTutorialActive, teams } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(initShowWelcomeBanner);
  const isWelcomeBannerOpenRef = React.useRef();
  const { query: searchQuery = "", teams: teamsFilter = [] } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });

  useEffect(() => {
    if (isTutorialActive) {
      isWelcomeBannerOpenRef.current = isWelcomeBannerOpen;
      setIsWelcomeBannerOpen(false);
    } else {
      if (isWelcomeBannerOpenRef.current) {
        setIsWelcomeBannerOpen(true);
      }
    }
    // purposefully get the stale state value and don't run the effect when things change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTutorialActive, setIsWelcomeBannerOpen]);

  useEffect(() => {
    if (!isWelcomeBannerOpen && !isWelcomeBannerShown) {
      window.localStorage.setItem(BANNER_STORAGE_ID, true);
    }
  }, [isWelcomeBannerOpen, isWelcomeBannerShown]);

  const handleSearchFilter = ({ workflowsQuery = searchQuery, teamsList = teams }) => {
    updateHistorySearch({
      query: workflowsQuery,
      teams: teamsList.map((team) => team.id),
    });
  };

  const handleOpenTutorial = () => {
    setIsTutorialActive(true);
  };

  const handleToggleIsWelcomeBannerOpen = () => {
    setIsWelcomeBannerOpen((prevState) => !prevState);
  };

  const handleHideWelcomeBanner = () => {
    setIsWelcomeBannerOpen(false);
    setIsWelcomeBannerShown(false);
  };

  const updateHistorySearch = ({ query, teams }) => {
    const queryStr = `?${queryString.stringify({ query, teams }, { arrayFormat: "comma", skipEmptyString: true })}`;

    history.push({ search: queryStr });
  };

  const filterTeams = () => {
    if (Array.isArray(teamsFilter) && teamsFilter.length > 0) {
      return teams.filter((team) => teamsFilter.includes(team.id));
    } else if (typeof teamsFilter === "string") {
      return teams.filter((team) => team.id === teamsFilter);
    } else {
      return teams;
    }
  };

  const filteredTeams = filterTeams();
  const sortedTeams = sortBy(filteredTeams, ["name"]);
  const workflowsCount = teams.reduce((acc, team) => team.workflows.length + acc, 0);

  return (
    <>
      {isWelcomeBannerShown && (
        <WelcomeBanner
          hide={handleHideWelcomeBanner}
          isOpen={isWelcomeBannerOpen}
          openTutorial={handleOpenTutorial}
          toggleIsOpen={handleToggleIsWelcomeBannerOpen}
        />
      )}
      <div
        className={cx(styles.container, {
          [styles.bannerClosed]: !isWelcomeBannerOpen || isTutorialActive,
          [styles.bannerHidden]: !isWelcomeBannerShown,
        })}
      >
        <WorkflowsHeader
          filteredTeams={teamsFilter.length ? filteredTeams : []}
          handleSearchFilter={handleSearchFilter}
          searchQuery={searchQuery}
          teams={teams}
          workflowsCount={workflowsCount}
        />
        <div aria-label="Team Workflows" className={styles.content} role="region">
          {sortedTeams.length > 0 ? (
            sortedTeams.map((team) => {
              return <TeamWorkflows key={team.id} searchQuery={searchQuery} team={team} teams={teams} />;
            })
          ) : (
            <Error404 header={null} message={"You need to be a member of a team to use Flow"} title="No teams found" />
          )}
        </div>
      </div>
    </>
  );
}

TeamWorkflows.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
};

function TeamWorkflows({ children, searchQuery, team, teams }) {
  let workflows = [];
  if (searchQuery) {
    workflows = team.workflows.filter((workflow) => workflow.name.toLowerCase().includes(searchQuery.toLowerCase()));
  } else {
    workflows = team?.workflows ?? [];
  }

  const hasTeamWorkflows = team.workflows?.length > 0;

  return (
    <section className={styles.sectionContainer}>
      <hgroup className={styles.header}>
        <h1 className={styles.team}>{`${team.name} (${workflows.length})`}</h1>
        {!hasTeamWorkflows && (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        )}
      </hgroup>
      <div className={styles.workflows}>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} teamId={team.id} workflow={workflow} />
        ))}
        <CreateWorkflow team={team} teams={teams} />
      </div>
    </section>
  );
}
