import React from "react";
import PropTypes from "prop-types";
import FeatureHeader from "Components/FeatureHeader";
import SearchFilterBar from "Components/SearchFilterBar";
import styles from "./workflowsHeader.module.scss";

WorkflowsHeader.propTypes = {
  workflowsLength: PropTypes.number,
  handleSearchFilter: PropTypes.func,
  isLoading: PropTypes.bool,
  options: PropTypes.array
};

function WorkflowsHeader({ handleSearchFilter, isLoading, options, workflowsLength }) {
  return (
    <FeatureHeader>
      <div className={styles.container}>
        <section className={styles.info}>
          <p className={styles.title}>These are your</p>
          <h1 className={styles.subtitle}>{isLoading ? "Workflows" : `Workflows (${workflowsLength})`}</h1>
        </section>
        <SearchFilterBar
          filterable
          handleSearchFilter={handleSearchFilter}
          isLoading={isLoading}
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
