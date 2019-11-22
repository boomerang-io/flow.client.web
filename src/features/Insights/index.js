import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as insightsActions } from "State/insights";
import moment from "moment";
import queryString from "query-string";
import { SelectSkeleton, SkeletonPlaceholder } from "carbon-components-react";
import { ComboBox } from "@boomerang/carbon-addons-boomerang-react";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import DelayedRender from "Components/DelayedRender";
import ErrorDragon from "Components/ErrorDragon";
import ChartsTile from "./ChartsTile";
import InsightsHeader from "./InsightsHeader";
import InsightsTile from "./InsightsTile";
// import CustomAreaChart from "./CustomAreaChart";
// import CustomScatterChart from "./CustomScatterChart";
// import CustomPieChart from "./CustomPieChart";
import CarbonDonutChart from "./CarbonDonutChart";
import CarbonLineChart from "./CarbonLineChart";
import CarbonScatterChart from "./CarbonScatterChart";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
// import { executeDataLines } from "Constants/chartsConfig";
import { timeframeOptions, ALL_OPTIONS } from "Constants/filterOptions";
import { parseChartsData } from "./chartHelper";
import { timeSecondsToTimeUnit } from "Utilities/timeSecondsToTimeUnit";
import styles from "./workflowInsights.module.scss";

export class WorkflowInsights extends Component {
  static propTypes = {
    insights: PropTypes.object.isRequired,
    insightsActions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired
  };

  state = {
    selectedTimeframe: timeframeOptions[3],
    selectedWorkflow: ALL_OPTIONS.WORKFLOWS,
    selectedTeam: ALL_OPTIONS.TEAMS,
    executionsList: [],
    isUpdatingInsights: false
  };

  handleChangeTimeframe = timeframe => {
    const timeframeValue = timeframe.selectedItem?.value ?? null;
    this.setState(
      {
        selectedTimeframe: timeframeValue
          ? timeframeOptions.find(tf => tf.value === timeframeValue)
          : timeframeOptions[3]
      },
      () => {
        this.setState({ isUpdatingInsights: true });
        this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
      }
    );
  };
  handleChangeTeam = team => {
    const teamId = team.selectedItem?.id ?? "none";
    const selectedTeam =
      teamId !== ALL_OPTIONS.TEAMS.id ? this.props.teams.data.find(team => team.id === teamId) : ALL_OPTIONS.TEAMS;
    this.setState(
      {
        selectedTeam,
        selectedWorkflow: ALL_OPTIONS.WORKFLOWS
      },
      () => {
        this.setState({ isUpdatingInsights: true });
        this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
      }
    );
  };
  handleChangeWorkflow = workflow => {
    let workflows = [];
    this.props.teams.data.forEach(team => (workflows = workflows.concat(team.workflows)));
    let workflowsList = [ALL_OPTIONS.WORKFLOWS].concat(sortByProp(workflows, "name"));
    this.setState(
      {
        selectedWorkflow: workflow.selectedItem
          ? workflowsList.find(wf => wf.id === workflow.selectedItem.id)
          : ALL_OPTIONS.WORKFLOWS
      },
      () => {
        const { selectedWorkflow } = this.state;
        const { insights } = this.props;
        if (selectedWorkflow.id === ALL_OPTIONS.WORKFLOWS.id)
          this.setState({ executionsList: insights.data.executions });
        else
          this.setState({
            executionsList: insights.data.executions.filter(execution => execution.workflowId === selectedWorkflow.id)
          });
      }
    );
  };
  componentDidMount() {
    this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
  }

  getFetchQuery = () => {
    const { selectedTeam, selectedTimeframe } = this.state;
    const query = queryString.stringify({
      fromDate: moment()
        .subtract(selectedTimeframe.value, "days")
        .format("x"),
      toDate: moment().format("x"),
      teamId: selectedTeam.id === ALL_OPTIONS.TEAMS.id ? undefined : selectedTeam.id
    });
    return query;
  };

  fetchInsights = url => {
    const { selectedWorkflow } = this.state;
    this.props.insightsActions
      .fetch(url)
      .then(response => {
        if (response.status === 200) {
          if (selectedWorkflow.id === ALL_OPTIONS.WORKFLOWS.id)
            this.setState({ isUpdatingInsights: false, executionsList: response.data.executions });
          else
            this.setState({
              isUpdatingInsights: false,
              executionsList: response.data.executions.filter(execution => execution.workflowId === selectedWorkflow.id)
            });
        }
      })
      .catch(err => {
        // noop
      });
  };

  renderDropdowns = (teamsList, workflowsFilter) => {
    const { teams } = this.props;
    const { selectedTimeframe, selectedWorkflow, selectedTeam } = this.state;
    return (
      <div className={styles.header}>
        <ComboBox
          id="ALL_OPTIONS.TEAMS"
          data-testid="ALL_OPTIONS.TEAMS"
          items={teamsList}
          initialSelectedItem={selectedTeam}
          onChange={this.handleChangeTeam}
          titleText="Filter by team"
          itemToString={team => (team ? team.name : "")}
          label="Teams"
          placeholder="Teams"
        />
        <ComboBox
          id="workflows-dropdown"
          titleText="Filter by Workflow"
          label="Workflows"
          placeholder="Workflows"
          onChange={this.handleChangeWorkflow}
          items={workflowsFilter}
          itemToString={workflow => {
            if (!workflow) return "";
            const team = teams.data.find(team => team.id === workflow.flowTeamId);
            return team ? `${workflow.name} [${team.name}]` : workflow.name;
          }}
          initialSelectedItem={selectedWorkflow}
        />
        <ComboBox
          id="time-frame-dropdown"
          titleText="Time period"
          label="Time Frame"
          placeholder="Time Frame"
          onChange={this.handleChangeTimeframe}
          items={timeframeOptions}
          itemToString={time => (time ? time.label : "")}
          initialSelectedItem={selectedTimeframe}
        />
      </div>
    );
  };

  renderWidgets = ({ teamsList, workflowsFilter }) => {
    const { insights, teams } = this.props;
    const { isUpdatingInsights } = this.state;
    if (insights.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if ((insights.isFetching || teams.isFetching) && !isUpdatingInsights) {
      return (
        <DelayedRender>
          <>
            <div className={cx(styles.header, styles.dropdownPlaceholderContainer)}>
              <SelectSkeleton className={styles.dropdownPlaceholder} />
              <SelectSkeleton className={styles.dropdownPlaceholder} />
              <SelectSkeleton className={styles.dropdownPlaceholder} />
            </div>
            <div className={styles.cardPlaceholderContainer}>
              <SkeletonPlaceholder className={styles.cardPlaceholder} />
              <SkeletonPlaceholder className={styles.cardPlaceholder} />
              <SkeletonPlaceholder className={cx(styles.cardPlaceholder, styles.wide)} />
            </div>
            <SkeletonPlaceholder className={styles.graphPlaceholder} />
            <SkeletonPlaceholder className={styles.graphPlaceholder} />
          </>
        </DelayedRender>
      );
    }

    if (insights.status === REQUEST_STATUSES.SUCCESS) {
      const { executionsList, selectedTeam, selectedWorkflow } = this.state;
      const hasSelectedTeam = selectedTeam.id !== "none";
      const hasSelectedWorkflow = selectedWorkflow.id !== "none";
      const {
        carbonLineData,
        carbonScatterData,
        carbonDonutData,
        durationData,
        medianDuration,
        dataByTeams,
        executionsByTeam
      } = parseChartsData(executionsList, teams.data.map(team => team.name), hasSelectedTeam, hasSelectedWorkflow);
      const totalExecutions = executionsList.length;
      return (
        <>
          {this.renderDropdowns(teamsList, workflowsFilter)}
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
              <div className={styles.statsWidgets}>
                <div className={styles.insightsCards} style={{ flexDirection: hasSelectedWorkflow ? "column" : "row" }}>
                  <InsightsTile
                    title="Executions"
                    type="runs"
                    totalCount={totalExecutions}
                    infoList={
                      hasSelectedWorkflow
                        ? []
                        : hasSelectedTeam
                        ? executionsByTeam.slice(0, 5)
                        : dataByTeams.slice(0, 5)
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
    }

    return null;
  };

  render() {
    const { teams } = this.props;

    if (teams.status === REQUEST_STATUSES.SUCCESS) {
      const { selectedTeam } = this.state;
      const teamsList = [ALL_OPTIONS.TEAMS].concat(teams.data);
      let workflows = [];
      if (selectedTeam.id === ALL_OPTIONS.TEAMS.id)
        teams.data.forEach(team => (workflows = workflows.concat(team.workflows)));
      else workflows = teams.data.find(team => team.id === selectedTeam.id).workflows;
      const workflowsFilter = [ALL_OPTIONS.WORKFLOWS, ...sortByProp(workflows, "name", "ASC")];

      return (
        <>
          <InsightsHeader />
          <div className={styles.container}>{this.renderWidgets({ teamsList, workflowsFilter })}</div>
        </>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  insights: state.insights,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  insightsActions: bindActionCreators(insightsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowInsights);
