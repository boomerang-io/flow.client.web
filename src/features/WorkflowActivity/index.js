import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { MultiSelect, DropdownV2 as Dropdown } from "carbon-components-react";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import orderBy from "lodash/orderBy";
import flow from "lodash/flow";
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
import { executionOptions, statusOptions } from "Constants/filterOptions";
import ActivityList from "./ActivityList";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

export class WorkflowActivity extends Component {
  static propTypes = {
    activityActions: PropTypes.object.isRequired,
    activityState: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired,
    teamsState: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    selectedWorkflow: this.props.match.params.workflowId
      ? { id: this.props.match.params.workflowId }
      : { id: "all", name: "All workflows" },
    tableSize: 10,
    executionFilter: [],
    statusFilter: [],
    selectedTeams: [],
    teams: []
  };

  componentDidMount() {
    const { params } = this.props.match;
    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: params.workflowId ? params.workflowId : undefined
    });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`).catch(err => {
      // noop
    });
  }

  componentWillUnmount() {
    this.props.activityActions.reset();
  }

  fetchActivities = url => {
    this.props.activityActions.fetch(url).catch(err => {
      //noop
    });
  };

  fetchMoreActivities = () => {
    const { activityState } = this.props;
    const { searchQuery, selectedWorkflow } = this.state;
    const query = queryString.stringify({
      size: 10,
      workflowId: selectedWorkflow.id !== "all" ? selectedWorkflow.id : undefined,
      query: searchQuery !== "" ? searchQuery : undefined,
      page: activityState.data.number + 1
    });

    this.props.activityActions.fetchMore(`${BASE_SERVICE_URL}/activity?${query}`).catch(err => {
      //noop
    });
  };

  handleSelectTeams = teams => {
    this.setState(
      {
        selectedTeams: teams.selectedItems
      },
      () => {
        this.handleSelectWorkflows({ selectedItem: { id: "all", name: "All workflows" } });
      }
    );
  };

  handleSelectWorkflows = ({ selectedItem: selectedWorkflow }) => {
    this.setState({
      selectedWorkflow
    });

    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: selectedWorkflow.id !== "all" ? selectedWorkflow.id : undefined
    });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
  };

  handleExecutionFilter = ({ selectedItems }) => {
    const { selectedWorkflow, searchQuery } = this.state;
    this.setState({ executionFilter: selectedItems }, () => {
      const query = queryString.stringify({
        size: 10,
        page: 0,
        workflowId: selectedWorkflow.id !== "all" ? selectedWorkflow.id : undefined,
        query: searchQuery !== "" ? searchQuery : undefined
      });
      this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    });
  };

  handleStatusFilter = ({ selectedItems }) => {
    const { selectedWorkflow, searchQuery } = this.state;
    this.setState({ statusFilter: selectedItems }, () => {
      const query = queryString.stringify({
        size: 10,
        page: 0,
        workflowId: selectedWorkflow.id !== "all" ? selectedWorkflow.id : undefined,
        query: searchQuery !== "" ? searchQuery : undefined
      });
      this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    });
  };

  applyExecutionFilter = activities => {
    const { executionFilter } = this.state;
    if (!executionFilter.length) {
      return activities;
    }
    const filteredActivities = activities.filter(activity => {
      if (executionFilter.find(trigger => trigger.value === activity.trigger)) {
        return true;
      } else {
        return false;
      }
    });

    return filteredActivities;
  };

  applyStatusFilter = activities => {
    const { statusFilter } = this.state;
    if (!statusFilter.length) {
      return activities;
    }
    const filteredActivities = activities.filter(activity => {
      if (statusFilter.find(status => status.value === activity.status)) {
        return true;
      } else {
        return false;
      }
    });

    return filteredActivities;
  };

  applyTeamFilter = activities => {
    const { selectedTeams } = this.state;
    const sortedActivities = orderBy(activities, ["creationDate"], ["desc"]);
    if (!selectedTeams.length) {
      return sortedActivities;
    }
    const filteredActivities = sortedActivities.filter(activity => {
      if (selectedTeams.find(selectedTeam => activity.teamName === selectedTeam.name)) {
        return true;
      } else {
        return false;
      }
    });

    return filteredActivities;
  };

  getWorkflowFilter(teamsData) {
    const { selectedTeams } = this.state;

    let workflowsList = [];
    if (!selectedTeams.length) {
      workflowsList = teamsData.reduce((acc, team) => {
        acc = acc.concat(team.workflows);
        return acc;
      }, []);
    } else {
      workflowsList = selectedTeams.reduce((acc, team) => {
        acc = acc.concat(team.workflows);
        return acc;
      }, []);
    }
    let workflowsFilter = sortByProp(workflowsList, "name", "ASC");
    workflowsFilter = [{ id: "all", name: "All workflows" }, ...workflowsFilter];
    return workflowsFilter;
  }

  render() {
    const { activityState, history, match, teamsState } = this.props;
    const { searchQuery, selectedWorkflow } = this.state;

    if (activityState.status === REQUEST_STATUSES.FAILURE || teamsState.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (activityState.status === REQUEST_STATUSES.SUCCESS && teamsState.status === REQUEST_STATUSES.SUCCESS) {
      const teamsData = JSON.parse(JSON.stringify(teamsState.data));
      const workflowsFilter = this.getWorkflowFilter(teamsData);
      return (
        <div className="c-workflow-activity">
          <nav className="s-workflow-activity-navigation">
            <NavigateBack
              to={this.props.location.state ? this.props.location.state.fromUrl : "/workflows"}
              text={`Back to ${this.props.location.state ? this.props.location.state.fromText : "Workflows"}`}
            />
          </nav>
          <div className="c-workflow-activity-content">
            <div className="c-workflow-activity-header">
              <MultiSelect
                useTitleInItem={false}
                label="Teams"
                invalid={false}
                onChange={this.handleSelectTeams}
                items={teamsData}
                itemToString={team => (team ? team.name : "")}
              />
              <div>
                <Dropdown
                  label="Workflows"
                  placeholder="Workflows"
                  onChange={this.handleSelectWorkflows}
                  items={workflowsFilter}
                  itemToString={workflow => {
                    const team = workflow ? teamsData.find(team => team.id === workflow.flowTeamId) : undefined;
                    return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                  }}
                  selectedItem={
                    selectedWorkflow.name
                      ? selectedWorkflow
                      : workflowsFilter.find(workflow => workflow.id === selectedWorkflow.id)
                  }
                />
              </div>
              <MultiSelect
                useTitleInItem={false}
                label="Trigger"
                invalid={false}
                onChange={this.handleExecutionFilter}
                items={executionOptions.map(item => ({ label: item.label, value: item.value }))}
                itemToString={item => (item ? item.value : "")}
              />
              <MultiSelect
                useTitleInItem={false}
                label="Status"
                invalid={false}
                onChange={this.handleStatusFilter}
                items={statusOptions.map(item => ({ label: item.label, value: item.value }))}
                itemToString={item => (item ? item.label : "")}
              />
            </div>
            {!activityState.data.records.length ? (
              <NoDisplay
                style={{ marginTop: "5.5rem" }}
                textLocation="below"
                text="Looks like you need to run some workflows!"
              />
            ) : (
              <ActivityList
                activities={flow([this.applyExecutionFilter, this.applyStatusFilter, this.applyTeamFilter])(
                  activityState.data.records
                )}
                hasMoreActivities={!activityState.data.last}
                fetchActivities={this.fetchActivities}
                searchQuery={searchQuery}
                workflowId={selectedWorkflow.id !== "all" ? selectedWorkflow.id : undefined}
                history={history}
                isLoading={activityState.isFetchingMore}
                match={match}
                loadMoreActivities={this.fetchMoreActivities}
              />
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  activityState: state.activity,
  teamsState: state.teams
});

const mapDispatchToProps = dispatch => ({
  activityActions: bindActionCreators(activityActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActivity);
