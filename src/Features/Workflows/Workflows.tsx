import React from "react";
import { useFeature } from "flagged";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { Button } from "@carbon/react";
import { ComposedModal, Error, TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { WarningAlt } from "@carbon/react/icons";
import queryString from "query-string";
import { matchSorter } from "match-sorter";
import CreateWorkflow from "Components/CreateWorkflow";
import EmptyState from "Components/EmptyState";
import WorkflowCard from "Components/WorkflowCard";
import { WorkflowCardSkeleton } from "Components/WorkflowCard";
import WorkflowsHeader from "Components/WorkflowsHeader";
import WorkflowQuotaModalContent from "./WorkflowQuotaModalContent";
import { useAppContext } from "Hooks";
import { FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import {
  FlowTeam,
  ModalTriggerProps,
  ComposedModalChildProps,
  WorkflowView,
  PaginatedWorkflowResponse,
  Workflow,
} from "Types";
import styles from "./workflows.module.scss";

export default function WorkflowsHome() {
  const { activeTeam } = useAppContext();
  const history = useHistory();
  const location = useLocation();

  const getWorkflowsUrl = serviceUrl.getWorkflows({ query: `teams=${activeTeam?.id}` });
  const workflowsQuery = useQuery<PaginatedWorkflowResponse, string>({
    queryKey: getWorkflowsUrl,
    queryFn: resolver.query(getWorkflowsUrl),
  });

  const { query: searchQuery = "" } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });

  const handleUpdateFilter = (args: { query: string }) => {
    const queryStr = `?${queryString.stringify(args, { arrayFormat: "comma", skipEmptyString: true })}`;
    history.push({ search: queryStr });
  };

  let safeSearchQuery = "";
  if (Array.isArray(searchQuery)) {
    safeSearchQuery = searchQuery.join().toLowerCase();
  } else if (searchQuery) {
    safeSearchQuery = searchQuery.toLowerCase();
  }

  // TODO: make this smarter bc we shouldn't get to the route without an active team
  if (!activeTeam) {
    return history.push("/home");
  }

  if (workflowsQuery.isLoading) {
    return (
      <Layout activeTeam={activeTeam} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery}>
        <WorkflowCardSkeleton />
      </Layout>
    );
  }

  if (workflowsQuery.error) {
    return (
      <Layout activeTeam={activeTeam} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery}>
        <Error />
      </Layout>
    );
  }

  if (workflowsQuery.data) {
    return (
      <Layout
        activeTeam={activeTeam}
        handleUpdateFilter={handleUpdateFilter}
        searchQuery={safeSearchQuery}
        workflowCount={workflowsQuery.data.content.length}
      >
        <WorkflowContent
          activeTeam={activeTeam}
          searchQuery={safeSearchQuery}
          workflowList={workflowsQuery.data.content}
        />
      </Layout>
    );
  }

  return null;
}

interface LayoutProps {
  activeTeam: FlowTeam;
  children: React.ReactNode;
  handleUpdateFilter: (args: { query: string }) => void;
  searchQuery: string;
  workflowCount?: number;
}

function Layout(props: LayoutProps) {
  return (
    <div className={styles.container}>
      <WorkflowsHeader
        pretitle="These are your Workflows"
        title={props.activeTeam.name}
        subtitle="Your playground to create, execute, and collaborate on workflows. Work smarter with automation."
        handleUpdateFilter={props.handleUpdateFilter}
        searchQuery={props.searchQuery}
        team={props.activeTeam}
        workflowsCount={props.workflowCount}
        viewType={WorkflowView.Workflow}
      />
      <div aria-label="My Workflows" className={styles.content} role="region">
        <section className={styles.sectionContainer}>{props.children}</section>
      </div>
    </div>
  );
}

interface WorkflowContentProps {
  activeTeam: FlowTeam;
  searchQuery: string;
  workflowList: Array<Workflow>;
}

const WorkflowContent: React.FC<WorkflowContentProps> = ({ activeTeam, searchQuery, workflowList }) => {
  const hasWorkflows = workflowList.length > 0;
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const hasReachedWorkflowLimit = activeTeam.quotas.maxWorkflowCount <= activeTeam.quotas.currentWorkflowCount;

  const filteredWorkflowList = Boolean(searchQuery)
    ? matchSorter(workflowList, searchQuery, { keys: ["name", "shortDescription"] })
    : workflowList;

  if (hasWorkflows && Boolean(searchQuery) && filteredWorkflowList.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <hgroup className={styles.header}>
        {workflowQuotasEnabled ? (
          <div className={styles.teamQuotaContainer}>
            <div className={styles.quotaDescriptionContainer}>
              <p
                className={styles.teamQuotaText}
              >{`Workflow quota - ${activeTeam.quotas.currentWorkflowCount} of ${activeTeam.quotas.maxWorkflowCount} used`}</p>
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
                title: `Team quotas - ${activeTeam.name}`,
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
                <WorkflowQuotaModalContent closeModal={closeModal} quotas={activeTeam.quotas} />
              )}
            </ComposedModal>
          </div>
        ) : null}

        {hasWorkflows === false ? (
          <p className={styles.noWorkflowsMessage}>
            This team doesn’t have any Workflows - be the first to take the plunge.
          </p>
        ) : null}
      </hgroup>
      <div className={styles.workflows}>
        {filteredWorkflowList.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            quotas={activeTeam.quotas}
            teamId={activeTeam.id}
            viewType={WorkflowView.Workflow}
            workflow={workflow}
          />
        ))}
        <CreateWorkflow
          hasReachedWorkflowLimit={hasReachedWorkflowLimit}
          team={activeTeam}
          viewType={WorkflowView.Workflow}
          workflows={workflowList}
        />
      </div>
    </>
  );
};
