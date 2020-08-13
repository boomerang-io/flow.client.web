import React from "react";
import { MultiSelect, Search } from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import { FlowTeam } from "Types";
import styles from "./workflowsHeader.module.scss";

type HandleSearchFilter = (teamsList: FlowTeam[], query: string | string[] | null) => void;

interface WorkflowsHeaderProps {
  filteredTeams: FlowTeam[];
  handleSearchFilter: HandleSearchFilter;
  searchQuery: string | string[] | null;
  teamsQuery: string | string[] | undefined | null;
  teams: FlowTeam[];
  workflowsCount: number;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  filteredTeams,
  handleSearchFilter,
  searchQuery,
  teamsQuery,
  teams,
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
          searchQuery={searchQuery}
          teamsQuery={teamsQuery}
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
  searchQuery: string | string[] | null;
  teamsQuery: string | string[] | undefined | null;
  teams: FlowTeam[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filteredTeams,
  handleSearchFilter,
  searchQuery,
  teamsQuery,
  teams,
}) => {
  const handleOnMultiSelectChange = (change: any) => {
    const selectedItems = change.selectedItems;
    handleSearchFilter(selectedItems, searchQuery);
  };

  const handleOnSearchInputChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    handleSearchFilter(filteredTeams, e.currentTarget?.value ?? "");
  };

  const isTeamQueryActive = (Array.isArray(teamsQuery) && teamsQuery.length > 0) || typeof teamsQuery === "string";

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
            isTeamQueryActive && Array.isArray(filteredTeams)
              ? filteredTeams.map((team) => ({ id: team.id, text: team.name }))
              : []
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
