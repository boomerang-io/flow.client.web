//@ts-nocheck
import React from "react";
import { useQuery } from "react-query";
import { Switch, Route, Redirect, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import { sortByProp } from "@boomerang-io/utils";
import { DatePicker, DatePickerInput, FilterableMultiSelect, SkeletonPlaceholder } from "@carbon/react";
import {
  ErrorMessage,
  ErrorDragon,
  Loading,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ActionsTable from "./ActionsTable";
import HeaderWidget from "Components/HeaderWidget";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AppPath, appLink, queryStringOptions } from "Config/appConfig";
import { ActionType } from "Constants";
import { approvalStatusOptions } from "Constants/filterOptions";
import { ArrowUpRight } from "@carbon/react/icons";
import styles from "./Actions.module.scss";

const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "creationDate";
const DEFAULT_FROM_DATE = moment(new Date()).subtract("24", "hours").unix();
const DEFAULT_TO_DATE = moment(new Date()).unix();

function Actions() {
  const { activeTeam } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const summaryQuery = queryString.stringify({
    teams: activeTeam?.id,
    fromDate: DEFAULT_FROM_DATE,
    toDate: DEFAULT_TO_DATE,
  });

  const actionsSummaryUrl = serviceUrl.getActionsSummary({ query: summaryQuery });

  /** Define constants */
  const actionType = location.pathname.includes("/manual") ? ActionType.Manual : ActionType.Approval;

  /** Get today's numbers data */
  const actionsSummaryQuery = useQuery({
    queryKey: actionsSummaryUrl,
    queryFn: resolver.query(actionsSummaryUrl),
  });

  /** Organize today's numbers data */
  const { data: actionsData, isLoading: isActionsLoading, isError: isActionsError } = actionsSummaryQuery;

  const approvalsSummaryNumber = actionsData ? actionsData.approvals : 0;
  const manualTasksSummaryNumber = actionsData ? actionsData.manual : 0;

  const approvalsRatePercentage = actionsData ? actionsData.approvalsRate : 0;

  const emoji = approvalsRatePercentage > 79 ? "🙌" : approvalsRatePercentage > 49 ? "😮" : "😨";

  /**
   * Prepare queries and get some data
   */
  const {
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    sort = DEFAULT_SORT,
    workflows,
    statuses,
    fromDate,
    toDate,
  } = queryString.parse(location.search, queryStringOptions);

  const actionsUrlQuery = queryString.stringify(
    {
      order,
      page,
      limit,
      sort,
      statuses,
      teams: activeTeam?.id,
      type: actionType,
      workflows,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const actionsUrlSummaryQuery = queryString.stringify(
    {
      teams: activeTeam?.id,
      workflows,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const actionsFilterSummaryUrl = serviceUrl.getActionsSummary({ query: actionsUrlSummaryQuery });

  /** Get number of approvals and manual tasks */
  const { data: actionsFilterSummaryData } = useQuery({
    queryKey: actionsFilterSummaryUrl,
    queryFn: resolver.query(actionsFilterSummaryUrl),
  });

  const approvalsNumber = actionsFilterSummaryData ? actionsFilterSummaryData.approvals : 0;
  const manualTasksNumber = actionsFilterSummaryData ? actionsFilterSummaryData.manual : 0;

  const actionsUrl = serviceUrl.getActions({ query: actionsUrlQuery });

  /** Get table data */
  const actionsQuery = useQuery({
    queryKey: actionsUrl,
    queryFn: resolver.query(actionsUrl),
  });

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
  if (workflowsIsLoading) {
    return <Loading />;
  }

  if (workflowsIsError) {
    return <ErrorDragon />;
  }

  /**
   * Filters handlers
   */

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

  function handleSelectStatuses({ selectedItems }) {
    const statuses = selectedItems.length > 0 ? selectedItems.map((status) => status.value) : undefined;
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

  if (activeTeam && workflowsData.content) {
    const { workflows = "", statuses = "" } = queryString.parse(location.search, queryStringOptions);
    const selectedWorkflowIds = typeof workflows === "string" ? [workflows] : workflows;
    const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;
    const maxDate = moment().format("MM/DD/YYYY");

    return (
      <div className={styles.container}>
        <Switch>
          <Route exact path={AppPath.ActionsApprovals}>
            <Helmet>
              <title>Approvals - Actions</title>
            </Helmet>
          </Route>
          <Route exact path={AppPath.ActionsManual}>
            <Helmet>
              <title>Manual - Actions</title>
            </Helmet>
          </Route>
          <Redirect exact from={AppPath.Actions} to={AppPath.ActionsApprovals} />
        </Switch>
        <Header
          className={styles.header}
          includeBorder={false}
          header={
            <>
              <HeaderTitle className={styles.headerTitle}>Actions</HeaderTitle>
              <HeaderSubtitle>View and manage your approvals and manual tasks.</HeaderSubtitle>
            </>
          }
          actions={
            <section className={styles.headerSummary}>
              {isActionsLoading ? (
                <SkeletonPlaceholder className={styles.headerSummarySkeleton} />
              ) : (
                <>
                  <p className={styles.headerSummaryText}>Today's numbers</p>
                  {isActionsError ? (
                    <>
                      <HeaderWidget text="Manual" value="--" />
                      <HeaderWidget text="Approvals" value="--" />
                      <HeaderWidget text="Approval rate" value="--" />
                    </>
                  ) : (
                    <>
                      <HeaderWidget icon={ArrowUpRight} text="Manual" value={manualTasksSummaryNumber} />
                      <HeaderWidget icon={ArrowUpRight} text="Approvals" value={approvalsSummaryNumber} />
                      <HeaderWidget icon={emoji} text="Approval rate" value={`${approvalsRatePercentage}%`} />
                    </>
                  )}
                </>
              )}
            </section>
          }
          footer={
            <Tabs ariaLabel="Action types">
              <Tab
                exact
                label={`Approvals (${approvalsNumber})`}
                to={{
                  pathname: appLink.actionsApprovals({ teamId: activeTeam.id }),
                  search: location.search,
                }}
              />
              <Tab
                exact
                label={`Manual (${manualTasksNumber})`}
                to={{
                  pathname: appLink.actionsManual({ teamId: activeTeam.id }),
                  search: location.search,
                }}
              />
            </Tabs>
          }
        />
        {actionsQuery.isError ? (
          <section aria-label="Actions" className={styles.content}>
            <ErrorMessage />
          </section>
        ) : (
          <section aria-label="Actions" className={styles.content}>
            <div className={styles.filtersContainer}>
              <div className={styles.dataFilters}>
                <div className={styles.dataFilter}>
                  <FilterableMultiSelect
                    id="actions-workflows-select"
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
                    id="actions-statuses-select"
                    label="Choose status(es)"
                    placeholder="Choose status(es)"
                    invalid={false}
                    onChange={handleSelectStatuses}
                    items={approvalStatusOptions}
                    itemToString={(item) => (item ? item.label : "")}
                    initialSelectedItems={approvalStatusOptions.filter((option) =>
                      Boolean(selectedStatuses.find((status) => status === option.value))
                    )}
                    titleText="Filter by status"
                  />
                </div>
              </div>
              <DatePicker
                id="actions-date-picker"
                className={styles.timeFilters}
                datePickerType="range"
                maxDate={maxDate}
                onChange={handleSelectDate}
                onClose={handleCloseSelectDate}
              >
                <DatePickerInput
                  autoComplete="off"
                  id="actions-date-picker-start"
                  labelText="Start date"
                  placeholder="mm/dd/yyyy"
                  value={fromDate && moment.unix(fromDate).format("MM/DD/YYYY")}
                />
                <DatePickerInput
                  autoComplete="off"
                  id="actions-date-picker-end"
                  labelText="End date"
                  placeholder="mm/dd/yyyy"
                  value={toDate && moment.unix(toDate).format("MM/DD/YYYY")}
                />
              </DatePicker>
            </div>
            <ActionsTable
              actionsQueryToRefetch={actionsUrl}
              history={history}
              isLoading={actionsQuery.isLoading}
              location={location}
              match={match}
              tableData={actionsQuery.data}
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

export default Actions;
