import React from "react";
import { MultiSelect, Search } from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import { FlowTeam } from "Types";
import styles from "./workflowsHeader.module.scss";

type HandleSearchFilter = (teamsList: FlowTeam[], query: string | string[] | null) => void;

interface WorkflowsHeaderProps {
  filteredTeams: FlowTeam[];
  handleSearchFilter: HandleSearchFilter;
  teams: FlowTeam[];
  searchQuery: string | string[] | null;
  workflowsCount: number;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  handleSearchFilter,
  teams,
  searchQuery,
  filteredTeams,
  workflowsCount,
}) => {
  return (
    <FeatureHeader className={styles.header}>
      <div className={styles.container}>
        <hgroup className={styles.info}>
          <p className={styles.title}>These are your</p>
          <h1 className={styles.subtitle}>{`Workflows (${workflowsCount})`}</h1>
        </hgroup>
        <SearchFilterBar
          filteredTeams={filteredTeams}
          handleSearchFilter={handleSearchFilter}
          placeHolderText="Choose a team"
          label="Choose a team"
          searchQuery={searchQuery}
          teams={teams}
        />
      </div>
    </FeatureHeader>
  );
};

export default WorkflowsHeader;

interface SearchFilterBarProps {
  filteredTeams: FlowTeam[];
  handleSearchFilter: HandleSearchFilter;
  label: string;
  placeHolderText: string;
  searchQuery: string | string[] | null;
  teams: FlowTeam[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ handleSearchFilter, teams, searchQuery, filteredTeams }) => {
  const handleOnMultiSelectChange = (change: any) => {
    const selectedItems = change.selectedItems;
    handleSearchFilter(selectedItems, searchQuery);
  };

  const handleOnSearchInputChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    handleSearchFilter(filteredTeams, e.currentTarget?.value ?? "");
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.search}>
        <Search
          data-testid="workflows-team-search"
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
          itemToString={(team: { text: string }) => (team ? team.text : "")}
          label={"Choose a team"}
          onChange={handleOnMultiSelectChange}
          placeholder={"Choose a team"}
          titleText={"Filter by team"}
        />
      </div>
    </div>
  );
};
