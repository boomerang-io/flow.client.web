import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "Hooks";
import { DelayedRender, DataTableSkeleton, SearchSkeleton } from "@boomerang/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import ChangeLogTable from "./ChangeLogTable";
import { serviceUrl } from "Config/servicesConfig";
import { QueryStatus } from "Constants";
import styles from "./changeLog.module.scss";

ChangeLog.propTypes = {
  summaryData: PropTypes.object.isRequired,
};

function ChangeLog({ summaryData }) {
  const getWorkflowChangelogUrl = serviceUrl.getWorkflowChangelog({ workflowId: summaryData.id });
  const { data, status, error } = useQuery(getWorkflowChangelogUrl);

  const isLoading = status === QueryStatus.Loading;

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

  if (data)
    return (
      <div className={styles.container}>
        <ChangeLogTable changeLog={data} />
      </div>
    );

  return null;
}

export default ChangeLog;
