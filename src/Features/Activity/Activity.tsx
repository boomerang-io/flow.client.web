//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { useAppContext, useQuery } from "Hooks";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Error, Loading, MultiSelect as Select, Tabs, Tab } from "@boomerang-io/carbon-addons-boomerang-react";
import { DatePicker, DatePickerInput } from "carbon-components-react";
import ActivityHeader from "./ActivityHeader";
import ActivityTable from "./ActivityTable";
import moment from "moment";
import queryString from "query-string";
import { sortByProp } from "@boomerang-io/utils";
import ErrorDragon from "Components/ErrorDragon";
import { queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { executionStatusList, QueryStatus, allowedUserRoles } from "Constants";
import { executionOptions } from "Constants/filterOptions";
import styles from "./Activity.module.scss";

const MultiSelect = Select.Filterable;
const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "creationDate";

// Defined outside function so only run once
const activitySummaryQuery = queryString.stringify({
  fromDate: moment(new Date()).subtract("24", "hours").unix(),
  toDate: moment(new Date()).unix(),
});

function WorkflowActivity() {
  const { teams: teamsState, user } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const { type: platformRole }: { type: string } = user;
  const systemWorkflowsEnabled = allowedUserRoles.includes(platformRole);

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
    toDate,
  } = queryString.parse(location.search, queryStringOptions);

  /**** Start get some data ****/
  const activityQuery = queryString.stringify(
    {
      order,
      page,
      size,
      sort,
      statuses,
      teamIds,
      triggers,
      workflowIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const activityStatusSummaryQuery = queryString.stringify(
    {
      teamIds,
      triggers,
      workflowIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const activitySummaryUrl = serviceUrl.getActivitySummary({ query: activitySummaryQuery });
  const activityStatusSummaryUrl = serviceUrl.getActivitySummary({ query: activityStatusSummaryQuery });
  const activityUrl = serviceUrl.getActivity({ query: activityQuery });

  const activitySummaryState = useQuery(activitySummaryUrl);
  const activityStatusSummaryState = useQuery(activityStatusSummaryUrl);
  const activityState = useQuery(activityUrl);

  const systemUrl = serviceUrl.getSystemWorkflows();

  const {
    data: systemWorkflowsData,
    isLoading: systemWorkflowsIsLoading,
    error: SystemWorkflowsError,
  } = useQuery(systemUrl, resolver.query(systemUrl), { enabled: systemWorkflowsEnabled });

  if (systemWorkflowsIsLoading) {
    return <Loading />;
  }

  if (SystemWorkflowsError) {
    return <ErrorDragon />;
  }

  /**** End get some data ****/

  /** Start input handlers */

  /**
   * Function that updates url search history to persist state
   * @param {object} query - all of the query params
   *
   */
  const updateHistorySearch = ({
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) => {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  };

  function handleSelectTeams({ selectedItems }) {
    const teamIds = selectedItems.length > 0 ? selectedItems.map((team) => team.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      teamIds,
      workflowIds: undefined,
      page: 0,
    });
    return;
  }

  function handleSelectWorkflows({ selectedItems }) {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map((worflow) => worflow.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      workflowIds: workflowIds,
      page: 0,
    });
    return;
  }

  function handleSelectTriggers({ selectedItems }) {
    const triggers = selectedItems.length > 0 ? selectedItems.map((trigger) => trigger.value) : undefined;
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), triggers: triggers, page: 0 });
    return;
  }

  function handleSelectStatuses(statusIndex) {
    const statuses = statusIndex > 0 ? executionStatusList[statusIndex - 1] : undefined;
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), statuses: statuses, page: 0 });
    return;
  }

  function handleSelectDate(dates) {
    let [fromDateObj, toDateObj] = dates;
    const fromDate = moment(fromDateObj).unix();
    const toDate = moment(toDateObj).unix();
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), fromDate, toDate, page: 0 });
    return;
  }

  function getWorkflowFilter(teamsData, selectedTeams, systemWorkflowsData = []) {
    let workflowsList = [];
    if (!selectedTeams.length && teamsData) {
      workflowsList = teamsData.reduce((acc, team) => {
        acc.push(...team.workflows);
        return acc;
      }, []);
    } else if (selectedTeams) {
      workflowsList = selectedTeams.reduce((acc, team) => {
        acc.push(...team.workflows);
        return acc;
      }, []);
    }
    let concatWorkflows = workflowsList.concat(systemWorkflowsData);
    let workflowsFilter = sortByProp(concatWorkflows, "name", "ASC");
    return workflowsFilter;
  }

  /** End input handlers */

  /** Start Render Logic */

  if (activityState.error) {
    return (
      <div className={styles.container}>
        <ActivityHeader
          failedActivities={"--"}
          inProgressActivities={"--"}
          isError={true}
          isLoading={false}
          runActivities={"--"}
          succeededActivities={"--"}
        />
        <section aria-label="Activity Error" className={styles.content}>
          <Error />
        </section>
      </div>
    );
  }

  if (teamsState || systemWorkflowsData) {
    const { workflowIds = "", triggers = "", statuses = "", teamIds = "" } = queryString.parse(
      location.search,
      queryStringOptions
    );

    const selectedTeamIds = typeof teamIds === "string" ? [teamIds] : teamIds;
    const selectedWorkflowIds = typeof workflowIds === "string" ? [workflowIds] : workflowIds;
    const selectedTriggers = typeof triggers === "string" ? [triggers] : triggers;
    const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;
    const statusIndex = executionStatusList.indexOf(selectedStatuses[0]);

    const teamsData = teamsState && JSON.parse(JSON.stringify(teamsState));

    const selectedTeams =
      teamsState &&
      teamsData.filter((team) => {
        if (selectedTeamIds.find((id) => id === team.id)) {
          return true;
        } else {
          return false;
        }
      });

    const workflowsFilter = getWorkflowFilter(teamsData, selectedTeams, systemWorkflowsData);
    const { data: statusWorkflowSummary, status: statusSummaryStatus } = activityStatusSummaryState;
    const maxDate = moment().format("MM/DD/YYYY");

    const statusWorkflowSummaryIsLoading = statusSummaryStatus === QueryStatus.Loading;

    return (
      <div className={styles.container}>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ActivityHeader
          inProgressActivities={activitySummaryState.data?.inProgress ?? 0}
          isLoading={activitySummaryState.status === QueryStatus.Loading}
          failedActivities={activitySummaryState.data?.failure ?? 0}
          runActivities={activitySummaryState.data?.all ?? 0}
          succeededActivities={activitySummaryState.data?.completed ?? 0}
        />
        <section aria-label="Activity" className={styles.content}>
          <nav>
            <Tabs className={styles.tabs} selected={statusIndex + 1} onSelectionChange={handleSelectStatuses}>
              <Tab label={statusWorkflowSummaryIsLoading ? "All" : `All (${statusWorkflowSummary.all})`} />
              <Tab
                label={
                  statusWorkflowSummaryIsLoading ? "In Progress" : `In Progress (${statusWorkflowSummary?.inProgress})`
                }
              />
              <Tab
                label={statusWorkflowSummaryIsLoading ? "Succeeded" : `Succeeded (${statusWorkflowSummary.completed})`}
              />
              <Tab label={statusWorkflowSummaryIsLoading ? "Failed" : `Failed (${statusWorkflowSummary.failure})`} />
              <Tab label={statusWorkflowSummaryIsLoading ? "Invalid" : `Invalid (${statusWorkflowSummary.invalid})`} />
              <Tab label={statusWorkflowSummaryIsLoading ? "Waiting" : `Waiting (${statusWorkflowSummary.waiting})`} />
            </Tabs>
          </nav>
          <div className={styles.filtersContainer}>
            <div className={styles.dataFilters}>
              <div className={styles.dataFilter}>
                <MultiSelect
                  id="activity-teams-select"
                  label="Choose team(s)"
                  placeholder="Choose team(s)"
                  invalid={false}
                  onChange={handleSelectTeams}
                  items={teamsData}
                  itemToString={(team) => (team ? team.name : "")}
                  initialSelectedItems={selectedTeams}
                  titleText="Filter by team"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  id="activity-workflows-select"
                  label="Choose workflow(s)"
                  placeholder="Choose workflow(s)"
                  invalid={false}
                  onChange={handleSelectWorkflows}
                  items={workflowsFilter}
                  itemToString={(workflow) => {
                    const team = workflow ? teamsData.find((team) => team.id === workflow.flowTeamId) : undefined;
                    return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                  }}
                  initialSelectedItems={workflowsFilter.filter((workflow) => {
                    if (selectedWorkflowIds.find((id) => id === workflow.id)) {
                      return true;
                    } else {
                      return false;
                    }
                  })}
                  titleText="Filter by workflow"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  id="activity-triggers-select"
                  label="Choose trigger type(s)"
                  placeholder="Choose trigger type(s)"
                  invalid={false}
                  onChange={handleSelectTriggers}
                  items={executionOptions}
                  itemToString={(item) => (item ? item.value : "")}
                  initialSelectedItems={executionOptions.filter((option) => {
                    if (selectedTriggers.find((trigger) => trigger === option.value)) {
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
              maxDate={maxDate}
              onChange={handleSelectDate}
            >
              <DatePickerInput
                autoComplete="off"
                id="activity-date-picker-start"
                labelText="Start date"
                placeholder="mm/dd/yyyy"
                value={fromDate && moment.unix(fromDate).format("YYYY-MM-DD")}
              />
              <DatePickerInput
                autoComplete="off"
                id="activity-date-picker-end"
                labelText="End date"
                placeholder="mm/dd/yyyy"
                value={toDate && moment.unix(toDate).format("YYYY-MM-DD")}
              />
            </DatePicker>
          </div>
          <ActivityTable
            history={history}
            isLoading={activityState.status === QueryStatus.Loading}
            location={location}
            match={match}
            systemWorkflowsEnabled={systemWorkflowsEnabled}
            tableData={activityState.data}
            updateHistorySearch={updateHistorySearch}
          />
        </section>
      </div>
    );
  }
  return null;
}

export default WorkflowActivity;
