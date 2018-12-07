import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as insightsActions } from "State/insights";
import { actions as teamsActions } from "State/teams";
import moment from "moment";
import queryString from "query-string";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import SelectDropdown from "@boomerang/boomerang-components/lib/SelectDropdown";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import NavigateBack from "Components/NavigateBack";
import ErrorDragon from "Components/ErrorDragon";
import WidgetCard from "./WidgetCard";
import CustomAreaChart from "./CustomAreaChart";
import CustomScatterChart from "./CustomScatterChart";
import CustomPieChart from "./CustomPieChart";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { executeDataLines } from "Constants/chartsConfig";
import { timeframeOptions } from "Constants/filterOptions";
import { parseChartsData } from "Utilities/formatChartData";
import { timeSecondsToTimeUnit } from "Utilities/timeSecondsToTimeUnit";
import "./styles.scss";

export class WorkflowInsights extends Component {
  static propTypes = {
    insights: PropTypes.object.isRequired,
    insightsActions: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    selectedTimeframe: timeframeOptions[3],
    selectedWorkflow: { value: "all", label: "All" },
    selectedTeam: { value: "all", label: "All" },
    executionsList: []
  };

  handleChangeTimeframe = timeframe => {
    this.setState({ selectedTimeframe: timeframe }, () => {
      this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
    });
  };
  handleChangeTeam = team => {
    this.setState({ selectedTeam: team, selectedWorkflow: { value: "all", label: "All" } }, () => {
      this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
    });
  };
  handleChangeWorkflow = workflow => {
    this.setState({ selectedWorkflow: workflow }, () => {
      const { selectedWorkflow } = this.state;
      const { insights } = this.props;
      if (selectedWorkflow.value === "all") this.setState({ executionsList: insights.data.executions });
      else
        this.setState({
          executionsList: insights.data.executions.filter(execution => execution.workflowId === selectedWorkflow.value)
        });
    });
  };
  componentDidMount() {
    this.fetchInsights(`${BASE_SERVICE_URL}/insights?${this.getFetchQuery()}`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  getFetchQuery = () => {
    const { selectedTeam, selectedTimeframe } = this.state;
    const query = queryString.stringify({
      fromDate: moment()
        .subtract("days", selectedTimeframe.value)
        .format("x"),
      toDate: moment().format("x"),
      teamId: selectedTeam.value === "all" ? undefined : selectedTeam.value
    });
    return query;
  };

  fetchInsights = url => {
    const { selectedWorkflow } = this.state;
    this.props.insightsActions.fetch(url).then(response => {
      if (response.status === 200) {
        if (selectedWorkflow.value === "all") this.setState({ executionsList: response.data.executions });
        else
          this.setState({
            executionsList: response.data.executions.filter(
              execution => execution.workflowId === selectedWorkflow.value
            )
          });
      }
    });
  };

  render() {
    const { insights, teams } = this.props;

    if (insights.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (insights.isFetching || teams.isFetching) {
      return (
        <div className="c-workflow-insights">
          <div className="c-workflow-insights-content">
            <LoadingAnimation theme="bmrg-white" />
          </div>
        </div>
      );
    }

    if (insights.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const { executionsList, selectedTeam } = this.state;
      const teamsList = [{ value: "all", label: "All" }].concat(
        teams.data.map(team => ({ label: team.name, value: team.id }))
      );
      let workflows = [];
      if (selectedTeam.value === "all") teams.data.forEach(team => (workflows = workflows.concat(team.workflows)));
      else workflows = teams.data.find(team => team.id === selectedTeam.value).workflows;
      const chartData = parseChartsData(executionsList);
      let workflowsList = [{ value: "all", label: "All" }].concat(
        sortByProp(workflows.map(workflow => ({ ...workflow, value: workflow.id, label: workflow.name })), "label")
      );
      return (
        <div className="c-workflow-insights">
          <nav className="s-workflow-insights-navigation">
            <NavigateBack to="/workflows" text="Back to Workflows" />
          </nav>
          <div className="c-workflow-insights-header">
            <SelectDropdown
              options={teamsList}
              theme="bmrg-white"
              styles={{ width: "22rem", marginTop: "1rem" }}
              title="TEAM"
              placeholder="Select a team"
              value={this.state.selectedTeam}
              onChange={this.handleChangeTeam}
            />
            <SelectDropdown
              options={workflowsList}
              theme="bmrg-white"
              styles={{ width: "22rem", marginTop: "1rem" }}
              title="WORKFLOWS"
              placeholder="Select a workflow"
              value={this.state.selectedWorkflow}
              onChange={this.handleChangeWorkflow}
            />
            <SelectDropdown
              options={timeframeOptions}
              theme="bmrg-white"
              styles={{ width: "22rem", marginTop: "1rem" }}
              value={this.state.selectedTimeframe}
              title="TIMEFRAME"
              onChange={this.handleChangeTimeframe}
            />
          </div>
          <div className="c-workflow-insights__stats-widgets">
            <div className="c-workflow-insights__stats">
              <WidgetCard title="Total Executed">
                {chartData.totalExecutions === 0 ? (
                  <label className="b-workflow-insights__stats-label --no-data">No Data</label>
                ) : (
                  <label className="b-workflow-insights__stats-label">{chartData.totalExecutions}</label>
                )}
              </WidgetCard>
            </div>
            <div className="c-workflow-insights__stats">
              <WidgetCard title="Median Duration">
                {chartData.totalExecutions === 0 ? (
                  <label className="b-workflow-insights__stats-label --no-data">No Data</label>
                ) : (
                  <label className="b-workflow-insights__stats-label">
                    {chartData.medianDuration === 0 ? "0" : timeSecondsToTimeUnit(chartData.medianDuration)}
                  </label>
                )}
              </WidgetCard>
            </div>
            <div className="c-workflow-insights__stats">
              <WidgetCard title="Success Rate">
                {chartData.totalExecutions === 0 ? (
                  <label className="b-workflow-insights__stats-label --no-data">No Data</label>
                ) : (
                  <CustomPieChart data={chartData.pieData} percentageSuccessful={chartData.percentageSuccessful} />
                )}
              </WidgetCard>
            </div>
          </div>
          <div className="c-workflow-insights__graphs-widgets">
            <div className="c-workflow-insights-graph">
              <WidgetCard title="Executions">
                {chartData.totalExecutions === 0 ? (
                  <label className="b-workflow-insights__graphs-label --no-data">No Data</label>
                ) : (
                  <CustomAreaChart
                    areaData={executeDataLines}
                    data={chartData.timeData}
                    toolTipDateFormat="MMM DD - YYYY"
                    xAxisKey="date"
                    yAxisText="Count"
                  />
                )}
              </WidgetCard>
            </div>
            <div className="c-workflow-insights-graph">
              <WidgetCard title="Average Execution Time">
                {chartData.totalExecutions === 0 ? (
                  <label className="b-workflow-insights__graphs-label --no-data">No Data</label>
                ) : (
                  <CustomScatterChart
                    data={chartData.scatterData}
                    yAxisText="Duration (seconds)"
                    yAxisDataKey="duration"
                  />
                )}
              </WidgetCard>
            </div>
          </div>
        </div>
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
  insightsActions: bindActionCreators(insightsActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowInsights);
