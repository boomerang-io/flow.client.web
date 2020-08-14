import React from "react";
import { MultiSelect, Search } from "@boomerang-io/carbon-addons-boomerang-react";
import FeatureHeader from "Components/FeatureHeader";
import { FlowTeam } from "Types";
import styles from "./workflowsHeader.module.scss";

type HandleUpdateFilter = (query: { [key: string]: string | string[] | null }) => void;

interface WorkflowsHeaderProps {
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[];
  teamsQuery: string[];
  teams: FlowTeam[];
  workflowsCount: number;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  selectedTeams,
  handleUpdateFilter,
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
          selectedTeams={selectedTeams}
          handleUpdateFilter={handleUpdateFilter}
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
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[];
  teamsQuery: string[];
  teams: FlowTeam[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  selectedTeams,
  handleUpdateFilter,
  searchQuery,
  teamsQuery,
  teams,
}) => {
  const handleOnMultiSelectChange = (change: any) => {
    const selectedItems = change.selectedItems;
    handleUpdateFilter({ teams: selectedItems.map((team: { id: string }) => team.id) });
  };

  const handleOnSearchInputChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    handleUpdateFilter({ query: e.currentTarget?.value ?? "" });
  };

  const isTeamQueryActive = teamsQuery.length > 0;

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
            isTeamQueryActive && Array.isArray(selectedTeams)
              ? selectedTeams.map((team) => ({ id: team.id, text: team.name }))
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
