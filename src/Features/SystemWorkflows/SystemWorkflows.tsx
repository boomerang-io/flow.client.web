import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "Hooks";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import EmptyState from "Components/EmptyState";
import ErrorDragon from "Components/ErrorDragon";

import CreateWorkflow from "Components/CreateWorkflow";
import WorkflowsHeader from "Components/WorkflowsHeader";
import WorkflowCard from "Components/WorkflowCard";
import queryString from "query-string";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowSummary } from "Types";

import styles from "./SystemWorkflows.module.scss";

export default function SystemWorkflows() {
  const history = useHistory();

  const location = useLocation();
  let { query: searchQuery = "" } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });

  const { data: systemWorkflowsData, error, isLoading } = useQuery(serviceUrl.getSystemWorkflows());

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDragon />;
  }

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

  const filteredWorkflows =
    //@ts-ignore
    systemWorkflowsData.filter((workflow) => workflow.name.toLowerCase().includes(safeQuery)) ?? [];

  const renderWorkflows = () => {
    if (!filteredWorkflows || (filteredWorkflows?.length === 0 && searchQuery !== "")) {
      return <EmptyState />;
    }
    return (
      <div className={styles.workflows}>
        {filteredWorkflows.map((workflow: WorkflowSummary) => (
          <WorkflowCard isSystem={true} key={workflow.id} teamId={null} workflow={workflow} quotas={null} />
        ))}
        {<CreateWorkflow isSystem={true} team={null} teams={null} hasReachedWorkflowLimit={false} />}
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <WorkflowsHeader
          isSystem={true}
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          selectedTeams={null}
          teamsQuery={null}
          teams={null}
          //@ts-ignore
          workflowsCount={systemWorkflowsData.length}
        />
        <div aria-label="Team Workflows" className={styles.content} role="region">
          <section className={styles.sectionContainer}>{renderWorkflows()}</section>
        </div>
      </div>
    </>
  );
}
