import React from "react";
import PropTypes from "prop-types";
import SearchFilterBar from "Components/SearchFilterBar";
import styles from "./workflowsHeader.module.scss";

WorkflowsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

function WorkflowsHeader({ workflowsLength, handleSearchFilter, loading, options }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h1 className={styles.title}>These are your</h1>
          <h2 className={styles.subtitle}>{loading ? "Workflows" : `Workflows (${workflowsLength})`}</h2>
        </div>
        <SearchFilterBar
          filterable
          loading={loading}
          handleSearchFilter={handleSearchFilter}
          placeholder="Choose a team"
          label="Choose a team"
          title="Filter by team"
          options={options}
        />
      </div>
    </div>
  );
}

export default WorkflowsHeader;
