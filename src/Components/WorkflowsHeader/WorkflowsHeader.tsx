import React from "react";
import { Layer, Search } from "@carbon/react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CreateTemplateWorkflow from "Components/CreateTemplateWorkflow";
import { FlowTeam, WorkflowView, WorkflowViewType, Workflow } from "Types";
import styles from "./workflowsHeader.module.scss";

interface WorkflowsHeaderProps {
  pretitle: string;
  title: string;
  subtitle?: string;
  handleUpdateFilter: (args: { query: string }) => void;
  searchQuery: string | string[] | null;
  team?: FlowTeam | null;
  workflowList: Array<Workflow>;
  viewType: WorkflowViewType;
}

const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  pretitle,
  title,
  subtitle,
  handleUpdateFilter,
  searchQuery,
  team,
  workflowList,
  viewType,
}) => {
  const workflowsCount = workflowList.length;
  const workflowsCountStr = workflowsCount > 0 ? `(${workflowsCount})` : "";
  return (
    <Header
      className={styles.container}
      includeBorder={false}
      header={
        <>
          <HeaderSubtitle>{pretitle}</HeaderSubtitle>
          <HeaderTitle>{`${title} ${workflowsCountStr}`}</HeaderTitle>
          {Boolean(subtitle) ? <HeaderSubtitle className={styles.headerMessage}>{subtitle}</HeaderSubtitle> : null}
        </>
      }
      actions={
        <ActionsBar
          handleUpdateFilter={handleUpdateFilter}
          searchQuery={searchQuery}
          team={team}
          workflowsCount={workflowsCount}
          viewType={viewType}
        />
      }
    />
  );
};

export default WorkflowsHeader;

interface ActionsBarProps {
  handleUpdateFilter: (args: { query: string }) => void;
  searchQuery: string | string[] | null;
  workflowsCount?: number;
  team?: FlowTeam | null;
  viewType: WorkflowViewType;
}

const ActionsBar: React.FC<ActionsBarProps> = ({
  handleUpdateFilter,
  searchQuery,
  team,
  viewType,
  workflowsCount,
}) => {
  const handleOnSearchInputChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    handleUpdateFilter({ query: e.currentTarget?.value ?? "" });
  };

  return (
    <div className={styles.filterContainer}>
      {viewType === WorkflowView.Workflow ? <CreateTemplateWorkflow team={team!} workflowList=/> : null}
      <Layer className={styles.search}>
        <Search
          disabled={!workflowsCount || workflowsCount === 0}
          data-testid="workflows-team-search"
          id="search-team-workflows"
          labelText={`Search for a ${viewType}`}
          onChange={handleOnSearchInputChange}
          placeholder={`Search for a ${viewType}`}
          value={searchQuery}
        />
      </Layer>
    </div>
  );
};
