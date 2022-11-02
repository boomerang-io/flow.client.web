import React from "react";
import { Helmet } from "react-helmet";
import qs from "query-string";
import { useQuery } from "Hooks";
import { DataTableSkeleton, SearchSkeleton } from "@carbon/react";
import { DelayedRender } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import ChangeLogTable from "./ChangeLogTable";
import { serviceUrl } from "Config/servicesConfig";
import { WorkflowSummary } from "Types";
import styles from "./changeLog.module.scss";

interface ChangeLogProps {
  summaryData: WorkflowSummary;
}

const ChangeLog: React.FC<ChangeLogProps> = ({ summaryData }) => {
  const getWorkflowChangelogUrl = serviceUrl.getWorkflowChangelog({
    workflowId: summaryData.id,
    query: qs.stringify({ sort: "version", order: "DESC" }),
  });
  const { data, error, isLoading } = useQuery(getWorkflowChangelogUrl);
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
      <Helmet>
        <title>{`Change Log - ${summaryData.name}`}</title>
      </Helmet>
      <ChangeLogTable changeLog={data} />
    </div>
  );
};

export default ChangeLog;
