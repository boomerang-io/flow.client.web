import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import ActivityList from "./ActivityList";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsActivity extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    activityActions: PropTypes.object.isRequired,
  };

  state = {
    searchQuery: "",
    teamFilter: [],
    tableSize: 10
  };

  componentDidMount() {
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?size=${this.state.tableSize}&page=0`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }
  fetchActivities = url => {
    this.props.activityActions.fetch(url);
  };
  savePageSize = size => {
    this.setState({ tableSize: size });
  };
  handleSearchFilter = (searchQuery, team) => {
    this.setState({ searchQuery, teamFilter: team });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?size=${this.state.tableSize}&page=0&query=${searchQuery}`);
  };

  filterActivity = () => {
    const { activity } = this.props;
    const { teamFilter } = this.state;

    if (teamFilter.length > 0) {
      return activity.data.records.filter(item => teamFilter.find(filter => filter.id === item.teamId));
    } else {
      return activity.data.records;
    }
  };

  updateWorkflows = data => {
    this.props.activityActions.updateWorkflows(data);
  };

  render() {
    const { activity, teams, history } = this.props;
    const { searchQuery } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const filteredActivities = this.filterActivity();
      const teamsList = teams.data.map(team => ({ id: team.id, text: team.name }));

      return (
        <div className="c-workflow-activity">
          <div className="c-workflow-activity-content">
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} data={activity.data} filterItems={teamsList} debounceTimeout={300} />
            {
              !filteredActivities.length?
              <NoDisplay style={{marginTop:"2rem"}} text="No activities found" />
              :
              <ActivityList activities={activity.data} fetchActivities={this.fetchActivities} savePageSize={this.savePageSize} searchQuery={searchQuery} history={history}/>
            }
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
)(WorkflowsActivity);
