import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import orderBy from "lodash/orderBy";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import ErrorDragon from "Components/ErrorDragon";
import SearchFilterBar from "Components/SearchFilterBar";
import ActivityList from "./ActivityList";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

class WorkflowsActivity extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    activityActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    activityFilter: []
  };

  componentDidMount() {
    this.props.activityActions.fetch(`${BASE_SERVICE_URL}/activity/${this.props.match.params.workflowId}`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }

  handleSearchFilter = (searchQuery, activity) => {
    this.setState({ searchQuery, activityFilter: activity });
  };

  filterActivity = () => {
    const { activity } = this.props;
    const { activityFilter } = this.state;

    if (activityFilter.length > 0) {
      return activity.data.filter(item => activityFilter.find(filter => filter.id === item.teamId));
    } else {
      return activity.data;
    }
  };

  updateWorkflows = data => {
    this.props.activityActions.updateWorkflows(data);
  };

  render() {
    const { activity, teams } = this.props;
    const { searchQuery } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      const filteredActivities = this.filterActivity();
      const sortedActivities = orderBy(filteredActivities, ["startTime"],['desc']);
      const teamsList = teams.data.map(team => ({ id: team.id, text: team.name }));

      if (!sortedActivities.length) {
        return (
          <div className="c-workflow-activity">
            <div className="c-workflow-activity-content">
              <NoDisplay />
            </div>
          </div>
        );
      }
      return (
        <div className="c-workflow-activity">
          <div className="c-workflow-activity-content">
            <SearchFilterBar handleSearchFilter={this.handleSearchFilter} data={activity.data} filterItems={teamsList} />
            <ActivityList activities={sortedActivities} searchQuery={searchQuery}/>
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
