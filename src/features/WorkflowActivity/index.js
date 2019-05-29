import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { MultiSelect } from "carbon-components-react";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import orderBy from "lodash/orderBy";
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
import SearchFilterBar from "Components/SearchFilterBar";
import SimpleSelectFilter from "Components/SimpleSelectFilter";
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
    selectedTeam: { value: "none", label: "All" }
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

  savePageSize = size => {
    this.setState({ tableSize: size });
  };

  handleSearchFilter = (searchQuery, workflowId) => {
    this.setState({ searchQuery, workflowId, activityList: [], hasMoreActivities: null, nextPage: 1 });
    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: workflowId !== "none" ? workflowId : undefined,
      query: searchQuery !== "" ? searchQuery : undefined
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

  handleChangeTeam = team => {
    const teamId = team.target.value;
    const selectedTeam = this.props.teams.data.find(team => team.id === teamId);
    this.setState({
      selectedTeam:
        teamId === "none" ? { value: "none", label: "All teams" } : { value: selectedTeam.id, label: selectedTeam.name }
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
    const { selectedTeam } = this.state;
    if (selectedTeam.value !== "none") {
      let filteredActivities = activities.filter(activity => activity.teamName === selectedTeam.label);
      return filteredActivities;
    } else return activities;
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
      selectedTeam,
      //executionFilter
      emptyActivities
    } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      // const filteredActivities = this.filterActivity();
      const teamsList = [{ value: "none", label: "All teams" }].concat(
        teams.data.map(team => ({ label: team.name, value: team.id }))
      );
      let workflowsList = [];
      teams.data.forEach(team => (workflowsList = workflowsList.concat(team.workflows)));
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
              <SimpleSelectFilter onChange={this.handleChangeTeam} selectedOption={selectedTeam} options={teamsList} />
              <SearchFilterBar
                handleSearchFilter={this.handleSearchFilter}
                options={
                  selectedTeam.value !== "none" ? teams.data.filter(team => team.id === selectedTeam.value) : teams.data
                }
                filterItems={workflowsFilter}
                debounceTimeout={300}
                multiselect={false}
                selectedOption={match.params.workflowId}
                searchbar={false}
              />
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
            {!activity.data.records.length || emptyActivities ? (
              <NoDisplay style={{ marginTop: "2rem" }} text="Looks like you need to run some workflows!" />
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
