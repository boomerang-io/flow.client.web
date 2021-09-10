//@ts-nocheck
import React from "react";
import { useQuery } from "react-query";
import { Switch, Route, Redirect, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import { useAppContext } from "Hooks";
import { sortByProp } from "@boomerang-io/utils";
import {
  DatePicker,
  DatePickerInput,
  ErrorMessage,
  ErrorDragon,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureNavTab as Tab,
  FeatureNavTabs as Tabs,
  Loading,
  MultiSelect as Select,
  SkeletonPlaceholder,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ActionsTable from "./ActionsTable";
import HeaderWidget from "Components/HeaderWidget";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { AppPath, appLink, queryStringOptions } from "Config/appConfig";
import { allowedUserRoles, ActionType, WorkflowScope } from "Constants";
import { approvalStatusOptions } from "Constants/filterOptions";
import { ArrowUpRight32 } from "@carbon/icons-react";
import styles from "./Actions.module.scss";

const MultiSelect = Select.Filterable;
const DEFAULT_ORDER = "DESC";
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT = "creationDate";

const summaryQuery = queryString.stringify({
  fromDate: moment(new Date()).subtract("24", "hours").unix(),
  toDate: moment(new Date()).unix(),
});

const actionsSummaryUrl = serviceUrl.getActionsSummary({ query: summaryQuery });
const actionsAllTimeSummaryUrl = serviceUrl.getActionsSummary({ query: undefined });
const systemUrl = serviceUrl.getSystemWorkflows();
const userWorkflowsUrl = serviceUrl.getUserWorkflows();

function Actions() {
  const { teams, user } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  /** Define constants */
  const isSystemWorkflowsEnabled = allowedUserRoles.includes(user.type);
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

  /** Get number of approvals and manual tasks */
  const { data: actionsAllTimeSummaryData } = useQuery({
    queryKey: actionsAllTimeSummaryUrl,
    queryFn: resolver.query(actionsAllTimeSummaryUrl),
  });

  const approvalsNumber = actionsAllTimeSummaryData ? actionsAllTimeSummaryData.approvals : 0;
  const manualTasksNumber = actionsAllTimeSummaryData ? actionsAllTimeSummaryData.manual : 0;

  /**
   * Prepare queries and get some data
   */
   const {
    order = DEFAULT_ORDER,
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    scopes,
    workflowIds,
    statuses,
    teamIds,
    fromDate,
    toDate,
  } = queryString.parse(location.search, queryStringOptions);

  const actionsUrlQuery = queryString.stringify(
    {
      order,
      page,
      size,
      sort,
      scopes,
      statuses,
      teamIds,
      type: actionType,
      workflowIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const actionsUrl = serviceUrl.getActions({ query: actionsUrlQuery });

  const actionsQuery = useQuery({
    queryKey: actionsUrl,
    queryFn: resolver.query(actionsUrl)
  });

  const {
    data: systemWorkflowsData,
    isLoading: systemWorkflowsIsLoading,
    error: SystemWorkflowsError,
  } = useQuery({
    queryKey: systemUrl, 
    queryFn: resolver.query(systemUrl), 
    config: { enabled: isSystemWorkflowsEnabled }
  });

  const { data: userWorkflowsData, isLoading: userWorkflowsIsLoading, isError: userWorkflowsIsError } = useQuery({
    queryKey: userWorkflowsUrl,
    queryFn: resolver.query(userWorkflowsUrl)
  });

  if (systemWorkflowsIsLoading || userWorkflowsIsLoading) {
    return <Loading />;
  }

  if (SystemWorkflowsError || userWorkflowsIsError) {
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
    size = DEFAULT_SIZE,
    sort = DEFAULT_SORT,
    ...props
  }) => {
    const queryStr = `?${queryString.stringify({ order, page, size, sort, ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  };

  function handleSelectScopes({ selectedItems }) {
    const scopes = selectedItems.length > 0 ? selectedItems.map((scope) => scope.value) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      scopes: scopes,
      teamIds: undefined,
      workflowIds: undefined,
      page: 0,
    });
    return;
  }

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

  function getWorkflowFilter({ teamsData, selectedTeams, systemWorkflowsData = [], userWorkflowsData = [] }) {
    let workflowsList = [];
    if (!scopes || scopes?.includes(WorkflowScope.Team)) {
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
    }
    if ((!scopes || scopes?.includes(WorkflowScope.System)) && isSystemWorkflowsEnabled) {
      workflowsList = workflowsList.concat(systemWorkflowsData);
    }
    if (!scopes || scopes?.includes(WorkflowScope.User)) {
      workflowsList = workflowsList.concat(userWorkflowsData);
    }
    let workflowsFilter = sortByProp(workflowsList, "name", "ASC");
    return workflowsFilter;
  }

  if (teams || systemWorkflowsData || userWorkflowsData) {
    const { workflowIds = "", scopes = "", statuses = "", teamIds = "" } = queryString.parse(
      location.search,
      queryStringOptions
    );

    const selectedScopes = typeof scopes === "string" ? [scopes] : scopes;
    const selectedTeamIds = typeof teamIds === "string" ? [teamIds] : teamIds;
    const selectedWorkflowIds = typeof workflowIds === "string" ? [workflowIds] : workflowIds;
    const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;

    const teamsData = teams && JSON.parse(JSON.stringify(teams));

    const selectedTeams =
      teams &&
      teamsData.filter((team) => {
        if (selectedTeamIds.find((id) => id === team.id)) {
          return true;
        } else {
          return false;
        }
      });

    const workflowsFilter = getWorkflowFilter({
      teamsData,
      selectedTeams,
      systemWorkflowsData,
      userWorkflowsData: userWorkflowsData?.workflows,
    });
    const maxDate = moment().format("MM/DD/YYYY");

    const workflowScopeOptions = [
      { label: "User", value: WorkflowScope.User },
      { label: "Team", value: WorkflowScope.Team },
    ];

    if (isSystemWorkflowsEnabled) workflowScopeOptions.push({ label: "System", value: WorkflowScope.System });

    return (
      <div className={styles.container}>
        <Switch>
          <Route exact path={AppPath.ActionsApprovals}>
            <Helmet>
              <title>Actions - Approvals</title>
            </Helmet>
          </Route>
          <Route exact path={AppPath.ActionsManual}>
            <Helmet>
              <title>Actions - Manual Tasks</title>
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
                        <HeaderWidget icon={ArrowUpRight32} text="Manual" value={manualTasksSummaryNumber} />
                        <HeaderWidget icon={ArrowUpRight32} text="Approvals" value={approvalsSummaryNumber} />
                        <HeaderWidget icon={emoji} text="Approval rate" value={`${approvalsRatePercentage}%`} />
                      </>
                    )}
                  </>
                )}
              </section>
            }
            footer={
              <Tabs>
                <Tab 
                  exact 
                  label={`Approvals (${approvalsNumber})`} 
                  to={{ 
                    pathname: appLink.actionsApprovals(),
                    search: location.search
                  }}
                />
                <Tab 
                  exact 
                  label={`Manual (${manualTasksNumber})`} 
                  to={{ 
                    pathname: appLink.actionsManual(),
                    search: location.search
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
                    <MultiSelect
                      id="actions-scopes-select"
                      label="Choose scope(s)"
                      placeholder="Choose scope(s)"
                      invalid={false}
                      onChange={handleSelectScopes}
                      items={workflowScopeOptions}
                      itemToString={(scope) => (scope ? scope.label : "")}
                      initialSelectedItems={workflowScopeOptions.filter((option) =>
                        Boolean(selectedScopes.find((scope) => scope === option.value))
                      )}
                      titleText="Filter by scope"
                    />
                  </div>
                  {(!scopes || scopes?.includes(WorkflowScope.Team)) && (
                    <div className={styles.dataFilter}>
                      <MultiSelect
                        id="actions-teams-select"
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
                  )}
                  <div className={styles.dataFilter}>
                    <MultiSelect
                      id="actions-workflows-select"
                      label="Choose workflow(s)"
                      placeholder="Choose workflow(s)"
                      invalid={false}
                      onChange={handleSelectWorkflows}
                      items={workflowsFilter}
                      itemToString={(workflow) => {
                        const team = workflow ? teamsData.find((team) => team.id === workflow.flowTeamId) : undefined;
                        return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                      }}
                      initialSelectedItems={workflowsFilter.filter((workflow) =>
                        Boolean(selectedWorkflowIds.find((id) => id === workflow.id))
                      )}
                      titleText="Filter by workflow"
                    />
                  </div>
                  <div className={styles.dataFilter}>
                    <MultiSelect
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
                  dateFormat="m/d/Y"
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
                    value={fromDate && moment.unix(fromDate).format("YYYY-MM-DD")}
                  />
                  <DatePickerInput
                    autoComplete="off"
                    id="actions-date-picker-end"
                    labelText="End date"
                    placeholder="mm/dd/yyyy"
                    value={toDate && moment.unix(toDate).format("YYYY-MM-DD")}
                  />
                </DatePicker>
              </div>
              <ActionsTable
                actionsQueryToRefetch={actionsUrl}
                history={history}
                isLoading={actionsQuery.isLoading}
                location={location}
                match={match}
                isSystemWorkflowsEnabled={isSystemWorkflowsEnabled}
                tableData={actionsQuery.data}
                updateHistorySearch={updateHistorySearch}
              />
            </section>
          )}
      </div>
    )
  }

  return null;
}

export default Actions;