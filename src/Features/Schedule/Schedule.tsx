import React from "react";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  MultiSelect as Select,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Calendar from "Components/Calendar";
import ErrorDragon from "Components/ErrorDragon";
import ScheduleCreator from "Components/ScheduleCreator";
import ScheduleEditor from "Components/ScheduleEditor";
import SchedulePanelDetail from "Components/SchedulePanelDetail";
import SchedulePanelList from "Components/SchedulePanelList";
import { sortByProp } from "@boomerang-io/utils";
import moment from "moment";
import queryString from "query-string";
import { allowedUserRoles, WorkflowScope } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { queryStringOptions } from "Config/appConfig";
import { CalendarEvent, FlowTeam, ScheduleStatus, ScheduleType, ScheduleUnion, WorkflowSummary } from "Types";
import styles from "./Schedule.module.scss";

const MultiSelect = Select.Filterable;

export const scheduleStatusOptions: Array<{ label: string; value: ScheduleStatus }> = [
  { label: "Enabled", value: "active" },
  { label: "Disabled", value: "inactive" },
  { label: "Workflow Disabled", value: "trigger_disabled" },
];

export const statusLabelMap: Record<ScheduleStatus, string> = {
  active: "Enabled",
  inactive: "Disabled",
  trigger_disabled: "Trigger Disabled",
  deleted: "Deleted",
};

export const typeLabelMap: Record<ScheduleType, string> = {
  runOnce: "Run Once",
  cron: "Recurring",
  advancedCron: "Recurring via cron expression",
};

const defaultStatusArray = scheduleStatusOptions.map((statusObj) => statusObj.value);

const defaultFromDate = moment().startOf("month").unix();
const defaultToDate = moment().endOf("month").unix();

const systemUrl = serviceUrl.getSystemWorkflows();

function Schedule() {
  const history = useHistory();
  const location = useLocation();
  const { teams, user, userWorkflows } = useAppContext();
  const [activeSchedule, setActiveSchedule] = React.useState<ScheduleUnion | undefined>();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);

  const isSystemWorkflowsEnabled = allowedUserRoles.includes(user.type);

  /**
   * Get worfklow data for calendar and schedule queries
   */
  const systemWorkflowsQuery = useQuery({
    queryKey: systemUrl,
    queryFn: resolver.query(systemUrl),
    config: { enabled: isSystemWorkflowsEnabled },
  });

  /** Get schedule and calendar data */
  const hasWorkflowsData = Boolean(systemWorkflowsQuery.data) && Boolean(userWorkflows.workflows);

  let userWorkflowIds = [];
  if (hasWorkflowsData) {
    for (const workflow of userWorkflows.workflows) {
      userWorkflowIds.push(workflow.id);
    }

    for (const workflow of systemWorkflowsQuery.data) {
      userWorkflowIds.push(workflow.id);
    }
  }

  const { scopes, statuses = defaultStatusArray, workflowIds, teamIds } = queryString.parse(
    location.search,
    queryStringOptions
  );

  const schedulesUrlQuery = queryString.stringify(
    {
      scopes,
      statuses,
      teamIds,
      workflowIds,
    },
    queryStringOptions
  );
  const getSchedulesUrl = serviceUrl.getSchedules({ query: schedulesUrlQuery });

  const schedulesQuery = useQuery<Array<ScheduleUnion>, string>({
    queryKey: getSchedulesUrl,
    queryFn: resolver.query(getSchedulesUrl),
  });

  if (schedulesQuery.isError) {
    return <ErrorDragon />;
  }

  /**
   * Function that updates url search history to persist state
   * @param {object} query - all of the query params
   *
   */
  const updateHistorySearch = ({ ...props }) => {
    //@ts-ignore next-line
    const queryStr = `?${queryString.stringify({ ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  };

  //@ts-ignore next-line
  function handleSelectScopes({ selectedItems }) {
    //@ts-ignore next-line
    const scopes = selectedItems.length > 0 ? selectedItems.map((scope) => scope.value) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      scopes: scopes,
      teamIds: undefined,
      workflowIds: undefined,
    });
    return;
  }

  //@ts-ignore next-line
  function handleSelectTeams({ selectedItems }) {
    //@ts-ignore next-line
    const teamIds = selectedItems.length > 0 ? selectedItems.map((team) => team.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      teamIds,
      workflowIds: undefined,
    });
    return;
  }

  //@ts-ignore next-line
  function handleSelectWorkflows({ selectedItems }) {
    //@ts-ignore next-line
    const workflowIds = selectedItems.length > 0 ? selectedItems.map((worflow) => worflow.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      workflowIds: workflowIds,
    });
    return;
  }

  //@ts-ignore next-line
  function handleSelectStatuses({ selectedItems }) {
    //@ts-ignore next-line
    const statuses = selectedItems.length > 0 ? selectedItems.map((status) => status.value) : undefined;
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), statuses: statuses });
    return;
  }

  //@ts-ignore next-line
  interface GetWorkflowFilterArgs {
    teamsData: Array<FlowTeam>;
    selectedTeams: Array<string>;
    systemWorkflowsData: Array<WorkflowSummary>;
    userWorkflowsData: Array<WorkflowSummary>;
  }
  function getWorkflowFilter({
    teamsData,
    selectedTeams,
    systemWorkflowsData = [],
    userWorkflowsData = [],
  }: GetWorkflowFilterArgs) {
    let workflowsList: Array<WorkflowSummary> = [];
    if (!scopes || scopes?.includes(WorkflowScope.Team)) {
      if (!selectedTeams.length && teamsData) {
        //@ts-ignore next-line
        workflowsList = teamsData.reduce((acc: Array<WorkflowSummary>, team: FlowTeam): Array<WorkflowSummary> => {
          acc.push(...team.workflows);
          return acc;
        }, []);
      } else if (selectedTeams) {
        //@ts-ignore next-line
        workflowsList = selectedTeams.reduce((acc: Array<WorkflowSummary>, team: FlowTeam): Array<WorkflowSummary> => {
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

  if (teams || systemWorkflowsQuery.data || userWorkflows.workflows) {
    const { workflowIds = "", scopes = "", statuses = "", teamIds = "" } = queryString.parse(
      location.search,
      queryStringOptions
    );

    const selectedScopes = typeof scopes === "string" ? [scopes] : scopes;
    const selectedTeamIds = typeof teamIds === "string" ? [teamIds] : teamIds;
    const selectedWorkflowIds = typeof workflowIds === "string" ? [workflowIds] : workflowIds;
    const selectedStatuses = typeof statuses === "string" ? [statuses] : statuses;

    const teamsData = teams && JSON.parse(JSON.stringify(teams));

    //@ts-ignore next-line
    const selectedTeams =
      teams &&
      //@ts-ignore next-line
      teamsData.filter((team) => {
        //@ts-ignore next-line
        if (selectedTeamIds.find((id) => id === team.id)) {
          return true;
        } else {
          return false;
        }
      });

    const workflowsFilter = getWorkflowFilter({
      teamsData,
      selectedTeams,
      systemWorkflowsData: systemWorkflowsQuery.data,
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

    return (
      <div className={styles.container}>
        <Header
          className={styles.header}
          includeBorder={true}
          header={
            <>
              <HeaderTitle className={styles.headerTitle}>Schedule</HeaderTitle>
              <HeaderSubtitle>View your workflow schedules.</HeaderSubtitle>
            </>
          }
          actions={
            <section aria-label="Schedule filters" className={styles.dataFiltersContainer}>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="actions-scopes-select"
                  label="Choose scope(s)"
                  placeholder="Choose scope(s)"
                  invalid={false}
                  onChange={handleSelectScopes}
                  items={workflowScopeOptions}
                  //@ts-ignore next-line
                  itemToString={(scope) => (scope ? scope.label : "")}
                  initialSelectedItems={workflowScopeOptions.filter((option) =>
                    //@ts-ignore next-line
                    Boolean(selectedScopes.find((scope) => scope === option.value))
                  )}
                  titleText="Filter by scope"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  disabled={disableTeamsDropdown}
                  key={disableTeamsDropdown ? "teams-disabled" : "teams-enabeld"}
                  id="actions-teams-select"
                  label="Choose team(s)"
                  placeholder="Choose team(s)"
                  invalid={false}
                  onChange={handleSelectTeams}
                  items={teamsData}
                  //@ts-ignore next-line
                  itemToString={(team) => (team ? team.name : "")}
                  initialSelectedItems={selectedTeams}
                  titleText="Filter by team"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="actions-workflows-select"
                  label="Choose workflow(s)"
                  placeholder="Choose workflow(s)"
                  invalid={false}
                  onChange={handleSelectWorkflows}
                  items={workflowsFilter}
                  itemToString={(workflow: WorkflowSummary) => {
                    const team = workflow
                      ? teamsData.find((team: FlowTeam) => team.id === workflow.flowTeamId)
                      : undefined;
                    return workflow ? (team ? `${workflow.name} [${team.name}]` : workflow.name) : "";
                  }}
                  //@ts-ignore next-line
                  initialSelectedItems={workflowsFilter.filter((workflow) =>
                    //@ts-ignore next-line
                    Boolean(selectedWorkflowIds.find((id) => id === workflow.id))
                  )}
                  titleText="Filter by workflow"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="actions-statuses-select"
                  label="Choose status(es)"
                  placeholder="Choose status(es)"
                  invalid={false}
                  onChange={handleSelectStatuses}
                  items={scheduleStatusOptions}
                  //@ts-ignore next-line
                  itemToString={(item) => (item ? item.label : "")}
                  initialSelectedItems={scheduleStatusOptions.filter((option) =>
                    //@ts-ignore next-line
                    Boolean(selectedStatuses.find((status) => status === option.value))
                  )}
                  titleText="Filter by status"
                />
              </div>
            </section>
          }
        />
        <div className={styles.content}>
          <div className={styles.contentContainer}>
            <SchedulePanelList
              getCalendarUrl=""
              getSchedulesUrl={getSchedulesUrl}
              includeStatusFilter={false}
              schedulesQuery={schedulesQuery}
              setActiveSchedule={setActiveSchedule}
              setIsCreatorOpen={setIsCreatorOpen}
              setIsEditorOpen={setIsEditorOpen}
            />
            <section className={styles.calendarContainer}>
              <CalendarView
                schedules={schedulesQuery.data}
                updateHistorySearch={updateHistorySearch}
                setActiveSchedule={setActiveSchedule}
                setIsCreatorOpen={setIsCreatorOpen}
                setIsEditorOpen={setIsEditorOpen}
                setIsPanelOpen={setIsPanelOpen}
              />
            </section>
            <SchedulePanelDetail
              className={styles.panelContainer}
              event={activeSchedule}
              isOpen={isPanelOpen}
              setIsOpen={setIsPanelOpen}
              setIsEditorOpen={setIsEditorOpen}
            />
            <ScheduleCreator
              getCalendarUrl={""}
              getSchedulesUrl={getSchedulesUrl}
              includeWorkflowDropdown={true}
              isModalOpen={isCreatorOpen}
              onCloseModal={() => setIsCreatorOpen(false)}
              schedule={activeSchedule}
              workflowOptions={workflowsFilter}
            />
            <ScheduleEditor
              getCalendarUrl={""}
              getSchedulesUrl={getSchedulesUrl}
              includeWorkflowDropdown={true}
              isModalOpen={isEditorOpen}
              onCloseModal={() => setIsEditorOpen(false)}
              schedule={activeSchedule}
              workflowOptions={workflowsFilter}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface CalendarViewProps {
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedules?: Array<ScheduleUnion>;
  updateHistorySearch: (props: any) => void;
}

function CalendarView(props: CalendarViewProps) {
  const location = useLocation();
  const { fromDate = defaultFromDate, toDate = defaultToDate } = queryString.parse(location.search, queryStringOptions);

  const handleDateRangeChange = (dateInfo: any) => {
    const toDate = moment(dateInfo.end).unix();
    const fromDate = moment(dateInfo.start).unix();
    props.updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), toDate, fromDate });
  };

  const hasScheduleData = Boolean(props.schedules);
  let userScheduleIds = [];
  if (props.schedules) {
    for (const schedule of props.schedules) {
      userScheduleIds.push(schedule.id);
    }
  }
  const calendarUrlQuery = queryString.stringify(
    {
      scheduleIds: userScheduleIds,
      fromDate,
      toDate,
    },
    queryStringOptions
  );
  const getCalendarUrl = serviceUrl.getSchedulesCalendars({ query: calendarUrlQuery });
  //@ts-ignore next-line
  const calendarQuery = useQuery(
    {
      queryKey: getCalendarUrl,
      queryFn: resolver.query(getCalendarUrl),
    },
    { enabled: hasScheduleData }
  );

  const calendarEvents: Array<CalendarEvent> = [];
  if (calendarQuery.data && props.schedules) {
    //@ts-ignore next-line
    for (let calendarEntry of calendarQuery.data) {
      const matchingSchedule: ScheduleUnion | undefined = props.schedules.find(
        (schedule: ScheduleUnion) => schedule.id === calendarEntry.scheduleId
      );
      if (matchingSchedule) {
        for (const date of calendarEntry.dates) {
          const newEntry = {
            resource: matchingSchedule,
            start: new Date(date),
            end: new Date(date),
            title: matchingSchedule.name,
          };
          calendarEvents.push(newEntry);
        }
      }
    }
  }

  return (
    <Calendar
      heightOffset={210}
      onSelectEvent={(data: CalendarEvent) => {
        props.setIsPanelOpen(true);
        props.setActiveSchedule({ ...data.resource, nextScheduleDate: new Date(data.start).toISOString() });
      }}
      onRangeChange={handleDateRangeChange}
      onSelectSlot={(day: any) => {
        const selectedDate = moment(day.start);
        const isCurrentDay = selectedDate.isSame(new Date(), "day");
        if (selectedDate.isAfter() || isCurrentDay) {
          const dateSchedule = isCurrentDay ? moment().toISOString() : day.start.toISOString();
          //@ts-ignore
          props.setActiveSchedule({ dateSchedule, type: "runOnce" });
          props.setIsCreatorOpen(true);
        }
      }}
      dayPropGetter={(date: Date) => {
        const selectedDate = moment(date);
        if (selectedDate.isBefore(new Date(), "day")) {
          return {
            style: {
              cursor: "initial",
            },
          };
        }
      }}
      events={calendarEvents}
    />
  );
}

export default Schedule;
