//@ts-nocheck
import React from "react";
import { Helmet } from "react-helmet";
import { useAppContext, useQuery } from "Hooks";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Error, Loading, ErrorMessage, FeatureNavTabs as Tabs } from "@boomerang-io/carbon-addons-boomerang-react";
import { DatePicker, DatePickerInput, FilterableMultiSelect } from "@carbon/react";
import ActivityHeader from "./ActivityHeader";
import ActivityTable from "./ActivityTable";
import Tab from "./Tab";
import moment from "moment";
import queryString from "query-string";
import { sortByProp } from "@boomerang-io/utils";
import ErrorDragon from "Components/ErrorDragon";
import { queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { executionStatusList, QueryStatus } from "Constants";
import { executionOptions } from "Constants/filterOptions";
import styles from "./Activity.module.scss";

const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "creationDate";
const DEFAULT_FROM_DATE = moment().startOf("month").unix();
const DEFAULT_TO_DATE = moment().endOf("month").unix();

function WorkflowActivity() {
  const { activeTeam } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  //TODO - this was defined outside so as to only run once but now needs the teamId - how do we make it only run once?
  const activitySummaryQuery = queryString.stringify({
    fromDate: DEFAULT_FROM_DATE,
    toDate: DEFAULT_TO_DATE,
    teams: activeTeam?.id,
  });

  const {
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    sort = DEFAULT_SORT,
    workflows,
    triggers,
    statuses,
    fromDate,
    toDate,
  } = queryString.parse(location.search, queryStringOptions);

  /** Retrieve Workflows */
  const getWorkflowsUrl = serviceUrl.getWorkflows({ query: `teams=${activeTeam?.id}` });
  const {
    data: workflowsData,
    isLoading: workflowsIsLoading,
    isError: workflowsIsError,
  } = useQuery<PaginatedWorkflowResponse, string>({
    queryKey: getWorkflowsUrl,
    queryFn: resolver.query(getWorkflowsUrl),
  });

  /**** Start get some data ****/

  const wfRunsURLQuery = queryString.stringify(
    {
      order,
      page,
      limit,
      sort,
      statuses,
      teams: activeTeam?.id,
      triggers,
      workflows,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const wfRunStatusSummaryURLQuery = queryString.stringify(
    {
      teams: activeTeam?.id,
      triggers,
      workflows,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const wfRunSummaryUrl = serviceUrl.getWorkflowRunCount({ query: activitySummaryQuery });
  const wfRunStatusSummaryUrl = serviceUrl.getWorkflowRunCount({ query: wfRunStatusSummaryURLQuery });
  const wfRunUrl = serviceUrl.getWorkflowRuns({ query: wfRunsURLQuery });

  const wfRunSummaryQuery = useQuery(wfRunSummaryUrl);
  const wfRunStatusSummaryQuery = useQuery(wfRunStatusSummaryUrl);
  const wfRunQuery = useQuery({
    queryKey: wfRunUrl,
    queryFn: resolver.query(wfRunUrl),
  });

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
    limit = DEFAULT_LIMIT,
    sort = DEFAULT_SORT,
    ...props
  }) => {
    const queryStr = `?${queryString.stringify({ order, page, limit, sort, ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  };

  function handleSelectWorkflows({ selectedItems }) {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map((worflow) => worflow.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      workflows: workflowIds,
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
    const {
      order = DEFAULT_ORDER,
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      sort = DEFAULT_SORT,
      ...props
    } = queryString.parse(location.search);
    const query = queryString.stringify({ order, page, limit, sort, ...props, statuses }, queryStringOptions);
    return `?${query}`;
  }

  // function handleSelectStatuses(statusIndex) {
  //   const statuses = statusIndex > 0 ? executionStatusList[statusIndex - 1] : undefined;
  //   updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), statuses: statuses, page: 0 });
  //   return `?${query}`;
  // }

  function handleSelectDate(dates) {
    let [fromDateObj, toDateObj] = dates;
    const fromDate = moment(fromDateObj).unix();
    const toDate = moment(toDateObj).unix();
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), fromDate, toDate, page: 0 });
    return;
  }

  const handleCloseSelectDate = (dates) => {
    let [fromDateObj, toDateObj] = dates;
    const selectedFromDate = moment(fromDateObj).unix();
    const selectedToDate = moment(toDateObj).unix();
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      fromDate: selectedFromDate === selectedToDate ? fromDate : selectedFromDate,
      toDate: selectedToDate,
      page: 0,
    });
    return;
  };

  function getWorkflowFilter() {
    let workflowsList = [];
    if (workflowsData.content) {
      workflowsList = workflowsData.content;
    }
    return sortByProp(workflowsList, "name", "ASC");
  }
  /** End input handlers */

  /** Start Render Logic */
  if (wfRunQuery.error || workflowsIsError) {
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

  if (activeTeam && workflowsData) {
    const { workflows = "", triggers = "", statuses = "" } = queryString.parse(location.search, queryStringOptions);
    const selectedWorkflowIds = typeof workflows === "string" ? [workflows] : workflows;
    const selectedTriggers = typeof triggers === "string" ? [triggers] : triggers;
    const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;
    const statusIndex = executionStatusList.indexOf(selectedStatuses[0]) + 1;
    // const statusIndex = executionStatusList.indexOf(selectedStatuses[0]);

    const { data: statusWorkflowSummary, status: statusSummaryStatus } = wfRunStatusSummaryQuery;
    const maxDate = moment().format("MM/DD/YYYY");

    const statusWorkflowSummaryIsLoading = statusSummaryStatus === QueryStatus.Loading;

    return (
      <div className={styles.container}>
        <Helmet>
          <title>Activity</title>
        </Helmet>
        <ActivityHeader
          inProgressActivities={wfRunSummaryQuery.data?.inProgress ?? 0}
          isLoading={wfRunSummaryQuery.status === QueryStatus.Loading}
          failedActivities={wfRunSummaryQuery.data?.failure ?? 0}
          runActivities={wfRunSummaryQuery.data?.all ?? 0}
          succeededActivities={wfRunSummaryQuery.data?.completed ?? 0}
        />
        {wfRunQuery.isError ? (
          <section aria-label="Activity" className={styles.content}>
            <ErrorMessage />
          </section>
        ) : (
          <section aria-label="Activity" className={styles.content}>
            <nav>
              <Tabs className={styles.tabs}>
                <Tab
                  to={() => handleSelectStatuses(0)}
                  label={statusWorkflowSummaryIsLoading ? "All" : `All (${statusWorkflowSummary.status.all})`}
                  isActive={statusIndex === 0}
                />
                <Tab
                  to={() => handleSelectStatuses(1)}
                  label={statusWorkflowSummaryIsLoading ? "Queued" : `Queued (${statusWorkflowSummary?.status.ready})`}
                  isActive={statusIndex === 1}
                />
                <Tab
                  to={() => handleSelectStatuses(2)}
                  label={
                    statusWorkflowSummaryIsLoading
                      ? "In Progress"
                      : `In Progress (${statusWorkflowSummary?.status.running})`
                  }
                  isActive={statusIndex === 2}
                />
                <Tab
                  to={() => handleSelectStatuses(3)}
                  label={
                    statusWorkflowSummaryIsLoading
                      ? "Succeeded"
                      : `Succeeded (${statusWorkflowSummary.status.succeeded})`
                  }
                  isActive={statusIndex === 3}
                />
                <Tab
                  to={() => handleSelectStatuses(4)}
                  label={statusWorkflowSummaryIsLoading ? "Failed" : `Failed (${statusWorkflowSummary.status.failed})`}
                  isActive={statusIndex === 4}
                />
                <Tab
                  to={() => handleSelectStatuses(5)}
                  label={
                    statusWorkflowSummaryIsLoading ? "Invalid" : `Invalid (${statusWorkflowSummary.status.invalid})`
                  }
                  isActive={statusIndex === 5}
                />
                <Tab
                  to={() => handleSelectStatuses(6)}
                  label={
                    statusWorkflowSummaryIsLoading ? "Waiting" : `Waiting (${statusWorkflowSummary.status.waiting})`
                  }
                  isActive={statusIndex === 6}
                />
                <Tab
                  to={() => handleSelectStatuses(7)}
                  label={
                    statusWorkflowSummaryIsLoading
                      ? "Cancelled"
                      : `Cancelled (${statusWorkflowSummary.status.cancelled})`
                  }
                  isActive={statusIndex === 7}
                />
              </Tabs>
            </nav>
            <div className={styles.filtersContainer}>
              <div className={styles.dataFilters}>
                <div className={styles.dataFilter}>
                  <FilterableMultiSelect
                    id="activity-workflows-select"
                    label="Choose workflow(s)"
                    placeholder="Choose workflow(s)"
                    invalid={false}
                    onChange={handleSelectWorkflows}
                    items={getWorkflowFilter()}
                    itemToString={(workflow) => {
                      return workflow.name;
                    }}
                    initialSelectedItems={getWorkflowFilter().filter((workflow) =>
                      Boolean(selectedWorkflowIds.find((id) => id === workflow.id))
                    )}
                    titleText="Filter by Workflow"
                  />
                </div>
                <div className={styles.dataFilter}>
                  <FilterableMultiSelect
                    id="activity-triggers-select"
                    label="Choose trigger type(s)"
                    placeholder="Choose trigger type(s)"
                    invalid={false}
                    onChange={handleSelectTriggers}
                    items={executionOptions}
                    itemToString={(item) => (item ? item.label : "")}
                    initialSelectedItems={executionOptions.filter((option) =>
                      Boolean(selectedTriggers.find((trigger) => trigger === option.value))
                    )}
                    titleText="Filter by trigger"
                  />
                </div>
              </div>
              <DatePicker
                id="activity-date-picker"
                className={styles.timeFilters}
                datePickerType="range"
                maxDate={maxDate}
                onChange={handleSelectDate}
                onClose={handleCloseSelectDate}
              >
                <DatePickerInput
                  autoComplete="off"
                  id="activity-date-picker-start"
                  labelText="Start date"
                  placeholder="mm/dd/yyyy"
                  value={fromDate && moment.unix(fromDate).format("MM/DD/YYYY")}
                />
                <DatePickerInput
                  autoComplete="off"
                  id="activity-date-picker-end"
                  labelText="End date"
                  placeholder="mm/dd/yyyy"
                  value={toDate && moment.unix(toDate).format("MM/DD/YYYY")}
                />
              </DatePicker>
            </div>
            <ActivityTable
              history={history}
              isLoading={wfRunQuery.isLoading}
              location={location}
              match={match}
              tableData={wfRunQuery.data}
              sort={sort}
              order={order}
              updateHistorySearch={updateHistorySearch}
            />
          </section>
        )}
      </div>
    );
  }
  return null;
}

export default WorkflowActivity;
