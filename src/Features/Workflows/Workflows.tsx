import React, { useState, useEffect, useMemo } from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { Button, ComposedModal, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { WarningAlt16 } from "@carbon/icons-react";
import cx from "classnames";
import sortBy from "lodash/sortBy";
import WelcomeBanner from "Components/WelcomeBanner";
import EmptyState from "Components/EmptyState";
import WorkflowQuotaModalContent from "./WorkflowQuotaModalContent";
import NoTeamsRedirectPrompt from "./NoAccessRedirectPrompt";
import CreateWorkflow from "../../Components/CreateWorkflow";
import WorkflowsHeader from "../../Components/WorkflowsHeader";
import WorkflowCard from "../../Components/WorkflowCard";
import queryString from "query-string";
import { FlowTeam, ModalTriggerProps, ComposedModalChildProps, WorkflowSummary } from "Types";
import { FeatureFlag } from "Config/appConfig";
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

  //@ts-ignore
  teamsQuery = [].concat(teamsQuery);

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

  const handleUpdateFilter = (query: { [key: string]: any }) => {
    const queryStr = `?${queryString.stringify(
      { ...queryString.parse(location.search, { arrayFormat: "comma" }), ...query },
      { arrayFormat: "comma", skipEmptyString: true }
    )}`;

    history.push({ search: queryStr });
  };

  //@ts-ignore
  const sortedTeams = useMemo(() => sortBy(teams, ["name"]), [teams]);

  let selectedTeams = [];
  if (Array.isArray(teamsQuery) && teamsQuery.length > 0) {
    selectedTeams = sortedTeams.filter((team) => teamsQuery?.includes(team.id)) ?? [];
  } else {
    selectedTeams = sortedTeams;
  }

  const workflowsCount = useMemo(() => teams?.reduce((acc, team) => team.workflows.length + acc, 0) ?? 0, [teams]);

  let safeQuery = "";
  if (Array.isArray(searchQuery)) {
    safeQuery = searchQuery.join().toLowerCase();
  } else if (searchQuery) {
    safeQuery = searchQuery.toLowerCase();
  }

  let filteredTeams = [];
  let filteredWorkflowsCount = 0;
  for (let team of selectedTeams) {
    const filteredWorkflows =
      team.workflows.filter((workflow) => workflow.name.toLowerCase().includes(safeQuery)) ?? [];
    const filteredTeam: FlowTeam & { filteredWorkflows: WorkflowSummary[] } = {
      ...team,
      filteredWorkflows,
    };

    filteredWorkflowsCount += filteredTeam.filteredWorkflows.length;
    filteredTeams.push(filteredTeam);
  }

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
          isSystem={false}
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          selectedTeams={selectedTeams}
          teamsQuery={teamsQuery}
          teams={teams}
          workflowsCount={workflowsCount}
        />
        <div aria-label="Team Workflows" className={styles.content} role="region">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => {
              return <TeamWorkflows key={team.id} searchQuery={safeQuery} team={team} teams={teams} />;
            })
          ) : (
            <NoTeamsRedirectPrompt />
          )}
          {searchQuery && filteredWorkflowsCount === 0 && <EmptyState />}
        </div>
      </div>
    </>
  );
}

interface TeamWorkflowsProps {
  searchQuery: string;
  team: FlowTeam & { filteredWorkflows: WorkflowSummary[] };
  teams: FlowTeam[];
}

const TeamWorkflows: React.FC<TeamWorkflowsProps> = ({ searchQuery, team, teams }) => {
  const hasTeamWorkflows = team.workflows?.length > 0;
  const hasFilteredWorkflows = team.filteredWorkflows?.length > 0;
  const hasReachedWorkflowLimit = team.workflowQuotas.maxWorkflowCount <= team.workflowQuotas.currentWorkflowCount;
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  if (searchQuery && !hasFilteredWorkflows) {
    return null;
  }

  return (
    <section className={styles.sectionContainer}>
      <hgroup className={styles.header}>
        <h1 className={styles.team}>{`${team.name} (${team.workflows.length})`}</h1>
        {workflowQuotasEnabled && (
          <div className={styles.teamQuotaContainer}>
            <div className={styles.quotaDescriptionContainer}>
              <p
                className={styles.teamQuotaText}
              >{`Workflow quota - ${team.workflowQuotas.currentWorkflowCount} of ${team.workflowQuotas.maxWorkflowCount} used`}</p>
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
        )}

        {!hasTeamWorkflows && (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        )}
      </hgroup>
      <div className={styles.workflows}>
        {team.filteredWorkflows.map((workflow) => (
          <WorkflowCard
            isSystem={false}
            key={workflow.id}
            teamId={team.id}
            workflow={workflow}
            quotas={team.workflowQuotas}
          />
        ))}
        {
          <CreateWorkflow
            isSystem={false}
            team={team}
            teams={teams}
            hasReachedWorkflowLimit={hasReachedWorkflowLimit}
          />
        }
      </div>
    </section>
  );
};
