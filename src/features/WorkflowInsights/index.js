import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as insightsActions } from "State/insights";
import moment from "moment";
import queryString from "query-string";
import { DropdownV2 as Dropdown } from "carbon-components-react";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
import WidgetCard from "./WidgetCard";
import CustomAreaChart from "./CustomAreaChart";
import CustomScatterChart from "./CustomScatterChart";
import CustomPieChart from "./CustomPieChart";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import { executeDataLines } from "Constants/chartsConfig";
import { timeframeOptions, ALL_OPTIONS } from "Constants/filterOptions";
import { parseChartsData } from "Utilities/formatChartData";
import { timeSecondsToTimeUnit } from "Utilities/timeSecondsToTimeUnit";
import "./styles.scss";

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
    const { insights } = this.props;

    if (insights.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (insights.isFetching) {
      return <LoadingAnimation theme="bmrg-flow" />;
    }

    if (insights.status === REQUEST_STATUSES.SUCCESS) {
      const { executionsList } = this.state;
      const chartData = parseChartsData(executionsList);
      return (
        <>
          <div className="c-workflow-insights-stats-widgets">
            <WidgetCard title="Total Executed" type="stat">
              {chartData.totalExecutions === 0 ? (
                <p className="b-workflow-insights__stats-label --no-data">No Data</p>
              ) : (
                <p className="b-workflow-insights__stats-label">{chartData.totalExecutions}</p>
              )}
            </WidgetCard>
            <WidgetCard title="Median Duration" type="stat">
              {chartData.totalExecutions === 0 ? (
                <p className="b-workflow-insights__stats-label --no-data">No Data</p>
              ) : (
                <p className="b-workflow-insights__stats-label">
                  {chartData.medianDuration === 0 ? "0" : timeSecondsToTimeUnit(chartData.medianDuration)}
                </p>
              )}
            </WidgetCard>
            <WidgetCard title="Success Rate" type="stat">
              {chartData.totalExecutions === 0 ? (
                <p className="b-workflow-insights__stats-label --no-data">No Data</p>
              ) : (
                <CustomPieChart data={chartData.pieData} percentageSuccessful={chartData.percentageSuccessful} />
              )}
            </WidgetCard>
          </div>
          <div className="c-workflow-insights-graphs-widgets">
            <WidgetCard title="Executions" type="graph">
              {chartData.totalExecutions === 0 ? (
                <p className="b-workflow-insights__graphs-label --no-data">No Data</p>
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
            <WidgetCard title="Execution Time" type="graph">
              {chartData.totalExecutions === 0 ? (
                <p className="b-workflow-insights__graphs-label --no-data">No Data</p>
              ) : (
                <CustomScatterChart
                  data={chartData.scatterData}
                  yAxisText="Duration (seconds)"
                  yAxisDataKey="duration"
                />
              )}
            </WidgetCard>
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
        <div className="c-workflow-insights">
          <div className="c-workflow-insights-content">
            <LoadingAnimation theme="bmrg-flow" />
          </div>
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
        <div className="c-workflow-insights">
          <nav className="s-workflow-insights-navigation">
            <NavigateBack
              to={this.props.location.state ? this.props.location.state.fromUrl : "/workflows"}
              text={`Back to ${this.props.location.state ? this.props.location.state.fromText : "Workflows"}`}
            />
          </nav>
          <div className="c-workflow-insights-header">
            <Dropdown
              label="Teams"
              placeholder="Teams"
              onChange={this.handleChangeTeam}
              items={teamsList}
              itemToString={team => (team ? team.name : "")}
              initialSelectedItem={ALL_OPTIONS.TEAMS}
            />
            <Dropdown
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
