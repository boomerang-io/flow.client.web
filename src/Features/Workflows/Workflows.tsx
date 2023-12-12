import React, { useState, useEffect, useMemo } from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useQuery } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import {
  Button,
  ComposedModal,
  ErrorMessage,
  SkeletonPlaceholder,
  TooltipHover,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { WarningAlt16 } from "@carbon/icons-react";
import cx from "classnames";
import queryString from "query-string";
import sortBy from "lodash/sortBy";
import CreateWorkflow from "Components/CreateWorkflow";
import EmptyState from "Components/EmptyState";
import NoTeamsRedirectPrompt from "Components/NoTeamsRedirectPrompt";
import WelcomeBanner from "Components/WelcomeBanner";
import WorkflowCard from "Components/WorkflowCard";
import WorkflowsHeader from "Components/WorkflowsHeader";
import WorkflowQuotaModalContent from "./WorkflowQuotaModalContent";
import { FlowTeam, FlowUser, ModalTriggerProps, ComposedModalChildProps, WorkflowSummary } from "Types";
import { WorkflowScope, elevatedUserRoles, UserType } from "Constants";
import { AppPath, FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import styles from "./workflowHome.module.scss";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";
const initShowWelcomeBanner = window.localStorage.getItem(BANNER_STORAGE_ID) !== "true";

export default function WorkflowsHome() {
  const { user, isTutorialActive, setIsTutorialActive, teams } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(initShowWelcomeBanner);
  const isWelcomeBannerOpenRef = React.useRef<boolean | null>();
  let { query: searchQuery = "", teams: teamsQuery = [] } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });

  const userWorkflowsQuery = useQuery({
    queryKey: serviceUrl.getUserWorkflows(),
    queryFn: resolver.query(serviceUrl.getUserWorkflows()),
  });

  const isMyWorkflows = location.pathname.includes("/workflows/mine");

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

  const workflowsCount = useMemo(() => {
    return isMyWorkflows
      ? userWorkflowsQuery?.data?.workflows?.length ?? 0
      : teams?.reduce((acc, team) => team.workflows.length + acc, 0) ?? 0;
  }, [isMyWorkflows, teams, userWorkflowsQuery?.data]);

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
          scope={isMyWorkflows ? WorkflowScope.User : WorkflowScope.Team}
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          selectedTeams={selectedTeams}
          teamsQuery={teamsQuery}
          teams={teams}
          workflowsCount={workflowsCount}
        />
        <div aria-label="My Workflows" className={styles.content} role="region">
          <Switch>
            <Route path={AppPath.WorkflowsMine}>
              <UserWorkflows searchQuery={safeQuery} user={user} userWorkflowsQuery={userWorkflowsQuery} />
            </Route>
            <Route path={AppPath.WorkflowsTeams}>
              {filteredTeams.length > 0 ? (
                searchQuery && filteredWorkflowsCount === 0 ? (
                  <EmptyState />
                ) : (
                  filteredTeams.map((team) => {
                    return (
                      <TeamWorkflows key={team.id} searchQuery={safeQuery} team={team} teams={teams} user={user} />
                    );
                  })
                )
              ) : (
                <NoTeamsRedirectPrompt style={{ paddingTop: "1rem" }} />
              )}
            </Route>
            <Redirect exact from={AppPath.Workflows} to={AppPath.WorkflowsMine} />
          </Switch>
        </div>
      </div>
    </>
  );
}

interface UserWorkflowsProp {
  searchQuery: string;
  user: FlowUser;
  userWorkflowsQuery: any;
}

const UserWorkflows: React.FC<UserWorkflowsProp> = ({ searchQuery, user, userWorkflowsQuery }) => {
  const { data: userWorkflows, isLoading: userWorkflowsIsLoading, isError: userWorkflowsIsError } = userWorkflowsQuery;

  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  if (userWorkflowsIsLoading) {
    return (
      <section className={styles.sectionContainer}>
        <div className={styles.workflows}>
          <SkeletonPlaceholder className={styles.workflowPlaceholder} />
          <SkeletonPlaceholder className={styles.workflowPlaceholder} />
          <SkeletonPlaceholder className={styles.workflowPlaceholder} />
        </div>
      </section>
    );
  }

  if (userWorkflowsIsError) {
    return (
      <section className={styles.sectionContainer}>
        <ErrorMessage />
      </section>
    );
  }

  if (userWorkflows) {
    const { workflows, userQuotas } = userWorkflows;
    const userHasWorkflows = workflows?.length > 0;
    const filteredWorkflows = workflows.filter((workflow: WorkflowSummary) =>
      workflow.name.toLowerCase().includes(searchQuery)
    );
    const hasFilteredWorkflows = filteredWorkflows?.length > 0;
    const hasReachedWorkflowLimit = userQuotas.maxWorkflowCount <= userQuotas.currentWorkflowCount;

    if (searchQuery && !hasFilteredWorkflows) {
      return <EmptyState />;
    }

    return (
      <section className={styles.sectionContainer}>
        <hgroup className={styles.header}>
          {workflowQuotasEnabled && (
            <div className={styles.teamQuotaContainer}>
              <div className={styles.quotaDescriptionContainer}>
                <p
                  className={styles.teamQuotaText}
                >{`Workflow quota - ${userQuotas.currentWorkflowCount} of ${userQuotas.maxWorkflowCount} used`}</p>
                {hasReachedWorkflowLimit && (
                  <TooltipHover
                    direction="top"
                    tooltipText={
                      "You reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact an administrator to increase the quota."
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
                  title: `User quotas - ${user.name}`,
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
                  <WorkflowQuotaModalContent closeModal={closeModal} quotas={userQuotas} scope={WorkflowScope.User} />
                )}
              </ComposedModal>
            </div>
          )}

          {!userHasWorkflows && <p className={styles.noWorkflowsMessage}>You don't have any Workflows.</p>}
        </hgroup>
        <div className={styles.workflows}>
          {filteredWorkflows.map((workflow: WorkflowSummary) => (
            <WorkflowCard
              scope={WorkflowScope.User}
              key={workflow.id}
              teamId={workflow.flowTeamId}
              workflow={workflow}
              quotas={userQuotas}
              canEditWorkflow={true}
            />
          ))}
          {
            <CreateWorkflow
              hasReachedWorkflowLimit={hasReachedWorkflowLimit}
              scope={WorkflowScope.User}
              workflows={workflows}
              canEditWorkflow={true}
            />
          }
        </div>
      </section>
    );
  }

  return null;
};

interface TeamWorkflowsProps {
  searchQuery: string;
  team: FlowTeam & { filteredWorkflows: WorkflowSummary[] };
  teams: FlowTeam[];
  user: FlowUser;
}

const TeamWorkflows: React.FC<TeamWorkflowsProps> = ({ searchQuery, team, teams, user }) => {
  const hasTeamWorkflows = team.workflows?.length > 0;
  const hasFilteredWorkflows = team.filteredWorkflows?.length > 0;
  const hasReachedWorkflowLimit = team.workflowQuotas.maxWorkflowCount <= team.workflowQuotas.currentWorkflowCount;
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  const systemWorkflowsEnabled = elevatedUserRoles.includes(user.type);
  const canEditWorkflow =
    (team?.userRoles && team?.userRoles.indexOf(UserType.Operator) > -1) || systemWorkflowsEnabled;

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
                <WorkflowQuotaModalContent
                  closeModal={closeModal}
                  quotas={team?.workflowQuotas}
                  scope={WorkflowScope.Team}
                />
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
            scope={WorkflowScope.Team}
            key={workflow.id}
            teamId={team.id}
            workflow={workflow}
            quotas={team.workflowQuotas}
            canEditWorkflow={canEditWorkflow}
          />
        ))}
        {
          <CreateWorkflow
            hasReachedWorkflowLimit={hasReachedWorkflowLimit}
            scope={WorkflowScope.Team}
            team={team}
            teams={teams}
            workflows={team.workflows}
            canEditWorkflow={canEditWorkflow}
          />
        }
      </div>
    </section>
  );
};
