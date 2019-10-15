import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as insightsActions } from "State/insights";
import moment from "moment";
import queryString from "query-string";
import { Dropdown } from "carbon-components-react";
import { LoadingAnimation } from "@boomerang/carbon-addons-boomerang-react";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import ErrorDragon from "Components/ErrorDragon";
import ChartsTile from "./ChartsTile";
import InsightsHeader from "./InsightsHeader";
import InsightsTile from "./InsightsTile";
import CustomAreaChart from "./CustomAreaChart";
import CustomScatterChart from "./CustomScatterChart";
import CustomPieChart from "./CustomPieChart";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { executeDataLines } from "Constants/chartsConfig";
import { timeframeOptions, ALL_OPTIONS } from "Constants/filterOptions";
import { parseChartsData } from "Utilities/formatChartData";
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
    executionsList: []
  };

  handleChangeTimeframe = timeframe => {
    const timeframeValue = timeframe.selectedItem.value;
    this.setState({ selectedTimeframe: timeframeOptions.find(tf => tf.value === timeframeValue) }, () => {
      this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
    });
  };
  handleChangeTeam = team => {
    const teamId = team.selectedItem.id;
    const selectedTeam =
      teamId !== ALL_OPTIONS.TEAMS.id ? this.props.teams.data.find(team => team.id === teamId) : team.selectedItem;
    this.setState(
      {
        selectedTeam,
        selectedWorkflow: ALL_OPTIONS.WORKFLOWS
      },
      () => {
        this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
      }
    );
  };
  handleChangeWorkflow = workflow => {
    let workflows = [];
    this.props.teams.data.forEach(team => (workflows = workflows.concat(team.workflows)));
    let workflowsList = [ALL_OPTIONS.WORKFLOWS].concat(sortByProp(workflows, "name"));
    this.setState({ selectedWorkflow: workflowsList.find(wf => wf.id === workflow.selectedItem.id) }, () => {
      const { selectedWorkflow } = this.state;
      const { insights } = this.props;
      if (selectedWorkflow.id === ALL_OPTIONS.WORKFLOWS.id) this.setState({ executionsList: insights.data.executions });
      else
        this.setState({
          executionsList: insights.data.executions.filter(execution => execution.workflowId === selectedWorkflow.id)
        });
    });
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
            this.setState({ executionsList: response.data.executions });
          else
            this.setState({
              executionsList: response.data.executions.filter(execution => execution.workflowId === selectedWorkflow.id)
            });
        }
      })
      .catch(err => {
        // noop
      });
  };

  renderWidgets = () => {
    const { insights, teams } = this.props;

    if (insights.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (insights.isFetching) {
      return (
        <LoadingAnimation message="Getting your workflow data. This might take a bit." style={{ marginTop: "3rem" }} />
      );
    }

    if (insights.status === REQUEST_STATUSES.SUCCESS) {
      const { executionsList } = this.state;
      const chartData = parseChartsData(executionsList, teams.data.map(team => team.name));
      return (
        <>
          <div className={styles.statsWidgets}>
            <InsightsTile
              title="Executions"
              type="runs"
              totalCount={chartData.totalExecutions}
              infoList={chartData.dataByTeams}
            />
            <InsightsTile
              title="Duration (median)"
              type=""
              totalCount={timeSecondsToTimeUnit(chartData.medianDuration)}
              infoList={chartData.durationData}
              valueWidth="7rem"
            />
            <ChartsTile
              title="Status"
              totalCount={chartData.totalExecutions === 0 ? "" : `${chartData.percentageSuccessful}%`}
              type={chartData.totalExecutions === 0 ? "" : "successful"}
              tileWidth="27rem"
            >
              {chartData.totalExecutions === 0 ? (
                <p className={`${styles.statsLabel} --no-data`}>No Data</p>
              ) : (
                <CustomPieChart data={chartData.pieData} percentageSuccessful={chartData.percentageSuccessful} />
              )}
            </ChartsTile>
          </div>
          <div className={styles.graphsWidgets}>
            <ChartsTile title="Executions" totalCount="" type="" tileWidth="50rem">
              {chartData.totalExecutions === 0 ? (
                <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
              ) : (
                <CustomAreaChart
                  areaData={executeDataLines}
                  data={chartData.timeData}
                  toolTipDateFormat="MMM DD - YYYY"
                  xAxisKey="date"
                  yAxisText="Count"
                />
              )}
            </ChartsTile>
            <ChartsTile title="Execution Time" totalCount="" type="" tileWidth="50rem">
              {chartData.totalExecutions === 0 ? (
                <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
              ) : (
                <CustomScatterChart
                  data={chartData.scatterData}
                  yAxisText="Duration (seconds)"
                  yAxisDataKey="duration"
                />
              )}
            </ChartsTile>
          </div>
        </>
      );
    }

    return null;
  };

  render() {
    const { teams } = this.props;

    if (teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (teams.isFetching) {
      return (
        <div className={styles.container}>
          <LoadingAnimation />
        </div>
      );
    }

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
          <div className={styles.container}>
            <div className={styles.header}>
              <Dropdown
                id="teams-dropdown"
                titleText="Filter by team"
                label="Teams"
                placeholder="Teams"
                onChange={this.handleChangeTeam}
                items={teamsList}
                itemToString={team => (team ? team.name : "")}
                initialSelectedItem={ALL_OPTIONS.TEAMS}
              />
              <Dropdown
                id="workflows-dropdown"
                titleText="Filter by Workflow"
                label="Workflows"
                placeholder="Workflows"
                onChange={this.handleChangeWorkflow}
                items={workflowsFilter}
                itemToString={workflow => {
                  const team = teams.data.find(team => team.id === workflow.flowTeamId);
                  return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                }}
                initialSelectedItem={ALL_OPTIONS.WORKFLOWS}
              />
              <Dropdown
                id="time-frame-dropdown"
                titleText="Time period"
                label="Time Frame"
                placeholder="Time Frame"
                onChange={this.handleChangeTimeframe}
                items={timeframeOptions}
                itemToString={time => (time ? time.label : "")}
                initialSelectedItem={timeframeOptions[3]}
              />
            </div>
            {this.renderWidgets()}
          </div>
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
