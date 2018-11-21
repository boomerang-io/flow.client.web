import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as activityActions } from "State/activity";
import { actions as teamsActions } from "State/teams";
import NoDisplay from "@boomerang/boomerang-components/lib/NoDisplay";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import ErrorDragon from "Components/ErrorDragon";
import NavigateBack from "Components/NavigateBack";
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
    workflowId:this.props.match.params.workflowId?this.props.match.params.workflowId:"",
    tableSize: 10,
    activityList:[],
    hasMoreActivities: null,
    nextPage:1
  };

  componentDidMount() {
    const { params } = this.props.match;
    const workflowParam = params.workflowId? `&workflowId=${params.workflowId}`:"";
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?size=${this.state.tableSize}&page=0${workflowParam}`);
    this.props.teamsActions.fetch(`${BASE_SERVICE_URL}/teams`);
  }
  fetchActivities = url => {
    this.props.activityActions.fetch(url);
  };
  savePageSize = size => {
    this.setState({ tableSize: size });
  };

  handleSearchFilter = (searchQuery, workflowId) => {
    this.setState({ searchQuery, workflowId, activityList:[], hasMoreActivities:null, nextPage:1 });
    const workflowUrl = workflowId.length>0 && workflowId!=="none" ?`&workflowId=${workflowId}`:"";
    this.fetchActivities(`${BASE_SERVICE_URL}/activity?size=${this.state.tableSize}&page=0&query=${searchQuery}${workflowUrl}`);
  };

  updateWorkflows = data => {
    this.props.activityActions.updateWorkflows(data);
  };

  setActivityList = (activityList) => {
    this.setState({activityList});
  };
  
  setMoreActivities = (last) => {
    this.setState({hasMoreActivities: last});
  };

  loadMoreActivities = (nextPage) => {
    const { searchQuery, workflowId, activityList } = this.state;
    let newActivities = [].concat(activityList.length===0? this.props.activity.data.records:activityList);
    const workflowUrl = workflowId.length>0 && workflowId!=="none" ?`&workflowId=${workflowId}`:"";
    axios
      .get(`${BASE_SERVICE_URL}/activity?size=10&page=${nextPage}&query=${searchQuery}${workflowUrl}`)
      .then(response => {
        const { records, last } = response.data;
        this.setState({ activityList: newActivities.concat(records), hasMoreActivities: !last, nextPage: nextPage+1 });
      });
  };

  render() {
    const { activity, teams, history, match } = this.props;
    const { searchQuery, workflowId, activityList, hasMoreActivities, nextPage } = this.state;

    if (activity.status === REQUEST_STATUSES.FAILURE || teams.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-white" />;
    }

    if (activity.status === REQUEST_STATUSES.SUCCESS && teams.status === REQUEST_STATUSES.SUCCESS) {
      // const filteredActivities = this.filterActivity();
      let workflowsList = [];
      teams.data.forEach(team => workflowsList = workflowsList.concat(team.workflows));
      const workflowsFilter = sortByProp(workflowsList,"name","ASC");

      return (
        <div className="c-workflow-activity">
          <nav className="s-workflow-activity-navigation">
            <NavigateBack to="/workflows" text="Back to Workflows" />
          </nav>
          <div className="c-workflow-activity-content">
            <SearchFilterBar
              handleSearchFilter={this.handleSearchFilter}
              options={teams.data}
              filterItems={workflowsFilter}
              debounceTimeout={300}
              multiselect={false}
              selectedOption={match.params.workflowId}
            />
            {!activity.data.records.length ? (
              <NoDisplay style={{ marginTop: "2rem" }} text="Looks like you need to run some workflows!" />
            ) : (
              <ActivityList
                activities={activityList.length>0?activityList: activity.data.records}
                hasMoreActivities={hasMoreActivities===null? !activity.data.last: hasMoreActivities}
                fetchActivities={this.fetchActivities}
                setMoreActivities={this.setMoreActivities}
                savePageSize={this.savePageSize}
                searchQuery={searchQuery}
                workflowId={workflowId}
                history={history}
                loadMoreActivities={this.loadMoreActivities}
                nextPage={nextPage}
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
)(WorkflowsActivity);
