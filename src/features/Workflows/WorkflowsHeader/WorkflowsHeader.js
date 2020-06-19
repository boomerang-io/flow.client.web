import React from "react";
import PropTypes from "prop-types";
import {
  DelayedRender,
  MultiSelect,
  Search,
  SearchSkeleton,
  SelectSkeleton,
} from "@boomerang/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import styles from "./workflowsHeader.module.scss";

WorkflowsHeader.propTypes = {
  filteredTeams: PropTypes.array,
  handleSearchFilter: PropTypes.func,
  isLoading: PropTypes.bool,
  teams: PropTypes.array,
  searchQuery: PropTypes.string,
  workflowsCount: PropTypes.number,
};

export default function WorkflowsHeader({
  handleSearchFilter,
  isLoading,
  teams,
  searchQuery,
  filteredTeams,
  workflowsCount,
}) {
  return (
    <FeatureHeader className={styles.header}>
      <div className={styles.container}>
        <hgroup className={styles.info}>
          <h2 className={styles.title}>These are your</h2>
          <h1 className={styles.subtitle}>{isLoading ? "Workflows" : `Workflows (${workflowsCount})`}</h1>
        </hgroup>
        <SearchFilterBar
          filteredTeams={filteredTeams}
          handleSearchFilter={handleSearchFilter}
          isLoading={isLoading}
          placeholder="Choose a team"
          label="Choose a team"
          searchQuery={searchQuery}
          teams={teams}
        />
      </div>
    </FeatureHeader>
  );
}

SearchFilterBar.propTypes = {
  handleSearchFilter: PropTypes.func.isRequired,
  teams: PropTypes.array,
  isLoading: PropTypes.bool,
  searchQuery: PropTypes.string,
  filteredTeams: PropTypes.array,
};

function SearchFilterBar({ handleSearchFilter, isLoading, teams, searchQuery, filteredTeams }) {
  const handleOnMultiSelectChange = (e) => {
    const selectedItems = e.selectedItems;
    handleSearchFilter({ teamsList: selectedItems });
  };

  const handleOnSearchInputChange = (e) => {
    handleSearchFilter({ workflowsQuery: e.target.value, teamsList: filteredTeams });
  };

  if (isLoading) {
    return (
      <DelayedRender>
        <div className={styles.filterContainer}>
          <div className={styles.search}>
            <SearchSkeleton small />
          </div>
          <div className={styles.filter}>
            <SelectSkeleton />
          </div>
        </div>
      </DelayedRender>
    );
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.search}>
        <Search
          data-cy="workflows-team-search"
          id="search-team-workflows"
          labelText="Search for a workflow"
          onChange={handleOnSearchInputChange}
          placeHolderText="Search for a workflow"
          value={searchQuery}
        />
      </div>
      <div className={styles.filter}>
        <MultiSelect.Filterable
          id="b-search-filter__filter"
          invalid={false}
          initialSelectedItems={
            Array.isArray(filteredTeams) ? filteredTeams.map((team) => ({ id: team.id, text: team.name })) : []
          }
          items={Array.isArray(teams) ? teams.map((team) => ({ id: team.id, text: team.name })) : []}
          itemToString={(team) => (team ? team.text : "")}
          label={"Choose a team"}
          onChange={handleOnMultiSelectChange}
          placeholder={"Choose a team"}
          titleText={"Filter by team"}
        />
      </div>
    </div>
  );
}
