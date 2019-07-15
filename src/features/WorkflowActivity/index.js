import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { MultiSelect, DropdownV2 as Dropdown } from "carbon-components-react";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import orderBy from "lodash/orderBy";
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
import { executionOptions, statusOptions } from "Constants/filterOptions";
import ActivityList from "./ActivityList";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

export class WorkflowActivity extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    activityActions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    workflowId: this.props.match.params.workflowId ? this.props.match.params.workflowId : undefined,
    tableSize: 10,
    activityList: [],
    executionFilter: [],
    statusFilter: [],
    hasMoreActivities: null,
    nextPage: 1,
    isLoading: false,
    selectedTeams: []
  };

  componentDidMount() {
    const { params } = this.props.match;
    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: params.workflowId ? params.workflowId : undefined
    });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    this.props.teamsActions
      .fetch(`${BASE_SERVICE_URL}/teams`)
      .then(res => {
        this.setState({ selectedTeams: res.data }); /** Set initial selected teams */
      })
      .catch(err => {
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

  savePageSize = size => {
    this.setState({ tableSize: size });
  };

  handleSelectWorkflows = workflow => {
    const workflowId = workflow.selectedItem.id;
    this.setState({ workflowId, activityList: [], hasMoreActivities: null, nextPage: 1 });
    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: workflowId !== "none" ? workflowId : undefined
    });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
  };

  updateWorkflows = data => {
    this.props.activityActions.updateWorkflows(data);
  };

  setActivityList = activityList => {
    this.setState({ activityList });
  };

  setMoreActivities = last => {
    this.setState({ hasMoreActivities: last });
  };

  handleSelectTeams = teams => {
    this.setState({
      selectedTeams: teams.selectedItems
    });
  };

  handleExecutionFilter = data => {
    const { workflowId, searchQuery } = this.state;
    this.setState(
      { executionFilter: data.selectedItems, activityList: [], hasMoreActivities: null, nextPage: 1 },
      () => {
        const query = queryString.stringify({
          size: 10,
          page: 0,
          workflowId: workflowId !== "none" ? workflowId : undefined,
          query: searchQuery !== "" ? searchQuery : undefined
        });
        this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
      }
    );
  };
  handleStatusFilter = data => {
    const { workflowId, searchQuery } = this.state;
    this.setState({ statusFilter: data.selectedItems, activityList: [], hasMoreActivities: null, nextPage: 1 }, () => {
      const query = queryString.stringify({
        size: 10,
        page: 0,
        workflowId: workflowId !== "none" ? workflowId : undefined,
        query: searchQuery !== "" ? searchQuery : undefined
      });
      this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    });
  };

  applyExecutionFilter = activities => {
    const { executionFilter } = this.state;
    if (executionFilter.length > 0) {
      const newActivities = executionFilter.reduce((accumulator, currentVal) => {
        accumulator = accumulator.concat(activities.filter(activity => activity.trigger === currentVal.value));
        return accumulator;
      }, []);
      return orderBy(newActivities, ["creationDate"], ["desc"]);
    }
    return activities;
  };

  applyStatusFilter = activities => {
    const { statusFilter } = this.state;
    if (statusFilter.length > 0) {
      const newActivities = statusFilter.reduce((accumulator, currentVal) => {
        accumulator = accumulator.concat(activities.filter(activity => activity.status === currentVal.value));
        return accumulator;
      }, []);
      return orderBy(newActivities, ["creationDate"], ["desc"]);
    }
    return activities;
  };

  applyTeamFilter = activities => {
    const { selectedTeams } = this.state;
    const filteredActivities = activities.filter(activity => {
      let keepActivity = false;
      selectedTeams.forEach(selectedTeam => {
        if (activity.teamName === selectedTeam.name) {
          keepActivity = true;
        }
      });
      return keepActivity;
    });
    return filteredActivities;
  };

  loadMoreActivities = nextPage => {
    this.setState({ isLoading: true }, () => {
      const { searchQuery, workflowId, activityList } = this.state;
      let newActivities = [].concat(activityList.length === 0 ? this.props.activity.data.records : activityList);
      const query = queryString.stringify({
        size: 10,
        page: nextPage,
        workflowId: workflowId !== "none" ? workflowId : undefined,
        query: searchQuery !== "" ? searchQuery : undefined
      });
      axios
        .get(`${BASE_SERVICE_URL}/activity?${query}`)
        .then(response => {
          const { records, last } = response.data;
          this.setState({
            activityList: newActivities.concat(records),
            hasMoreActivities: !last,
            nextPage: nextPage + 1,
            isLoading: false
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({ hasMoreActivities: false, isLoading: false });
        });
    });
  };

  render() {
    const { activity, teams, history, match } = this.props;
    const {
      searchQuery,
      workflowId,
      activityList,
      hasMoreActivities,
      nextPage,
      isLoading,
      selectedTeams,
      //executionFilter
      emptyActivities
    } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      // const filteredActivities = this.filterActivity();
      const teamsList = JSON.parse(JSON.stringify(teams.data));
      let workflowsList = [];
      selectedTeams.forEach(team => (workflowsList = workflowsList.concat(team.workflows)));
      const workflowsFilter = sortByProp(workflowsList, "name", "ASC");

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
                items={teamsList}
                itemToString={team => (team ? team.name : "")}
                initialSelectedItems={teamsList}
              />
              <div>
                <Dropdown
                  placeholder="Workflows"
                  onChange={this.handleSelectWorkflows}
                  items={[...workflowsFilter, { id: "none", name: "All Workflows" }]}
                  itemToString={workflow => {
                    const team = selectedTeams.find(selectedTeam => selectedTeam.id === workflow.flowTeamId);
                    return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                  }}
                  initialSelectedItem={{ id: "none", name: "All Workflows" }}
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
            {!activity.data.records.length || emptyActivities || !selectedTeams.length ? (
              <NoDisplay
                style={{ marginTop: "2rem" }}
                text={
                  selectedTeams.length
                    ? "Looks like you need to run some workflows!"
                    : "Please, select at least one team to check its workflows' activity"
                }
              />
            ) : (
              <ActivityList
                activities={this.applyTeamFilter(
                  this.applyStatusFilter(
                    this.applyExecutionFilter(activityList.length > 0 ? activityList : activity.data.records)
                  )
                )}
                hasMoreActivities={hasMoreActivities === null ? !activity.data.last : hasMoreActivities}
                fetchActivities={this.fetchActivities}
                setMoreActivities={this.setMoreActivities}
                savePageSize={this.savePageSize}
                searchQuery={searchQuery}
                workflowId={workflowId}
                history={history}
                match={match}
                loadMoreActivities={this.loadMoreActivities}
                nextPage={nextPage}
                isLoading={isLoading}
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
  activity: state.activity,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  activityActions: bindActionCreators(activityActions, dispatch),
  teamsActions: bindActionCreators(teamsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActivity);
