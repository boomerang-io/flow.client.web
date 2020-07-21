import React from "react";
import { useQuery } from "Hooks";
import { DelayedRender, DataTableSkeleton, SearchSkeleton } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import ChangeLogTable from "./ChangeLogTable";
import qs from "query-string";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowSummary } from "Types";
import styles from "./changeLog.module.scss";

interface ChangeLogProps {
  workflowSummary: WorkflowSummary;
}

const ChangeLog: React.FC<ChangeLogProps> = ({ workflowSummary }) => {
  const getWorkflowChangelogUrl = serviceUrl.getWorkflowChangelog({
    workflowId: workflowSummary.id,
    query: qs.stringify({ sort: "version", order: "DESC" }),
  });
  const { data, error, isLoading, isIdle } = useQuery(getWorkflowChangelogUrl);

  if (isIdle) {
    return null;
  }

  if (isLoading)
    return (
      <DelayedRender>
        <div className={styles.container}>
          <div className={styles.searchSkeleton}>
            <SearchSkeleton small />
          </div>
          <DataTableSkeleton />
        </div>
      </DelayedRender>
    );

  if (error) return <ErrorDragon />;

  return (
    <div className={styles.container}>
      <ChangeLogTable changeLog={data} />
    </div>
  );
};

export default ChangeLog;
