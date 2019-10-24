import React from "react";
import PropTypes from "prop-types";
import FeatureHeader from "Components/FeatureHeader";
import SearchFilterBar from "Components/SearchFilterBar";
import styles from "./workflowsHeader.module.scss";

WorkflowsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

function WorkflowsHeader({ workflowsLength, handleSearchFilter, loading, options }) {
  return (
    <FeatureHeader>
      <div className={styles.container}>
        <section className={styles.info}>
          <p className={styles.title}>These are your</p>
          <h1 className={styles.subtitle}>{loading ? "Workflows" : `Workflows (${workflowsLength})`}</h1>
        </section>
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
    </FeatureHeader>
  );
}

export default WorkflowsHeader;
