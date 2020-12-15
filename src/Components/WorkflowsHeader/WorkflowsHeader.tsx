import React from "react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  MultiSelect,
  Search,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { FlowTeam } from "Types";
import styles from "./workflowsHeader.module.scss";

type HandleUpdateFilter = (query: { [key: string]: string | string[] | null }) => void;

interface WorkflowsHeaderProps {
  isSystem: boolean;
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[] | null;
  teamsQuery: string[] | null;
  teams: FlowTeam[] | null;
  workflowsCount: number;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  isSystem,
  selectedTeams,
  handleUpdateFilter,
  searchQuery,
  teamsQuery,
  teams,
  workflowsCount,
}) => {
  return (
    <Header
      className={styles.container}
      includeBorder={false}
      header={
        <>
          <HeaderSubtitle>These are your</HeaderSubtitle>
          <HeaderTitle>
            {isSystem ? `System ` : ``}
            {`Workflows (${workflowsCount})`}
          </HeaderTitle>
        </>
      }
      actions={
        <SearchFilterBar
          isSystem={isSystem}
          selectedTeams={selectedTeams}
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          teamsQuery={teamsQuery}
          teams={teams}
        />
      }
    />
  );
};

export default WorkflowsHeader;

interface SearchFilterBarProps {
  isSystem: boolean;
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[] | null;
  teamsQuery: string[] | null;
  teams: FlowTeam[] | null;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  isSystem,
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

  const isTeamQueryActive = teamsQuery && teamsQuery.length > 0;
  const hasTeams = teams && teams.length > 0;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.search}>
        <Search
          disabled={isSystem ? false : !hasTeams}
          data-testid="workflows-team-search"
          id="search-team-workflows"
          labelText="Search for a workflow"
          onChange={handleOnSearchInputChange}
          placeHolderText="Search for a workflow"
          value={searchQuery}
        />
      </div>
      {teams && (
        <div className={styles.filter}>
          <MultiSelect.Filterable
            disabled={!hasTeams}
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
      )}
    </div>
  );
};
