import React, { useState, useEffect } from "react";
import { useFeature } from "flagged";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { Button } from "@carbon/react";
import { ComposedModal, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { WarningAlt } from "@carbon/react/icons";
import cx from "classnames";
import queryString from "query-string";
import CreateWorkflow from "Components/CreateWorkflow";
import EmptyState from "Components/EmptyState";
import WelcomeBanner from "Components/WelcomeBanner";
import WorkflowCard from "Components/WorkflowCard";
import WorkflowsHeader from "Components/WorkflowsHeader";
import WorkflowQuotaModalContent from "./WorkflowQuotaModalContent";
import {
  FlowTeam,
  ModalTriggerProps,
  ComposedModalChildProps,
  WorkflowView,
  PaginatedWorkflowResponse,
  Workflow,
} from "Types";
import { FeatureFlag } from "Config/appConfig";
import styles from "./workflows.module.scss";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { useQuery } from "react-query";

const BANNER_STORAGE_ID = "bmrg-flow-hideWelcomeBanner";
const initShowWelcomeBanner = window.localStorage.getItem(BANNER_STORAGE_ID) !== "true";

export default function WorkflowsHome() {
  const { isTutorialActive, setIsTutorialActive, activeTeam } = useAppContext();
  console.log({ activeTeam });
  const history = useHistory();
  const location = useLocation();
  const [isWelcomeBannerOpen, setIsWelcomeBannerOpen] = useState(true);
  const [isWelcomeBannerShown, setIsWelcomeBannerShown] = useState(initShowWelcomeBanner);
  const isWelcomeBannerOpenRef = React.useRef<boolean | null>();
  let { query: searchQuery = "" } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });
  const getWorkflowsUrl = serviceUrl.getWorkflows({ query: `teams=${activeTeam?.id}` });

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

  const workflowsQuery = useQuery<PaginatedWorkflowResponse, string>({
    queryKey: getWorkflowsUrl,
    queryFn: resolver.query(getWorkflowsUrl),
  });

  const workflowsCount = workflowsQuery.data ? workflowsQuery.data?.totalElements : 0;

  let safeQuery = "";
  if (Array.isArray(searchQuery)) {
    safeQuery = searchQuery.join().toLowerCase();
  } else if (searchQuery) {
    safeQuery = searchQuery.toLowerCase();
  }

  const filteredWorkflows =
    workflowsQuery.data?.content.filter((workflow) => workflow.name.toLowerCase().includes(safeQuery)) ?? [];
  let filteredWorkflowsCount = filteredWorkflows.length;

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
          pretitle="These are your Workflows"
          title={activeTeam ? activeTeam.name : "No Team selected"}
          subtitle="Your playground to create, execute, and collaborate on workflows. Work smarter with automation."
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          team={activeTeam}
          workflowsCount={workflowsCount}
          viewType={WorkflowView.Workflow}
        />
        <div aria-label="My Workflows" className={styles.content} role="region">
          {searchQuery && filteredWorkflowsCount === 0 && !activeTeam ? (
            <EmptyState />
          ) : (
            <WorkflowContent searchQuery={safeQuery} team={activeTeam} filteredWorkflows={filteredWorkflows} />
          )}
        </div>
      </div>
    </>
  );
}

interface WorkflowContentProps {
  searchQuery: string;
  team: FlowTeam;
  filteredWorkflows: Workflow[];
}

const WorkflowContent: React.FC<WorkflowContentProps> = ({ searchQuery, team, filteredWorkflows }) => {
  const hasTeamWorkflows = team.workflows?.length > 0;
  const hasFilteredWorkflows = filteredWorkflows.length > 0;
  const hasReachedWorkflowLimit = team.quotas.maxWorkflowCount <= team.quotas.currentWorkflowCount;
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);

  if (searchQuery && !hasFilteredWorkflows) {
    return null;
  }

  return (
    <section className={styles.sectionContainer}>
      <hgroup className={styles.header}>
        {workflowQuotasEnabled && (
          <div className={styles.teamQuotaContainer}>
            <div className={styles.quotaDescriptionContainer}>
              <p
                className={styles.teamQuotaText}
              >{`Workflow quota - ${team.quotas.currentWorkflowCount} of ${team.quotas.maxWorkflowCount} used`}</p>
              {hasReachedWorkflowLimit && (
                <TooltipHover
                  direction="top"
                  tooltipText={
                    "This team has reached the maximum number of Workflows allowed - delete a Workflow to create a new one, or contact your Team administrator/owner to increase the quota."
                  }
                >
                  <WarningAlt className={styles.warningIcon} />
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
                <Button iconDescription="View quota details" kind="ghost" size="sm" onClick={openModal}>
                  View more quotas
                </Button>
              )}
            >
              {({ closeModal }: ComposedModalChildProps) => (
                <WorkflowQuotaModalContent closeModal={closeModal} quotas={team?.quotas} />
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
        {filteredWorkflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            teamId={team.id}
            workflow={workflow}
            quotas={team.quotas}
            viewType={WorkflowView.Workflow}
          />
        ))}
        {
          <CreateWorkflow
            hasReachedWorkflowLimit={hasReachedWorkflowLimit}
            team={team}
            workflows={team.workflows}
            viewType={WorkflowView.Workflow}
          />
        }
      </div>
    </section>
  );
};
