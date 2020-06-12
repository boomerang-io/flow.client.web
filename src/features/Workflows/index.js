import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAppContext } from "Hooks";
import { Error404 } from "@boomerang/carbon-addons-boomerang-react";
import WelcomeBanner from "Components/WelcomeBanner";
import CreateWorkflow from "./CreateWorkflow";
import WorkflowsHeader from "./WorkflowsHeader";
import WorkflowCard from "./WorkflowCard";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import styles from "./workflowHome.module.scss";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";
const initShowWelcomeBanner = window.localStorage.getItem(BANNER_STORAGE_ID) !== "true";

export default function WorkflowsHome() {
  const {
    state: { onBoardShow, setOnBoardShow, teams },
  } = useAppContext();
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(initShowWelcomeBanner);
  const isWelcomeBannerOpenRef = React.useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [teamsFilter, setTeamsFilter] = useState([]);

  useEffect(() => {
    if (onBoardShow) {
      isWelcomeBannerOpenRef.current = isWelcomeBannerOpen;
      setIsWelcomeBannerOpen(false);
    } else {
      if (isWelcomeBannerOpenRef.current) {
        setIsWelcomeBannerOpen(true);
      }
    }
    // purposefully get the stale state value and don't run the effect when things change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBoardShow, setIsWelcomeBannerOpen]);

  useEffect(() => {
    if (!isWelcomeBannerOpen && !isWelcomeBannerShown) {
      window.localStorage.setItem(BANNER_STORAGE_ID, true);
    }
  }, [isWelcomeBannerOpen, isWelcomeBannerShown]);

  const handleSearchFilter = (searchQuery, teams) => {
    setSearchQuery(searchQuery);
    setTeamsFilter(Array.isArray(teams) && teams.length ? teams : []);
  };

  const filterTeams = () => {
    if (teamsFilter.length > 0) {
      return teams.filter((team) => teamsFilter.find((filter) => filter.text === team.name));
    } else {
      return teams;
    }
  };

  const handleOpenTutorial = () => {
    setOnBoardShow(true);
  };

  const handleToggleIsWelcomeBannerOpen = () => {
    setIsWelcomeBannerOpen((prevState) => !prevState);
  };

  const handleHideWelcomeBanner = () => {
    setIsWelcomeBannerOpen(false);
    setIsWelcomeBannerShown(false);
  };

  const filteredTeams = filterTeams();
  const sortedTeams = sortBy(filteredTeams, ["name"]);
  const workflowsLength = teams.reduce((acc, team) => team.workflows.length + acc, 0);

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
          [styles.bannerClosed]: !isWelcomeBannerOpen || onBoardShow,
          [styles.bannerHidden]: !isWelcomeBannerShown,
        })}
      >
        <WorkflowsHeader handleSearchFilter={handleSearchFilter} workflowsLength={workflowsLength} options={teams} />
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
    workflows = team.workflows;
  }

  const hasTeamWorkflows = team.workflows.length > 0;

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.header}>
        <h1 className={styles.team}>{`${team.name} (${workflows.length})`}</h1>
        {!hasTeamWorkflows && (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        )}
      </div>
      <div className={styles.workflows}>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} teamId={team.id} workflow={workflow} />
        ))}
        <CreateWorkflow team={team} teams={teams} />
      </div>
    </section>
  );
}
