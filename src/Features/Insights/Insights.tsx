import React from "react";
import { Helmet } from "react-helmet";
import cx from "classnames";
import moment from "moment";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { serviceUrl, resolver } from "Config/servicesConfig";
import {
  ComboBox,
  SkeletonPlaceholder,
  MultiSelect as Select,
  FeatureHeader as Header,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureHeaderTitle as HeaderTitle,
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
import { executionStatusList, elevatedUserRoles, WorkflowScope } from "Constants";
import { executionOptions, statusOptions, timeframeOptions } from "Constants/filterOptions";
import { parseChartsData } from "./chartHelper";
import { queryStringOptions } from "Config/appConfig";
import { timeSecondsToTimeUnit } from "Utils/timeSecondsToTimeUnit";
import type { FlowTeam, MultiSelectItem, MultiSelectItems, WorkflowSummary } from "Types";
import styles from "./workflowInsights.module.scss";

const MultiSelect = Select.Filterable;
const systemWorkflowsUrl = serviceUrl.getSystemWorkflows();
const defaultFromDate = moment().startOf("month").unix();
const defaultToDate = moment().endOf("month").unix();

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
    workflowIds,
    teamIds,
    fromDate = defaultFromDate,
    toDate = defaultToDate,
  } = queryString.parse(location.search, queryStringOptions);

  const insightsSearchParams = queryString.stringify(
    {
      scopes,
      statuses,
      teamIds,
      workflowIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const insightsUrl = serviceUrl.getInsights({ query: insightsSearchParams });
  const insightsQuery = useQuery({
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

  return (
    <InsightsContainer>
      <Selects systemWorkflowsQuery={systemWorkflowsQuery} updateHistorySearch={updateHistorySearch} />
      <div>Nada</div>
    </InsightsContainer>
  );
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

  const {
    scopes,
    statuses,
    workflowIds,
    teamIds,
    triggers,
    fromDate = defaultFromDate,
    toDate = defaultToDate,
  } = queryString.parse(location.search, queryStringOptions);

  const selectedScopes = typeof scopes === "string" ? [scopes] : scopes;
  const selectedTeamIds = typeof teamIds === "string" ? [teamIds] : teamIds;
  const selectedWorkflowIds = typeof workflowIds === "string" ? [workflowIds] : workflowIds;
  const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;
  const selectedTriggers = typeof triggers === "string" ? [triggers] : triggers;

  const selectedTeams =
    teams && teams.filter((team: FlowTeam) => selectedTeamIds?.find((id: string) => id === team.id));

  const workflowOptions = getWorkflowOptions({
    isSystemWorkflowsEnabled,
    scopes,
    teams,
    selectedTeams,
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

  function handleChangeTimeframe(args: any) {
    return;
  }

  return (
    <div className={styles.dataFilters}>
      <MultiSelect
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
      <MultiSelect
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
      <MultiSelect
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
      {/* <MultiSelect
        id="insights-statuses-select"
        label="Choose status(es)"
        placeholder="Choose status(es)"
        invalid={false}
        onChange={handleSelectStatuses}
        items={statusOptions}
        itemToString={(item: MultiSelectItem) => (item ? item.label : "")}
        initialSelectedItems={executionOptions.filter((option) =>
          Boolean(selectedTriggers?.find((trigger: string) => trigger === option.value))
        )}
        titleText="Filter by status"
      /> */}
      <MultiSelect
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
      <ComboBox
        id="time-frame-dropdown"
        titleText="Time period"
        label="Time Frame"
        placeholder="Time Frame"
        onChange={handleChangeTimeframe}
        items={timeframeOptions}
        itemToString={(time: any) => (time ? time.label : "")}
        initialSelectedItem={handleChangeTimeframe}
      />
    </div>
  );
}

// interface GraphsProps {
//   [k: string]: any;
// }

// function Graphs(props: GraphsProps) {
//   const hasSelectedTeam = selectedTeam.id !== "none";
//   const hasSelectedWorkflow = selectedWorkflow.id !== "none";
//   const {
//     carbonLineData,
//     carbonScatterData,
//     carbonDonutData,
//     durationData,
//     medianDuration,
//     dataByTeams,
//     executionsByTeam,
//   } = parseChartsData(
//     executionList,
//     teams.map((team) => team.name),
//     hasSelectedTeam,
//     hasSelectedWorkflow
//   );

//   const totalExecutions = executionList.length;
//   return (
//     <>
//       <div className={styles.statsWidgets} data-testid="completed-insights">
//         <div className={styles.insightsCards} style={{ flexDirection: hasSelectedWorkflow ? "column" : "row" }}>
//           <InsightsTile
//             title="Executions"
//             type="runs"
//             totalCount={totalExecutions}
//             infoList={
//               hasSelectedWorkflow ? [] : hasSelectedTeam ? executionsByTeam.slice(0, 5) : dataByTeams.slice(0, 5)
//             }
//           />
//           <InsightsTile
//             title="Duration (median)"
//             type=""
//             totalCount={timeSecondsToTimeUnit(medianDuration)}
//             infoList={durationData}
//             valueWidth="7rem"
//             tileMaxHeight="22.375rem"
//           />
//         </div>
//         <ChartsTile title="Status" tileWidth="33rem" tileMaxHeight="22.375rem">
//           {totalExecutions === 0 ? (
//             <p className={`${styles.statsLabel} --no-data`}>No Data</p>
//           ) : (
//             <CarbonDonutChart data={carbonDonutData} />
//           )}
//         </ChartsTile>
//       </div>
//       <div className={styles.graphsWidgets}>
//         <ChartsTile title="Execution" totalCount="" type="" tileWidth="50rem">
//           {totalExecutions === 0 ? (
//             <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
//           ) : (
//             <CarbonLineChart data={carbonLineData} />
//           )}
//         </ChartsTile>
//         <ChartsTile title="Execution Time" totalCount="" type="" tileWidth="50rem">
//           {totalExecutions === 0 ? (
//             <p className={`${styles.graphsLabel} --no-data`}>No Data</p>
//           ) : (
//             <CarbonScatterChart data={carbonScatterData} />
//           )}
//         </ChartsTile>
//       </div>
//     </>
//   );
// }

interface GetWorkflowOptionsArgs {
  isSystemWorkflowsEnabled: boolean;
  scopes: string | Array<string> | null;
  selectedTeams: Array<FlowTeam>;
  systemWorkflowsData?: Array<WorkflowSummary>;
  teams: Array<FlowTeam>;
  userWorkflowsData: Array<WorkflowSummary>;
}

function getWorkflowOptions({
  isSystemWorkflowsEnabled,
  scopes,
  teams,
  selectedTeams,
  systemWorkflowsData = [],
  userWorkflowsData = [],
}: GetWorkflowOptionsArgs) {
  let workflowsList: Array<WorkflowSummary> = [];
  if (!scopes || (Array.isArray(scopes) && scopes?.includes(WorkflowScope.Team))) {
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
  if ((!scopes || scopes?.includes(WorkflowScope.System)) && isSystemWorkflowsEnabled) {
    workflowsList.push(...systemWorkflowsData);
  }
  if (!scopes || scopes?.includes(WorkflowScope.User)) {
    workflowsList.push(...userWorkflowsData);
  }
  let workflowsFilter = sortByProp(workflowsList, "name", "ASC");
  return workflowsFilter;
}
