import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import moment from "moment";
import queryString from "query-string";
import { serviceUrl } from "Config/servicesConfig";
import { ComboBox, SkeletonPlaceholder } from "@boomerang-io/carbon-addons-boomerang-react";
import { useAppContext, useQuery } from "Hooks";
import { QueryStatus } from "Constants";
import sortByProp from "@boomerang-io/utils/lib/sortByProp";
import ErrorDragon from "Components/ErrorDragon";
import ChartsTile from "./ChartsTile";
import InsightsHeader from "./InsightsHeader";
import InsightsTile from "./InsightsTile";
import CarbonDonutChart from "./CarbonDonutChart";
import CarbonLineChart from "./CarbonLineChart";
import CarbonScatterChart from "./CarbonScatterChart";
import { timeframeOptions, ALL_OPTIONS } from "Constants/filterOptions";
import { parseChartsData } from "./chartHelper";
import { timeSecondsToTimeUnit } from "Utils/timeSecondsToTimeUnit";
import styles from "./workflowInsights.module.scss";

WorkflowInsights.propTypes = {
  location: PropTypes.object,
};

export default function WorkflowInsights(location) {
  const { teams } = useAppContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframeOptions[3]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(ALL_OPTIONS.WORKFLOWS);
  const [selectedTeam, setSelectedTeam] = useState(ALL_OPTIONS.TEAMS);

  const getFetchQuery = (timeFrame, team) => {
    const query = queryString.stringify({
      fromDate: moment().subtract(timeFrame.value, "days").format("x"),
      toDate: moment().format("x"),
      teamId: team.id === ALL_OPTIONS.TEAMS.id ? undefined : team.id,
    });
    return query;
  };

  const [insightsQuery, setinsightsQuery] = useState(getFetchQuery(selectedTimeframe, selectedTeam));

  const insightsUrl = serviceUrl.getInsights({ query: insightsQuery });
  const { data: insightsData, status: insightsStatus, error: insightsError } = useQuery(insightsQuery && insightsUrl);

  const isUpdatingInsights = insightsStatus === QueryStatus.Loading;

  let executionList = [];

  if (insightsData) {
    if (selectedWorkflow.id === ALL_OPTIONS.WORKFLOWS.id) executionList = insightsData.executions;
    else executionList = insightsData.executions.filter((execution) => execution.workflowId === selectedWorkflow.id);
  }

  const handleChangeTimeframe = (timeframe) => {
    const timeframeValue = timeframe.selectedItem?.value ?? null;
    const newTimeframeValue = timeframeValue
      ? timeframeOptions.find((tf) => tf.value === timeframeValue)
      : timeframeOptions[3];
    setSelectedTimeframe(newTimeframeValue);

    //trigger a new query
    setinsightsQuery(getFetchQuery(newTimeframeValue, selectedTeam));
  };

  const handleChangeTeam = (team) => {
    const teamId = team.selectedItem?.id ?? "none";
    const newSelectedTeam =
      teamId !== ALL_OPTIONS.TEAMS.id ? teams.find((team) => team.id === teamId) : ALL_OPTIONS.TEAMS;
    setSelectedTeam(newSelectedTeam);
    setSelectedWorkflow(ALL_OPTIONS.WORKFLOWS);
    //trigger a new query
    setinsightsQuery(getFetchQuery(selectedTimeframe, newSelectedTeam));
  };

  const handleChangeWorkflow = (workflow) => {
    let workflows = [];
    teams.forEach((team) => (workflows = workflows.concat(team.workflows)));
    let workflowsList = [ALL_OPTIONS.WORKFLOWS].concat(sortByProp(workflows, "name"));
    setSelectedWorkflow(
      workflow.selectedItem ? workflowsList.find((wf) => wf.id === workflow.selectedItem.id) : ALL_OPTIONS.WORKFLOWS
    );
  };

  const renderDropdowns = (teamsList, workflowsFilter) => {
    return (
      <div className={styles.header}>
        <ComboBox
          id="ALL_OPTIONS.TEAMS"
          data-testid="ALL_OPTIONS.TEAMS"
          items={teamsList}
          initialSelectedItem={selectedTeam}
          onChange={handleChangeTeam}
          titleText="Filter by team"
          itemToString={(team) => (team ? team.name : "")}
          label="Teams"
          placeholder="Teams"
        />
        <ComboBox
          id="workflows-dropdown"
          titleText="Filter by Workflow"
          label="Workflows"
          placeholder="Workflows"
          onChange={handleChangeWorkflow}
          items={workflowsFilter}
          itemToString={(workflow) => {
            if (!workflow) return "";
            const team = teams.find((team) => team.id === workflow.flowTeamId);
            return team ? `${workflow.name} [${team.name}]` : workflow.name;
          }}
          initialSelectedItem={selectedWorkflow}
        />
        <ComboBox
          id="time-frame-dropdown"
          titleText="Time period"
          label="Time Frame"
          placeholder="Time Frame"
          onChange={handleChangeTimeframe}
          items={timeframeOptions}
          itemToString={(time) => (time ? time.label : "")}
          initialSelectedItem={selectedTimeframe}
        />
      </div>
    );
  };

  const renderWidgets = ({ teamsList, workflowsFilter }) => {
    if (insightsError) {
      return <ErrorDragon />;
    }

    const hasSelectedTeam = selectedTeam.id !== "none";
    const hasSelectedWorkflow = selectedWorkflow.id !== "none";
    const {
      carbonLineData,
      carbonScatterData,
      carbonDonutData,
      durationData,
      medianDuration,
      dataByTeams,
      executionsByTeam,
    } = parseChartsData(
      executionList,
      teams.map((team) => team.name),
      hasSelectedTeam,
      hasSelectedWorkflow
    );
    const totalExecutions = executionList.length;
    return (
      <>
        {renderDropdowns(teamsList, workflowsFilter)}
        {isUpdatingInsights ? (
          <>
            <div className={styles.cardPlaceholderContainer}>
              <SkeletonPlaceholder className={styles.cardPlaceholder} />
              <SkeletonPlaceholder className={styles.cardPlaceholder} />
              <SkeletonPlaceholder className={cx(styles.cardPlaceholder, styles.wide)} />
            </div>
            <SkeletonPlaceholder className={styles.graphPlaceholder} />
            <SkeletonPlaceholder className={styles.graphPlaceholder} />
          </>
        ) : (
          <>
            <div className={styles.statsWidgets} data-testid="completed-insights">
              <div className={styles.insightsCards} style={{ flexDirection: hasSelectedWorkflow ? "column" : "row" }}>
                <InsightsTile
                  title="Executions"
                  type="runs"
                  totalCount={totalExecutions}
                  infoList={
                    hasSelectedWorkflow ? [] : hasSelectedTeam ? executionsByTeam.slice(0, 5) : dataByTeams.slice(0, 5)
                  }
                />
                <InsightsTile
                  title="Duration (median)"
                  type=""
                  totalCount={timeSecondsToTimeUnit(medianDuration)}
                  infoList={durationData}
                  valueWidth="7rem"
                  tileMaxHeight="22.375rem"
                />
              </div>
              <ChartsTile title="Status" tileWidth="33rem" tileMaxHeight="22.375rem">
                {totalExecutions === 0 ? (
                  <p className={`${styles.statsLabel} --no-data`}>No Data</p>
                ) : (
                  <CarbonDonutChart data={carbonDonutData} />
                )}
              </ChartsTile>
            </div>
            <div className={styles.graphsWidgets}>
              <ChartsTile title="Execution" totalCount="" type="" tileWidth="50rem">
                {totalExecutions === 0 ? (
                  <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
                ) : (
                  <CarbonLineChart data={carbonLineData} />
                )}
              </ChartsTile>
              <ChartsTile title="Execution Time" totalCount="" type="" tileWidth="50rem">
                {totalExecutions === 0 ? (
                  <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
                ) : (
                  <CarbonScatterChart data={carbonScatterData} />
                )}
              </ChartsTile>
            </div>
          </>
        )}
      </>
    );
  };

  const teamsList = [ALL_OPTIONS.TEAMS].concat(teams);
  let workflows = [];
  if (selectedTeam.id === ALL_OPTIONS.TEAMS.id) teams.forEach((team) => (workflows = workflows.concat(team.workflows)));
  else workflows = teams.find((team) => team.id === selectedTeam.id).workflows;
  const workflowsFilter = [ALL_OPTIONS.WORKFLOWS, ...sortByProp(workflows, "name", "ASC")];

  return (
    <>
      <InsightsHeader />
      <div className={styles.container}>{renderWidgets({ teamsList, workflowsFilter })}</div>
    </>
  );
}
