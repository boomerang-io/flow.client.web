import React from "react";
import { useHistory, useLocation, Redirect, Route, Switch } from "react-router-dom";
import { useQuery } from "Hooks";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import CreateWorkflow from "Components/CreateWorkflow";
import EmptyState from "Components/EmptyState";
import ErrorDragon from "Components/ErrorDragon";
import WorkflowCard from "Components/WorkflowCard";
import WorkflowsHeader from "Components/WorkflowsHeader";
import queryString from "query-string";
import { serviceUrl } from "Config/servicesConfig";
import { AppPath } from "Config/appConfig";
import { WorkflowSummary } from "Types";
import { WorkflowScope } from "Constants";

import styles from "./SystemWorkflows.module.scss";

export default function SystemWorkflows() {
  const history = useHistory();

  const location = useLocation();
  let { query: searchQuery = "" } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });
  const isWorkflowTemplates = location.pathname.includes("templates");

  const { data: systemWorkflowsData, error, isLoading } = useQuery(serviceUrl.getSystemWorkflows());
  const {
    data: templatesWorkflowData,
    error: errorTemplatesWorkflow,
    isLoading: isLoadingTemplatesWorkflow,
  } = useQuery(serviceUrl.workflowTemplates());

  let safeQuery = "";
  if (Array.isArray(searchQuery)) {
    safeQuery = searchQuery.join().toLowerCase();
  } else if (searchQuery) {
    safeQuery = searchQuery.toLowerCase();
  }

  const handleUpdateFilter = (query: { [key: string]: any }) => {
    const queryStr = `?${queryString.stringify(
      { ...queryString.parse(location.search, { arrayFormat: "comma" }), ...query },
      { arrayFormat: "comma", skipEmptyString: true }
    )}`;

    history.push({ search: queryStr });
  };

  const filteredWorkflows = isWorkflowTemplates
    ? templatesWorkflowData?.filter((workflow: any) => workflow.name.toLowerCase().includes(safeQuery)) ?? []
    : systemWorkflowsData?.filter((workflow: any) => workflow.name.toLowerCase().includes(safeQuery)) ?? [];

  return (
    <>
      <div className={styles.container}>
        <WorkflowsHeader
          handleUpdateFilter={handleUpdateFilter}
          scope={isWorkflowTemplates ? WorkflowScope.Template : WorkflowScope.System}
          searchQuery={searchQuery}
          selectedTeams={null}
          teamsQuery={null}
          teams={null}
          //@ts-ignore
          workflowsCount={isWorkflowTemplates ? templatesWorkflowData?.length ?? 0 : systemWorkflowsData?.length ?? 0}
        />
        <div aria-label="Team Workflows" className={styles.content} role="region">
          <Switch>
            <Route path={AppPath.SystemManagementWorkflows}>
              <section className={styles.sectionContainer}>
                <RenderWorkflows
                  isLoading={isLoading}
                  error={error}
                  filteredWorkflows={filteredWorkflows}
                  searchQuery={searchQuery}
                />
              </section>
            </Route>
            <Route path={AppPath.TemplatesWorkflows}>
              <section className={styles.sectionContainer}>
                <RenderTemplates
                  isLoading={isLoadingTemplatesWorkflow}
                  error={errorTemplatesWorkflow}
                  filteredWorkflows={filteredWorkflows}
                  searchQuery={searchQuery}
                />
              </section>
            </Route>
            <Redirect exact from={AppPath.SystemWorkflows} to={AppPath.SystemManagementWorkflows} />
          </Switch>
        </div>
      </div>
    </>
  );
}

type WorkflowProps = {
  isLoading: boolean;
  error: any;
  filteredWorkflows: WorkflowSummary[];
  searchQuery: string | string[] | null;
};

const RenderWorkflows = ({ isLoading, error, filteredWorkflows, searchQuery }: WorkflowProps) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDragon />;
  }

  if (!filteredWorkflows || (filteredWorkflows?.length === 0 && searchQuery !== "")) {
    return <EmptyState />;
  }
  return (
    <div className={styles.workflows}>
      {filteredWorkflows.map((workflow: WorkflowSummary) => (
        <WorkflowCard
          scope={WorkflowScope.System}
          key={workflow.id}
          teamId={null}
          workflow={workflow}
          quotas={null}
          canEditWorkflow={true}
        />
      ))}
      {<CreateWorkflow scope={WorkflowScope.System} hasReachedWorkflowLimit={false} canEditWorkflow={true} />}
    </div>
  );
};

type TemplatesProps = {
  isLoading: boolean;
  error: any;
  filteredWorkflows: WorkflowSummary[];
  searchQuery: string | string[] | null;
};

const RenderTemplates = ({ isLoading, error, filteredWorkflows, searchQuery }: TemplatesProps) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDragon />;
  }

  if (!filteredWorkflows || (filteredWorkflows?.length === 0 && searchQuery !== "")) {
    return <EmptyState />;
  }
  return (
    <div className={styles.workflows}>
      {filteredWorkflows.map((workflow: WorkflowSummary) => (
        <WorkflowCard
          scope={WorkflowScope.Template}
          key={workflow.id}
          teamId={null}
          workflow={workflow}
          quotas={null}
          canEditWorkflow={true}
        />
      ))}
      {<CreateWorkflow scope={WorkflowScope.Template} hasReachedWorkflowLimit={false} canEditWorkflow={true} />}
    </div>
  );
};
