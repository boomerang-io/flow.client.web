import React from "react";
import { useFeature } from "flagged";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { Button, Breadcrumb, BreadcrumbItem, Link } from "@carbon/react";
import {
  ComposedModal,
  Error,
  TooltipHover,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import queryString from "query-string";
import { matchSorter } from "match-sorter";
import EmptyState from "Components/EmptyState";
import IntegrationCard from "Components/IntegrationCard";
import { IntegrationCardSkeleton } from "Components/IntegrationCard";
import { WorkflowView } from "Constants";
import { useTeamContext } from "Hooks";
import { FeatureFlag, appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam, ModalTriggerProps, ComposedModalChildProps, PaginatedWorkflowResponse, Workflow } from "Types";
import styles from "./integrations.module.scss";

export default function Integrations() {
  const { team } = useTeamContext();
  const history = useHistory();
  const location = useLocation();

  const getWorkflowsUrl = serviceUrl.getIntegrations({ query: `teams=${team?.name}` });
  const workflowsQuery = useQuery<PaginatedWorkflowResponse, string>({
    queryKey: getWorkflowsUrl,
    queryFn: resolver.query(getWorkflowsUrl),
  });

  // TODO: make this smarter bc we shouldn't get to the route without an active team
  if (!team) {
    return history.push(appLink.home());
  }

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

  if (workflowsQuery.isLoading) {
    return (
      <Layout team={team} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery} workflowList={[]}>
        <IntegrationCardSkeleton />
      </Layout>
    );
  }

  if (workflowsQuery.error) {
    return (
      <Layout team={team} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery} workflowList={[]}>
        <Error />
      </Layout>
    );
  }

  if (workflowsQuery.data) {
    return (
      <Layout
        team={team}
        handleUpdateFilter={handleUpdateFilter}
        searchQuery={safeSearchQuery}
        workflowList={workflowsQuery.data.content}
      >
        <WorkflowContent
          team={team}
          searchQuery={safeSearchQuery}
          workflowList={workflowsQuery.data.content}
          getWorkflowsUrl={getWorkflowsUrl}
        />
      </Layout>
    );
  }

  return null;
}

interface LayoutProps {
  team: FlowTeam;
  children: React.ReactNode;
  handleUpdateFilter: (args: { query: string }) => void;
  searchQuery: string;
  workflowList: Array<Workflow>;
}

function Layout(props: LayoutProps) {
  const NavigationComponent = () => {
    return (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.home()}>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{props.team.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <div className={styles.container}>
      <Header
        className={styles.header}
        includeBorder={false}
        nav={<NavigationComponent />}
        header={
          <>
            <HeaderTitle>Integrations</HeaderTitle>
            <HeaderSubtitle>Extend your automation with pre-built ???</HeaderSubtitle>
          </>
        }
      />
      <div aria-label="My Workflows" className={styles.content} role="region" id="my-workflows">
        <section className={styles.sectionContainer}>{props.children}</section>
      </div>
    </div>
  );
}

interface WorkflowContentProps {
  team: FlowTeam;
  searchQuery: string;
  workflowList: Array<Workflow>;
  getWorkflowsUrl: string;
}

const WorkflowContent: React.FC<WorkflowContentProps> = ({ team, searchQuery, workflowList, getWorkflowsUrl }) => {
  const hasWorkflows = workflowList.length > 0;
  const workflowQuotasEnabled = useFeature(FeatureFlag.WorkflowQuotasEnabled);
  const hasReachedWorkflowLimit = team.quotas.maxWorkflowCount <= team.quotas.currentWorkflowCount;

  const filteredWorkflowList = Boolean(searchQuery)
    ? matchSorter(workflowList, searchQuery, { keys: ["name"] })
    : workflowList;

  if (hasWorkflows && Boolean(searchQuery) && filteredWorkflowList.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className={styles.workflows}>
        {filteredWorkflowList.map((workflow) => (
          <IntegrationCard
            key={workflow.id}
            quotas={team.quotas}
            teamName={team.name}
            viewType={WorkflowView.Workflow}
            workflow={workflow}
            getWorkflowsUrl={getWorkflowsUrl}
          />
        ))}
      </div>
    </>
  );
};
