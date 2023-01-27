import React from "react";
import { Helmet } from "react-helmet";
import cx from "classnames";
import moment from "moment";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { DatePicker, DatePickerInput, FilterableMultiSelect, SkeletonPlaceholder } from "@carbon/react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { useAppContext } from "Hooks";
import { useQuery } from "react-query";
import { sortByProp } from "@boomerang-io/utils";
import ErrorDragon from "Components/ErrorDragon";
import ChartsTile from "./ChartsTile";
import InsightsTile from "./InsightsTile";
import CarbonDonutChart from "./CarbonDonutChart";
import CarbonLineChart from "./CarbonLineChart";
import CarbonScatterChart from "./CarbonScatterChart";
import { elevatedUserRoles, WorkflowScope } from "Constants";
import { executionOptions, statusOptions } from "Constants/filterOptions";
import { parseChartsData } from "./utils/formatData";
import { queryStringOptions } from "Config/appConfig";
import { timeSecondsToTimeUnit } from "Utils/timeSecondsToTimeUnit";
import type { ExecutionStatus, FlowTeam, MultiSelectItem, MultiSelectItems, WorkflowSummary } from "Types";
import styles from "./workflowInsights.module.scss";

export interface InsightsExecution {
  activityId: string;
  creationDate: string;
  duration: number;
  status: ExecutionStatus;
  teamName: string;
  workflowId: string;
  workflowName: string;
}
interface WorkflowInsightsRes {
  medianExecutionTime: number;
  totalActivitiesExecuted: number;
  executions: Array<InsightsExecution>;
}

const systemWorkflowsUrl = serviceUrl.getSystemWorkflows();
const now = moment();
const maxDate = now.format("MM/DD/YYYY");
const defaultFromDate = now.subtract(3, "months").valueOf();
const defaultToDate = moment().endOf("day").valueOf();

export default function Insights() {
  const { user } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const isSystemWorkflowsEnabled = elevatedUserRoles.includes(user.type);

  /**
   * Get system workflow data
   */
  const systemWorkflowsQuery = useQuery<Array<WorkflowSummary>, string>({
    queryKey: systemWorkflowsUrl,
    queryFn: resolver.query(systemWorkflowsUrl),
    enabled: isSystemWorkflowsEnabled,
  });

  /**
   * Get insights data
   */
  const {
    scopes,
    statuses,
    teamIds,
    triggers,
    workflowIds,
    fromDate = defaultFromDate,
    toDate = defaultToDate,
  } = queryString.parse(location.search, queryStringOptions);

  const insightsSearchParams = queryString.stringify(
    {
      scopes,
      statuses,
      teamIds,
      triggers,
      workflowIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const insightsUrl = serviceUrl.getInsights({ query: insightsSearchParams });
  const insightsQuery = useQuery<WorkflowInsightsRes>({
    queryKey: insightsUrl,
    queryFn: resolver.query(insightsUrl),
  });

  function updateHistorySearch({ ...props }) {
    const queryStr = `?${queryString.stringify({ ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  }

  if (insightsQuery.error) {
    return (
      <InsightsContainer>
        <Selects systemWorkflowsQuery={systemWorkflowsQuery} updateHistorySearch={updateHistorySearch} />
        <ErrorDragon />
      </InsightsContainer>
    );
  }

  if (insightsQuery.isLoading) {
    return (
      <InsightsContainer>
        <Selects systemWorkflowsQuery={systemWorkflowsQuery} updateHistorySearch={updateHistorySearch} />
        <div className={styles.cardPlaceholderContainer}>
          <SkeletonPlaceholder className={styles.cardPlaceholder} />
          <SkeletonPlaceholder className={styles.cardPlaceholder} />
          <SkeletonPlaceholder className={cx(styles.cardPlaceholder, styles.wide)} />
        </div>
        <SkeletonPlaceholder className={styles.graphPlaceholder} />
        <SkeletonPlaceholder className={styles.graphPlaceholder} />
      </InsightsContainer>
    );
  }

  if (insightsQuery.data) {
    return (
      <InsightsContainer>
        <Selects systemWorkflowsQuery={systemWorkflowsQuery} updateHistorySearch={updateHistorySearch} />
        <Graphs data={insightsQuery.data} statuses={statuses as ExecutionStatus | Array<ExecutionStatus> | null} />
      </InsightsContainer>
    );
  }

  return null;
}

function InsightsContainer(props: { children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        <title>Insights</title>
      </Helmet>
      <Header
        includeBorder={false}
        header={
          <>
            <HeaderTitle>Insights</HeaderTitle>
            <HeaderSubtitle>View your Worfklow execution stats</HeaderSubtitle>
          </>
        }
      />
      <div className={styles.container}>{props.children}</div>
    </>
  );
}

interface SelectsProps {
  systemWorkflowsQuery: any;
  updateHistorySearch: any;
}

function Selects(props: SelectsProps) {
  const location = useLocation();
  const { teams, user, userWorkflows } = useAppContext();
  const isSystemWorkflowsEnabled = elevatedUserRoles.includes(user.type);

  const { scopes, statuses, workflowIds, teamIds, triggers, fromDate, toDate } = queryString.parse(
    location.search,
    queryStringOptions
  );

  const selectedScopes = typeof scopes === "string" ? [scopes] : scopes;
  const selectedTeamIds = typeof teamIds === "string" ? [teamIds] : teamIds;
  const selectedWorkflowIds = typeof workflowIds === "string" ? [workflowIds] : workflowIds;
  const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;
  const selectedTriggers = typeof triggers === "string" ? [triggers] : triggers;
  const selectedFromDate = Array.isArray(fromDate)
    ? Number.parseInt(fromDate[0])
    : typeof fromDate === "string"
    ? Number.parseInt(fromDate)
    : defaultFromDate;
  const selectedToDate = Array.isArray(toDate)
    ? Number.parseInt(toDate[0])
    : typeof toDate === "string"
    ? Number.parseInt(toDate)
    : defaultToDate;

  const selectedTeams =
    teams && teams.filter((team: FlowTeam) => selectedTeamIds?.find((id: string) => id === team.id));

  const workflowOptions = getWorkflowOptions({
    isSystemWorkflowsEnabled,
    selectedScopes,
    selectedTeams,
    teams,
    systemWorkflowsData: props.systemWorkflowsQuery.data,
    userWorkflowsData: userWorkflows.workflows,
  });

  const workflowScopeOptions = [
    { label: "User", value: WorkflowScope.User },
    { label: "Team", value: WorkflowScope.Team },
  ];

  if (isSystemWorkflowsEnabled) {
    workflowScopeOptions.push({ label: "System", value: WorkflowScope.System });
  }

  const disableTeamsDropdown = !!scopes && !scopes.includes(WorkflowScope.Team);

  function handleSelectScopes({ selectedItems }: MultiSelectItems) {
    const scopes = selectedItems.length > 0 ? selectedItems.map((scope) => scope.value) : undefined;
    props.updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      scopes: scopes,
      teamIds: undefined,
      workflowIds: undefined,
    });
    return;
  }

  function handleSelectTeams({ selectedItems }: MultiSelectItems<FlowTeam>) {
    const teamIds = selectedItems.length > 0 ? selectedItems.map((team) => team.id) : undefined;
    props.updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      teamIds,
      workflowIds: undefined,
    });
    return;
  }

  function handleSelectWorkflows({ selectedItems }: MultiSelectItems<WorkflowSummary>) {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map((worflow) => worflow.id) : undefined;
    props.updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      workflowIds: workflowIds,
    });
    return;
  }

  function handleSelectStatuses({ selectedItems }: MultiSelectItems) {
    //@ts-ignore next-line
    const statuses = selectedItems.length > 0 ? selectedItems.map((status) => status.value) : undefined;
    props.updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), statuses: statuses });
    return;
  }

  function handleSelectTriggers({ selectedItems }: MultiSelectItems) {
    //@ts-ignore next-line
    const triggers = selectedItems.length > 0 ? selectedItems.map((trigger) => trigger.value) : undefined;
    props.updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), triggers: triggers });
    return;
  }

  function handleSelectDate(dates: any) {
    let [fromDateObj, toDateObj] = dates as [Date, Date];
    if (!toDateObj) {
      return;
    }
    const fromDate = moment(fromDateObj).startOf("day").valueOf();
    const toDate = moment(toDateObj).endOf("day").valueOf();
    props.updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), fromDate, toDate });
    return;
  }

  return (
    <div className={styles.dataFilters}>
      <FilterableMultiSelect
        id="actions-scopes-select"
        label="Choose scope(s)"
        placeholder="Choose scope(s)"
        invalid={false}
        onChange={handleSelectScopes}
        items={workflowScopeOptions}
        itemToString={(scope: MultiSelectItem) => (scope ? scope.label : "")}
        initialSelectedItems={workflowScopeOptions.filter((option) =>
          Boolean(selectedScopes?.find((scope) => scope === option.value))
        )}
        titleText="Filter by scope"
      />
      <FilterableMultiSelect
        disabled={disableTeamsDropdown}
        key={disableTeamsDropdown ? "teams-disabled" : "teams-enabeld"}
        id="insights-teams-select"
        label="Choose team(s)"
        placeholder="Choose team(s)"
        invalid={false}
        onChange={handleSelectTeams}
        items={teams}
        itemToString={(team: FlowTeam) => (team ? team.name : "")}
        initialSelectedItems={selectedTeams}
        titleText="Filter by Team"
      />
      <FilterableMultiSelect
        id="insights-workflows-select"
        label="Choose workflow(s)"
        placeholder="Choose workflow(s)"
        invalid={false}
        onChange={handleSelectWorkflows}
        items={workflowOptions}
        itemToString={(workflow: WorkflowSummary) => {
          if (workflow.scope === "team") {
            const team = workflow ? teams.find((team: FlowTeam) => team.id === workflow.flowTeamId) : undefined;
            if (team) {
              return workflow ? (team ? `${workflow.name} (${team.name})` : workflow.name) : "";
            }
          }
          if (workflow.scope === "system") {
            return `${workflow.name} (System)`;
          }
          return workflow.name;
        }}
        initialSelectedItems={workflowOptions.filter((workflow: WorkflowSummary) =>
          Boolean(selectedWorkflowIds?.find((id) => id === workflow.id))
        )}
        titleText="Filter by Workflow"
      />
      <FilterableMultiSelect
        id="insights-triggers-select"
        label="Choose trigger type(s)"
        placeholder="Choose trigger type(s)"
        invalid={false}
        onChange={handleSelectTriggers}
        items={executionOptions}
        itemToString={(item: MultiSelectItem) => (item ? item.label : "")}
        initialSelectedItems={executionOptions.filter((option) =>
          Boolean(selectedTriggers?.find((trigger: string) => trigger === option.value))
        )}
        titleText="Filter by trigger"
      />
      <FilterableMultiSelect
        id="insights-statuses-select"
        label="Choose status(es)"
        placeholder="Choose status(es)"
        invalid={false}
        onChange={handleSelectStatuses}
        items={statusOptions}
        itemToString={(item: MultiSelectItem) => (item ? item.label : "")}
        initialSelectedItems={statusOptions.filter((option) =>
          Boolean(selectedStatuses?.find((status: string) => status === option.value))
        )}
        titleText="Filter by status"
      />
      <div className={styles.timeFilters}>
        <DatePicker id="insights-date-picker" datePickerType="range" maxDate={maxDate} onChange={handleSelectDate}>
          <DatePickerInput
            autoComplete="off"
            id="insights-date-picker-start"
            labelText="Start date"
            value={moment(selectedFromDate).format("MM/DD/YYYY")}
          />
          <DatePickerInput
            autoComplete="off"
            id="insights-date-picker-end"
            labelText="End date"
            value={moment(selectedToDate).format("MM/DD/YYYY")}
          />
        </DatePicker>
      </div>
    </div>
  );
}

interface GraphsProps {
  data: WorkflowInsightsRes;
  statuses: ExecutionStatus | ExecutionStatus[] | null;
}

function Graphs(props: GraphsProps) {
  const { data, statuses } = props;
  const { donutData, durationData, lineChartData, scatterPlotData, executionsCountList } = React.useMemo(
    () => parseChartsData(data.executions, statuses),
    [data.executions, statuses]
  );

  const totalExecutions = data.totalActivitiesExecuted;
  const medianExecutionTime = Math.round(data.medianExecutionTime / 1000);
  return (
    <>
      <div className={styles.statsWidgets} data-testid="completed-insights">
        <InsightsTile
          title="Executions"
          type="runs"
          totalCount={totalExecutions}
          infoList={executionsCountList.slice(0, 5)}
        />
        <InsightsTile
          title="Duration (median)"
          type=""
          totalCount={timeSecondsToTimeUnit(medianExecutionTime)}
          infoList={durationData}
          valueWidth="7rem"
        />
        <div className={styles.donut}>
          {totalExecutions === 0 ? (
            <p className={`${styles.statsLabel} --no-data`}>No Data</p>
          ) : (
            <CarbonDonutChart data={donutData} title="Status" />
          )}
        </div>
      </div>
      <div className={styles.graphsWidgets}>
        <ChartsTile>
          {totalExecutions === 0 ? (
            <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
          ) : (
            <CarbonLineChart data={lineChartData} title="Executions" />
          )}
        </ChartsTile>
        <ChartsTile>
          {totalExecutions === 0 ? (
            <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
          ) : (
            <CarbonScatterChart data={scatterPlotData} title="Execution Time" />
          )}
        </ChartsTile>
      </div>
    </>
  );
}

interface GetWorkflowOptionsArgs {
  isSystemWorkflowsEnabled: boolean;
  selectedScopes: Array<string> | null;
  selectedTeams: Array<FlowTeam>;
  systemWorkflowsData?: Array<WorkflowSummary>;
  teams: Array<FlowTeam>;
  userWorkflowsData: Array<WorkflowSummary>;
}

function getWorkflowOptions({
  isSystemWorkflowsEnabled,
  teams,
  selectedScopes,
  selectedTeams,
  systemWorkflowsData = [],
  userWorkflowsData = [],
}: GetWorkflowOptionsArgs) {
  let workflowsList: Array<WorkflowSummary> = [];
  if (!selectedScopes || (Array.isArray(selectedScopes) && selectedScopes?.includes(WorkflowScope.Team))) {
    if (selectedTeams.length === 0 && teams) {
      workflowsList = teams.reduce((acc: Array<WorkflowSummary>, team: FlowTeam): Array<WorkflowSummary> => {
        acc.push(...team.workflows);
        return acc;
      }, []);
    } else if (selectedTeams) {
      workflowsList = selectedTeams.reduce((acc: Array<WorkflowSummary>, team: FlowTeam): Array<WorkflowSummary> => {
        acc.push(...team.workflows);
        return acc;
      }, []);
    }
  }
  if ((!selectedScopes || selectedScopes?.includes(WorkflowScope.System)) && isSystemWorkflowsEnabled) {
    workflowsList.push(...systemWorkflowsData);
  }
  if (!selectedScopes || selectedScopes?.includes(WorkflowScope.User)) {
    workflowsList.push(...userWorkflowsData);
  }
  let workflowsFilter = sortByProp(workflowsList, "name", "ASC");
  return workflowsFilter;
}
