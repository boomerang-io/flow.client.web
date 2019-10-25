import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import queryString from "query-string";
import moment from "moment";
import { DatePicker, DatePickerInput, MultiSelect as Select, Tabs, Tab } from "carbon-components-react";
import sortByProp from "@boomerang/boomerang-utilities/lib/sortByProp";
import ActivityHeader from "./ActivityHeader";
import ActivityTable from "./ActivityTable";
import ErrorDragon from "Components/ErrorDragon";
import { executionOptions } from "Constants/filterOptions";
import { ACTIVITY_STATUSES_TO_INDEX } from "Constants/activityStatuses";
import { BASE_SERVICE_URL, REQUEST_STATUSES } from "Config/servicesConfig";
import useAxiosFetch from "Utilities/hooks/useAxiosFetch";
import styles from "./workflowActivity.module.scss";

const MultiSelect = Select.Filterable;
const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "creationDate";

WorkflowActivity.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  teamsState: PropTypes.object.isRequired
};

export function WorkflowActivity({ activityActions, history, location, match, teamsState }) {
  const {
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    workflowIds,
    triggers,
    statuses,
    teamIds,
    fromDate,
    toDate
  } = queryString.parse(location.search);

  /**** Start get some data ****/
  const activityRequestQuery = queryString.stringify({
    order,
    page,
    size,
    sort,
    statuses,
    teamIds,
    triggers,
    workflowIds,
    fromDate,
    toDate
  });

  const executionStatusSummaryRequestQuery = queryString.stringify({
    order,
    page,
    size,
    sort,
    teamIds,
    triggers,
    workflowIds
  });

  const activitySummaryRequestUrl = `${BASE_SERVICE_URL}/activity/summary`;
  const activityStatusSummaryRequestUrl = `${BASE_SERVICE_URL}/activity/summary?${executionStatusSummaryRequestQuery}`;
  const activityRequestUrl = `${BASE_SERVICE_URL}/activity?${activityRequestQuery}`;

  const activitySummaryState = useAxiosFetch(activitySummaryRequestUrl);
  const activityStatusSummaryState = useAxiosFetch(activityStatusSummaryRequestUrl);
  const activityState = useAxiosFetch(activityRequestUrl);
  /**** End get some data ****/

  function updateHistorySearch({
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props })}`;

    history.push({ search: queryStr });
  }

  function handleSelectTeams({ selectedItems }) {
    const teamIds = selectedItems.length > 0 ? selectedItems.map(team => team.id).join() : undefined;
    updateHistorySearch({ ...queryString.parse(location.search), teamIds, workflowIds: undefined });
  }

  function handleSelectWorkflows({ selectedItems }) {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map(worflow => worflow.id).join() : undefined;
    updateHistorySearch({ ...queryString.parse(location.search), workflowIds });
  }

  function handleSelectTriggers({ selectedItems }) {
    const triggers = selectedItems.length > 0 ? selectedItems.map(trigger => trigger.value).join() : undefined;
    updateHistorySearch({ ...queryString.parse(location.search), triggers });
  }

  function handleSelectStatuses(statusIndex) {
    const statuses = statusIndex > 0 ? ACTIVITY_STATUSES_TO_INDEX[statusIndex - 1] : undefined;
    updateHistorySearch({ ...queryString.parse(location.search), statuses });
  }

  function handleSelectDate(dates) {
    console.log(dates);
    let [fromDateObj, toDateObj] = dates;
    const fromDate = moment(fromDateObj).unix();
    const toDate = moment(toDateObj).unix();
    updateHistorySearch({ ...queryString.parse(location.search), fromDate, toDate });
  }

  function getWorkflowFilter(teamsData, selectedTeams) {
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

  if (activityState.error || teamsState.status === REQUEST_STATUSES.FAILURE) {
    return <ErrorDragon />;
  }

  if (teamsState.status === REQUEST_STATUSES.SUCCESS) {
    const { workflowIds = "", triggers = "", statuses = "", teamIds = "" } = queryString.parse(location.search);

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

    const workflowsFilter = getWorkflowFilter(teamsData, selectedTeams);
    const { data: statusSummaryData } = activityStatusSummaryState;
    return (
      <div className={styles.container}>
        <ActivityHeader
          isLoading={activitySummaryState.isLoading}
          failedActivities={activitySummaryState?.data?.failure}
          runActivities={activitySummaryState?.data?.all}
          succeededActivities={activitySummaryState?.data?.completed}
        />
        <main className={styles.content}>
          <nav>
            <Tabs className={styles.tabs} selected={statusIndex + 1} onSelectionChange={handleSelectStatuses}>
              <Tab label={statusSummaryData?.all ? `All (${statusSummaryData.all})` : "All"} />
              <Tab
                label={statusSummaryData?.inProgress ? `In Progress (${statusSummaryData?.inProgress})` : "In Progress"}
              />
              <Tab label={statusSummaryData?.completed ? `Succeeded (${statusSummaryData.completed})` : "Succeeded"} />
              <Tab label={statusSummaryData?.failure ? `Failed (${statusSummaryData.failure})` : "Failed"} />
              <Tab label={statusSummaryData?.invalid ? `Invalid (${statusSummaryData.invalid})` : "Invalid"} />
            </Tabs>
          </nav>
          <section className={styles.filters}>
            <div className={styles.dataFilters}>
              <div style={{ marginRight: "1.4rem", width: "14.125rem" }}>
                <MultiSelect
                  id="activity-teams-select"
                  label="Choose team(s)"
                  placeholder="Choose team(s)"
                  invalid={false}
                  onChange={handleSelectTeams}
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
                  onChange={handleSelectWorkflows}
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
                  onChange={handleSelectTriggers}
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
              onChange={handleSelectDate}
            >
              <DatePickerInput
                autoComplete="off"
                id="activity-date-picker-start"
                labelText="Start date"
                placeholder="mm/dd/yyyy"
                value={moment.unix(fromDate).format("YYYY-MM-DD")}
              />
              <DatePickerInput
                autoComplete="off"
                id="activity-date-picker-end"
                labelText="End date"
                placeholder="mm/dd/yyyy"
                value={moment.unix(toDate).format("YYYY-MM-DD")}
              />
            </DatePicker>
          </section>
          <ActivityTable
            history={history}
            isLoading={activityState.isLoading}
            location={location}
            match={match}
            tableData={activityState.data}
            updateHistorySearch={updateHistorySearch}
          />
        </main>
      </div>
    );
  }
  return null;
}

const mapStateToProps = state => ({
  teamsState: state.teams
});

export default connect(mapStateToProps)(WorkflowActivity);
