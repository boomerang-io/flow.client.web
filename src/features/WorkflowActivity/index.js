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
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
import SearchFilterBar from "Components/SearchFilterBar";
import { executionOptions } from "Constants/filterOptions";
import ActivityList from "./ActivityList";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import "./styles.scss";

export class WorkflowActivity extends Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    activityActions: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired
  };

  state = {
    searchQuery: "",
    workflowId: this.props.match.params.workflowId ? this.props.match.params.workflowId : undefined,
    tableSize: 10,
    activityList: [],
    executionFilter: [],
    hasMoreActivities: null,
    nextPage: 1,
    isLoading: false
  };

  componentDidMount() {
    const { params } = this.props.match;
    const query = queryString.stringify({
      size: this.state.tableSize,
      page: 0,
      workflowId: params.workflowId ? params.workflowId : undefined
    });
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }
  fetchActivities = url => {
    this.props.activityActions.fetch(url);
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
    // let newActivities = [];
    // const { activityList } = this.state;
    // let currentActivities = [].concat(activityList.length === 0 ? this.props.activity.data.records : activityList);

    // if(data.selectedItems.length > 0){
    //   data.selectedItems.forEach(item => {
    //     newActivities = newActivities.concat(currentActivities.filter(activity => activity.trigger === item.value));
    //   });
    // }
  };

  applyExecutionFilter = activities => {
    const { executionFilter } = this.state;
    let newActivities = [];
    if (executionFilter.length > 0) {
      executionFilter.forEach(item => {
        newActivities = newActivities.concat(activities.filter(activity => activity.trigger === item.value));
      });
      return sortByProp(newActivities, "creationDate", "DESC");
    }
    return activities;
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
      executionFilter
    } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      // const filteredActivities = this.filterActivity();
      let workflowsList = [];
      teams.data.forEach(team => (workflowsList = workflowsList.concat(team.workflows)));
      const workflowsFilter = sortByProp(workflowsList, "name", "ASC");

      return (
        <div className="c-workflow-activity">
          <nav className="s-workflow-activity-navigation">
            <NavigateBack to="/workflows" text="Back to Workflows" />
          </nav>
          <div className="c-workflow-activity-content">
            <div className="c-workflow-activity-header">
              <SearchFilterBar
                handleSearchFilter={this.handleSearchFilter}
                options={teams.data}
                filterItems={workflowsFilter}
                debounceTimeout={300}
                multiselect={false}
                selectedOption={match.params.workflowId}
              />
              <MultiSelect
                useTitleInItem={false}
                label="Execution type"
                invalid={false}
                onChange={this.handleExecutionFilter}
                items={executionOptions}
                itemToString={item => (item ? item.value : "")}
              />
            </div>
            {!activity.data.records.length ? (
              <NoDisplay style={{ marginTop: "2rem" }} text="Looks like you need to run some workflows!" />
            ) : (
              <ActivityList
                activities={this.applyExecutionFilter(activityList.length > 0 ? activityList : activity.data.records)}
                hasMoreActivities={hasMoreActivities === null ? !activity.data.last : hasMoreActivities}
                fetchActivities={this.fetchActivities}
                setMoreActivities={this.setMoreActivities}
                savePageSize={this.savePageSize}
                searchQuery={searchQuery}
                workflowId={workflowId}
                history={history}
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
