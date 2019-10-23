import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import queryString from "query-string";
import moment from "moment";
import { DatePicker, DatePickerInput, MultiSelect as Select, Tabs, Tab } from "carbon-components-react";
import { actions as activityActions } from "State/activity";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import ActivityHeader from "./ActivityHeader";
import ActivityTable from "./ActivityTable";
import ErrorDragon from "Components/ErrorDragon";
import Loading from "Components/Loading";
import { executionOptions } from "Constants/filterOptions";
import { ACTIVITY_STATUSES, ACTIVITY_STATUSES_TO_INDEX } from "Constants/activityStatuses";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import styles from "./workflowActivity.module.scss";

const MultiSelect = Select.Filterable;
const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "creationDate";

export class WorkflowActivity extends Component {
  static propTypes = {
    activityActions: PropTypes.object.isRequired,
    activityState: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    teamsState: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      order = DEFAULT_ORDER,
      page = DEFAULT_PAGE,
      size = DEFAULT_SIZE,
      sort = DEFAULT_SORT,
      workflowIds,
      triggers,
      statuses,
      teamIds
    } = queryString.parse(this.props.location.search);

    const query = queryString.stringify({
      order,
      page,
      size,
      sort,
      statuses,
      teamIds,
      triggers,
      workflowIds
    });

    this.fetchActivities(`${BASE_SERVICE_URL}/activity?${query}`);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location.search !== this.props.location.search) {
      const {
        order = DEFAULT_ORDER,
        page = DEFAULT_PAGE,
        size = DEFAULT_SIZE,
        sort = DEFAULT_SORT,
        workflowIds,
        triggers,
        statuses,
        teamIds
      } = queryString.parse(this.props.location.search);

      const query = queryString.stringify({
        order,
        page,
        size,
        sort,
        statuses,
        teamIds,
        triggers,
        workflowIds
      });

      this.updateActivities(`${BASE_SERVICE_URL}/activity?${query}`);
    }
  };

  componentWillUnmount() {
    this.props.activityActions.reset();
  }

  updateHistorySearch = ({
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) => {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props })}`;

    this.props.history.push({ search: queryStr });
  };

  fetchActivities = url => {
    this.props.activityActions.fetch(url).catch(err => {
      //noop
    });
  };

  updateActivities = url => {
    this.props.activityActions.update(url).catch(err => {
      //noop
    });
  };

  handleSelectTeams = ({ selectedItems }) => {
    const teamIds = selectedItems.length > 0 ? selectedItems.map(team => team.id).join() : undefined;
    this.updateHistorySearch({ ...queryString.parse(this.props.location.search), teamIds, workflowIds: undefined });
  };

  handleSelectWorkflows = ({ selectedItems }) => {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map(worflow => worflow.id).join() : undefined;
    this.updateHistorySearch({ ...queryString.parse(this.props.location.search), workflowIds });
  };

  handleSelectTriggers = ({ selectedItems }) => {
    const triggers = selectedItems.length > 0 ? selectedItems.map(trigger => trigger.value).join() : undefined;
    this.updateHistorySearch({ ...queryString.parse(this.props.location.search), triggers });
  };

  handleSelectStatuses = statusIndex => {
    const statuses = statusIndex > 0 ? ACTIVITY_STATUSES_TO_INDEX[statusIndex - 1] : undefined;
    this.updateHistorySearch({ ...queryString.parse(this.props.location.search), statuses });
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
    const { activityState, history, location, match, teamsState } = this.props;

    if (activityState.isFetching) {
      return <Loading />;
    }

    if (
      activityState.status === REQUEST_STATUSES.FAILURE ||
      activityState.updateStatus === REQUEST_STATUSES.FAILURE ||
      teamsState.status === REQUEST_STATUSES.FAILURE
    ) {
      return <ErrorDragon />;
    }

    if (activityState.status === REQUEST_STATUSES.SUCCESS && teamsState.status === REQUEST_STATUSES.SUCCESS) {
      const { workflowIds = "", triggers = "", statuses = "", teamIds = "" } = queryString.parse(
        this.props.location.search
      );

      const selectedTeamIds = teamIds.split(",");
      const selectedWorkflowIds = workflowIds.split(",");
      const selectedTriggers = triggers.split(",");
      const selectedStatuses = statuses.split(",");
      const statusIndex = ACTIVITY_STATUSES_TO_INDEX.indexOf(selectedStatuses[0]);

      const teamsData = JSON.parse(JSON.stringify(teamsState.data));

      const selectedTeams = teamsData.filter(team => {
        if (selectedTeamIds.find(id => id === team.id)) {
          return true;
        } else {
          return false;
        }
      });

      const workflowsFilter = this.getWorkflowFilter(teamsData, selectedTeams);

      const activities = activityState.data.records;
      const runActivities = activities.length;
      let inProgressActivities = 0;
      let succeededActivities = 0;
      let failedActivities = 0;
      let invalidActivities = 0;

      activities.forEach(activity => {
        if (activity.status === ACTIVITY_STATUSES.COMPLETED) {
          succeededActivities++;
        } else if (activity.status === ACTIVITY_STATUSES.FAILURE) {
          failedActivities++;
        } else if (activity.status === ACTIVITY_STATUSES.IN_PROGRESS) {
          inProgressActivities++;
        } else if (activity.status === ACTIVITY_STATUSES.INVALID) {
          invalidActivities++;
        }
      });

      return (
        <div className={styles.container}>
          <ActivityHeader
            runActivities={runActivities}
            succeededActivities={succeededActivities}
            failedActivities={failedActivities}
          />
          <div className={styles.content}>
            <Tabs className={styles.tabs} selected={statusIndex + 1} onSelectionChange={this.handleSelectStatuses}>
              <Tab label={`All (${runActivities})`} />
              <Tab label={`In Progress (${inProgressActivities})`} />
              <Tab label={`Succeeded (${succeededActivities})`} />
              <Tab label={`Failed (${failedActivities})`} />
              <Tab label={`Invalid (${invalidActivities})`} />
            </Tabs>
            <section className={styles.filters}>
              <div className={styles.dataFilters}>
                <div style={{ marginRight: "1.4rem", width: "14.125rem" }}>
                  <MultiSelect
                    id="activity-teams-select"
                    label="Choose team(s)"
                    placeholder="Choose team(s)"
                    invalid={false}
                    onChange={this.handleSelectTeams}
                    items={teamsData}
                    itemToString={team => (team ? team.name : "")}
                    initialSelectedItems={selectedTeams}
                    titleText="Filter by team"
                  />
                </div>
                <div style={{ marginRight: "1.4rem", width: "14.125rem" }}>
                  <MultiSelect
                    id="activity-workflows-select"
                    label="Choose Workflow(s)"
                    placeholder="Choose Workflow(s)"
                    invalid={false}
                    onChange={this.handleSelectWorkflows}
                    items={workflowsFilter}
                    itemToString={workflow => {
                      const team = workflow ? teamsData.find(team => team.id === workflow.flowTeamId) : undefined;
                      return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                    }}
                    initialSelectedItems={workflowsFilter.filter(workflow => {
                      if (selectedWorkflowIds.find(id => id === workflow.id)) {
                        return true;
                      } else {
                        return false;
                      }
                    })}
                    titleText="Filter by workflow"
                  />
                </div>
                <div style={{ width: "14.125rem" }}>
                  <MultiSelect
                    id="activity-triggers-select"
                    label="Choose trigger type(s)"
                    placeholder="Choose trigger type(s)"
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
                    titleText="Filter by trigger"
                  />
                </div>
              </div>
              <DatePicker
                id="activity-date-picker"
                className={styles.timeFilters}
                dateFormat="m/d/Y"
                datePickerType="range"
                maxDate={moment().format("MM/DD/YYYY")}
              >
                <DatePickerInput id="activity-date-picker-start" labelText="Start date" placeholder="mm/dd/yyyy" />
                <DatePickerInput id="activity-date-picker-end" labelText="End date" placeholder="mm/dd/yyyy" />
              </DatePicker>
            </section>
            <ActivityTable
              tableData={activityState.tableData}
              isUpdating={activityState.isUpdating}
              updateHistorySearch={this.updateHistorySearch}
              history={history}
              match={match}
              location={location}
            />
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
