import React from "react";
import { Layer, MultiSelect, Search } from "@carbon/react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateTemplateWorkflow from "Components/CreateTemplateWorkflow";
import { appLink } from "Config/appConfig";
import { FlowTeam } from "Types";
import { WorkflowScope } from "Constants";
import styles from "./workflowsHeader.module.scss";

type HandleUpdateFilter = (query: { [key: string]: string | string[] | null }) => void;

interface WorkflowsHeaderProps {
  scope: string;
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[] | null;
  teamsQuery: string[] | null;
  teams: FlowTeam[] | null;
  workflowsCount: number;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  scope,
  selectedTeams,
  handleUpdateFilter,
  searchQuery,
  teams,
  teamsQuery,
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
            {scope === WorkflowScope.System
              ? `System Workflows (${workflowsCount})`
              : scope === WorkflowScope.Template
              ? `Template Workflows (${workflowsCount})`
              : scope === WorkflowScope.Team
              ? `Team Workflows (${workflowsCount})`
              : `Workflows (${workflowsCount})`}
          </HeaderTitle>
          {scope === WorkflowScope.User && (
            <HeaderSubtitle className={styles.headerMessage}>
              Your personal playground to create and execute automation and work smarter. Use teams to collaborate on
              workflows.
            </HeaderSubtitle>
          )}
          {scope === WorkflowScope.Team && (
            <HeaderSubtitle className={styles.headerMessage}>
              Shared workflows to collaborate on
            </HeaderSubtitle>
          )}
        </>
      }
      footer={
        !(scope === WorkflowScope.System || scope === WorkflowScope.Template) ? (
          <Tabs ariaLabel="Workflows view">
            <Tab label="My Workflows" to={appLink.workflowsMine()} />
            <Tab label="Team Workflows" to={appLink.workflowsTeams()} />
          </Tabs>
        ) : (
          <Tabs ariaLabel="Workflows view">
            <Tab label="System" to={appLink.systemManagementWorkflows()} />
            <Tab label="Templates" to={appLink.templateWorkflows()} />
          </Tabs>
        )
      }
      actions={
        <SearchFilterBar
          scope={scope}
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
  scope: string;
  handleUpdateFilter: HandleUpdateFilter;
  searchQuery: string | string[] | null;
  selectedTeams: FlowTeam[] | null;
  teamsQuery: string[] | null;
  teams: FlowTeam[] | null;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  scope,
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
      {scope !== WorkflowScope.Template && <CreateTemplateWorkflow teams={teams} scope={scope} />}
      <Layer className={styles.search}>
        <Search
          disabled={scope === WorkflowScope.Team ? !hasTeams : false}
          data-testid="workflows-team-search"
          id="search-team-workflows"
          labelText={`Search for a ${scope === WorkflowScope.Template ? "template" : "workflow"}`}
          onChange={handleOnSearchInputChange}
          placeholder={`Search for a ${scope === WorkflowScope.Template ? "template" : "workflow"}`}
          value={searchQuery}
        />
      </Layer>
      {teams && scope !== WorkflowScope.User && (
        <div className={styles.filter}>
          <MultiSelect.Filterable
            light
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
            titleText={"Filter by Team"}
          />
        </div>
      )}
    </div>
  );
};
