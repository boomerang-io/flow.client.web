import React, { useState, useEffect } from "react";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { Button, ComposedModal, Error404, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { WarningAlt16 } from "@carbon/icons-react";
import WorkflowQuotaModalContent from "./WorkflowQuotaModalContent";
import WelcomeBanner from "Components/WelcomeBanner";
import CreateWorkflow from "./CreateWorkflow";
import WorkflowsHeader from "./WorkflowsHeader";
import WorkflowCard from "./WorkflowCard";
import queryString from "query-string";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import { FlowTeam, ModalTriggerProps, ComposedModalChildProps } from "Types";
import styles from "./workflowHome.module.scss";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";
const initShowWelcomeBanner = window.localStorage.getItem(BANNER_STORAGE_ID) !== "true";

export default function WorkflowsHome() {
  const { isTutorialActive, setIsTutorialActive, teams } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(initShowWelcomeBanner);
  const isWelcomeBannerOpenRef = React.useRef<boolean | null>();
  let { query: searchQuery = "", teams: teamsQuery = [] } = queryString.parse(location.search, {
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
      window.localStorage.setItem(BANNER_STORAGE_ID, "true");
    }
  }, [isWelcomeBannerOpen, isWelcomeBannerShown]);

  const handleSearchFilter = (teamsList = teams, workflowsQuery: string | string[] | null = searchQuery) => {
    updateHistorySearch(
      workflowsQuery,
      teamsList.map((team: FlowTeam) => team.id)
    );
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

  const updateHistorySearch = (query: string | string[] | null, teamIds: string[]) => {
    const queryStr = `?${queryString.stringify(
      { query, teams: teamIds },
      { arrayFormat: "comma", skipEmptyString: true }
    )}`;

    history.push({ search: queryStr });
  };

  const filterTeams = () => {
    if (Array.isArray(teamsQuery) && teamsQuery.length > 0) {
      return teams.filter((team) => teamsQuery?.includes(team.id)) ?? [];
    } else if (typeof teamsQuery === "string") {
      return teams.filter((team) => team.id === teamsQuery) ?? [];
    } else {
      return teams;
    }
  };

  const filteredTeams = filterTeams();
  const sortedTeams = sortBy(filteredTeams, ["name"]);
  const workflowsCount = teams?.reduce((acc, team) => team.workflows.length + acc, 0) ?? 0;

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
          filteredTeams={filteredTeams}
          handleSearchFilter={handleSearchFilter}
          searchQuery={searchQuery}
          teamsQuery={teamsQuery}
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

interface TeamWorkflowsProps {
  searchQuery: string | string[] | null;
  team: FlowTeam;
  teams: FlowTeam[];
}

const TeamWorkflows: React.FC<TeamWorkflowsProps> = ({ searchQuery, team, teams }) => {
  let workflows = [];
  if (searchQuery) {
    workflows = team.workflows.filter((workflow) => {
      let safeQuery = "";
      if (Array.isArray(searchQuery)) {
        safeQuery = searchQuery.join();
      } else if (searchQuery) {
        safeQuery = searchQuery;
      }
      return workflow.name.toLowerCase().includes(safeQuery?.toLowerCase());
    });
  } else {
    workflows = team?.workflows ?? [];
  }

  const hasTeamWorkflows = team.workflows?.length > 0;
  const hasReachedWorkflowLimit = team.workflowQuotas.maxWorkflowCount <= team.workflowQuotas.currentWorkflowCount;

  return (
    <section className={styles.sectionContainer}>
      <hgroup className={styles.header}>
        <h1 className={styles.team}>{`${team.name} (${workflows.length})`}</h1>
        <div className={styles.teamQuotaContainer}>
          <div className={styles.quotaDescriptionContainer}>
            <h3
              className={styles.teamQuotaText}
            >{`Workflow quota - ${team.workflowQuotas.currentWorkflowCount} of ${team.workflowQuotas.maxWorkflowCount} used`}</h3>
            {hasReachedWorkflowLimit && (
              <TooltipHover
                direction="top"
                tooltipText={
                  "This team has reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact your Team administrator/owner to increase the quota."
                }
              >
                <WarningAlt16 className={styles.warningIcon} />
              </TooltipHover>
            )}
          </div>
          <ComposedModal
            composedModalProps={{
              containerClassName: styles.quotaModalContainer,
              shouldCloseOnOverlayClick: true,
            }}
            modalHeaderProps={{
              title: `Team quotas - ${team.name}`,
              subtitle:
                "Quotas are set by the administrator. If you have a concern about your allotted amounts, contact an admin.",
            }}
            modalTrigger={({ openModal }: ModalTriggerProps) => (
              <Button iconDescription="View quota details" kind="ghost" size="field" onClick={openModal}>
                View more quotas
              </Button>
            )}
          >
            {({ closeModal }: ComposedModalChildProps) => (
              <WorkflowQuotaModalContent closeModal={closeModal} quotas={team?.workflowQuotas} />
            )}
          </ComposedModal>
        </div>

        {!hasTeamWorkflows && (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        )}
      </hgroup>
      <div className={styles.workflows}>
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} teamId={team.id} workflow={workflow} quotas={team.workflowQuotas} />
        ))}
        <CreateWorkflow team={team} teams={teams} hasReachedWorkflowLimit={hasReachedWorkflowLimit} />
      </div>
    </section>
  );
};
