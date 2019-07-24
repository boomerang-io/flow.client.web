import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import { MultiSelect } from "carbon-components-react";
import { actions as activityActions } from "State/activity";
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
    activityActions: PropTypes.object.isRequired,
    activityState: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    teamsActions: PropTypes.object.isRequired,
    teamsState: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { page = 0, size = 10, workflowIds, triggers, statuses, teamIds } = queryString.parse(
      this.props.location.search
    );

    const query = queryString.stringify({
      size,
      page,
      workflowIds,
      triggers,
      statuses,
      teamIds
    });

    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location.search !== this.props.location.search) {
      const { page = 0, size = 10, workflowIds, triggers, statuses, teamIds } = queryString.parse(
        this.props.location.search
      );

      const query = queryString.stringify({
        size,
        page,
        workflowIds,
        triggers,
        statuses,
        teamIds
      });

      this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    }
  };

  componentWillUnmount() {
    this.props.activityActions.reset();
  }

  updateHistory = queryStr => {
    this.props.history.push({ search: queryStr });
  };

  fetchActivities = url => {
    this.props.activityActions.fetch(url).catch(err => {
      //noop
    });
  };

  fetchMoreActivities = () => {
    const { activityState } = this.props;
    const { workflowIds, triggers, statuses, teamIds } = queryString.parse(this.props.location.search);

    const query = queryString.stringify({
      size: 10,
      page: activityState.data.number + 1,
      workflowIds,
      triggers,
      statuses,
      teamIds
    });

    console.log(query);

    this.props.activityActions.fetchMore(`${BASE_SERVICE_URL}/activity?${query}`).catch(err => {
      //noop
    });
  };

  handleSelectTeams = ({ selectedItems }) => {
    const { triggers, statuses } = queryString.parse(this.props.location.search);

    const queryStr = `?${queryString.stringify({
      page: 0,
      size: 10,
      workflowIds: undefined,
      triggers,
      statuses,
      teamIds: selectedItems.length > 0 ? selectedItems.map(team => team.id).join() : undefined
    })}`;

    this.updateHistory(queryStr);
  };

  handleSelectWorkflows = ({ selectedItems }) => {
    const { teamIds, triggers, statuses } = queryString.parse(this.props.location.search);

    const queryStr = `?${queryString.stringify({
      page: 0,
      size: 10,
      workflowIds: selectedItems.length > 0 ? selectedItems.map(worflow => worflow.id).join() : undefined,
      triggers,
      statuses,
      teamIds
    })}`;

    this.updateHistory(queryStr);
  };

  handleSelectTriggers = ({ selectedItems }) => {
    const { teamIds, workflowIds, statuses } = queryString.parse(this.props.location.search);

    const queryStr = `?${queryString.stringify({
      page: 0,
      size: 10,
      workflowIds,
      triggers: selectedItems.length > 0 ? selectedItems.map(trigger => trigger.value).join() : undefined,
      statuses,
      teamIds
    })}`;

    this.updateHistory(queryStr);
  };

  handleSelectStatuses = ({ selectedItems }) => {
    const { teamIds, triggers, workflowIds } = queryString.parse(this.props.location.search);

    const queryStr = `?${queryString.stringify({
      page: 0,
      size: 10,
      workflowIds,
      triggers,
      statuses: selectedItems.length > 0 ? selectedItems.map(status => status.value).join() : undefined,
      teamIds
    })}`;

    this.updateHistory(queryStr);
  };

  getWorkflowFilter(teamsData, selectedTeams) {
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
    return workflowsFilter;
  }

  render() {
    const { activityState, history, match, teamsState } = this.props;

    if (activityState.status === REQUEST_STATUSES.FAILURE || teamsState.status === REQUEST_STATUSES.FAILURE) {
      return <ErrorDragon theme="bmrg-flow" />;
    }

    if (activityState.status === REQUEST_STATUSES.SUCCESS && teamsState.status === REQUEST_STATUSES.SUCCESS) {
      const { workflowIds = "", triggers = "", statuses = "", teamIds = "" } = queryString.parse(
        this.props.location.search
      );

      const selectedTeamIds = teamIds.split(",");
      const selectedWorkflowIds = workflowIds.split(",");
      const selectedTriggers = triggers.split(",");
      const selectedStatuses = statuses.split(",");

      const teamsData = JSON.parse(JSON.stringify(teamsState.data));

      const selectedTeams = teamsData.filter(team => {
        if (selectedTeamIds.find(id => id === team.id)) {
          return true;
        } else {
          return false;
        }
      });

      const workflowsFilter = this.getWorkflowFilter(teamsData, selectedTeams);

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
                initialSelectedItems={selectedTeams}
              />
              <MultiSelect
                useTitleInItem={false}
                label="Workflows"
                invalid={false}
                onChange={this.handleSelectWorkflows}
                items={workflowsFilter}
                itemToString={workflow => {
                  const team = workflow ? teamsData.find(team => team.id === workflow.flowTeamId) : undefined;
                  return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                }}
                initialSelectedItems={workflowsFilter.filter(workflow => {
                  if (selectedWorkflowIds.find(id => id === workflow.value)) {
                    return true;
                  } else {
                    return false;
                  }
                })}
              />
              <MultiSelect
                useTitleInItem={false}
                label="Trigger"
                invalid={false}
                onChange={this.handleSelectTriggers}
                items={executionOptions}
                itemToString={item => (item ? item.value : "")}
                initialSelectedItems={executionOptions.filter(option => {
                  if (selectedTriggers.find(trigger => trigger === option.value)) {
                    return true;
                  } else {
                    return false;
                  }
                })}
              />
              <MultiSelect
                useTitleInItem={false}
                label="Status"
                invalid={false}
                onChange={this.handleSelectStatuses}
                items={statusOptions}
                itemToString={item => (item ? item.label : "")}
                initialSelectedItems={statusOptions.filter(option => {
                  if (selectedStatuses.find(status => status === option.value)) {
                    return true;
                  } else {
                    return false;
                  }
                })}
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
                activities={orderBy(activityState.data.records, ["creationDate"], ["desc"])}
                hasMoreActivities={!activityState.data.last}
                fetchActivities={this.fetchActivities}
                workflowId={workflowIds}
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
  activityActions: bindActionCreators(activityActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowActivity);
