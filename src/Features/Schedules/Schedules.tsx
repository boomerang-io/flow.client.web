import React from "react";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import {
  FeatureHeader as Header,
  FeatureHeaderSubtitle as HeaderSubtitle,
  FeatureHeaderTitle as HeaderTitle,
  MultiSelect as Select,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Calendar from "Components/ScheduleCalendar";
import ScheduleCreator from "Components/ScheduleCreator";
import ScheduleEditor from "Components/ScheduleEditor";
import SchedulePanelDetail from "Components/SchedulePanelDetail";
import SchedulePanelList from "Components/SchedulePanelList";
import isArray from "lodash/isArray";
import moment from "moment-timezone";
import queryString from "query-string";
import { sortByProp } from "@boomerang-io/utils";
import { elevatedUserRoles, WorkflowScope } from "Constants";
import { scheduleStatusOptions } from "Constants/schedule";
import { queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import type { SlotInfo } from "react-big-calendar";
import type {
  CalendarDateRange,
  CalendarEntry,
  CalendarEvent,
  FlowTeam,
  MultiSelectItem,
  MultiSelectItems,
  ScheduleDate,
  ScheduleUnion,
  WorkflowSummary,
} from "Types";
import styles from "./Schedules.module.scss";

const MultiSelect = Select.Filterable;

const defaultStatusArray = scheduleStatusOptions.map((statusObj) => statusObj.value);
const defaultFromDate = moment().startOf("month").unix();
const defaultToDate = moment().endOf("month").unix();
const systemWorkflowsUrl = serviceUrl.getSystemWorkflows();

export default function Schedules() {
  const history = useHistory();
  const location = useLocation();
  const { teams, user, userWorkflows } = useAppContext();
  const [activeSchedule, setActiveSchedule] = React.useState<ScheduleUnion | undefined>();
  const [newSchedule, setNewSchedule] = React.useState<Pick<ScheduleDate, "dateSchedule" | "type"> | undefined>();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const isSystemWorkflowsEnabled = elevatedUserRoles.includes(user.type);

  /**
   * Get workflow data for calendar and schedule queries
   */
  const systemWorkflowsQuery = useQuery<Array<WorkflowSummary>, string>({
    queryKey: systemWorkflowsUrl,
    queryFn: resolver.query(systemWorkflowsUrl),
    enabled: isSystemWorkflowsEnabled,
  });

  /**
   * Get schedule and calendar data
   */
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

  const { fromDate = defaultFromDate, toDate = defaultToDate } = queryString.parse(location.search, queryStringOptions);

  const hasScheduleData = Boolean(schedulesQuery.data);
  let userScheduleIds = [];
  if (schedulesQuery.data) {
    for (const schedule of schedulesQuery.data) {
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

  /**
   * Component functions
   */
  function handleDateRangeChange(range: CalendarDateRange) {
    if (!isArray(range)) {
      const toDate = moment(range.end).unix();
      const fromDate = moment(range.start).unix();
      updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), toDate, fromDate });
    }
  }

  function updateHistorySearch({ ...props }) {
    const queryStr = `?${queryString.stringify({ ...props }, queryStringOptions)}`;
    history.push({ search: queryStr });
    return;
  }

  function handleSelectScopes({ selectedItems }: MultiSelectItems) {
    const scopes = selectedItems.length > 0 ? selectedItems.map((scope) => scope.value) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      scopes: scopes,
      teamIds: undefined,
      workflowIds: undefined,
    });
    return;
  }

  function handleSelectTeams({ selectedItems }: MultiSelectItems<FlowTeam>) {
    const teamIds = selectedItems.length > 0 ? selectedItems.map((team) => team.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      teamIds,
      workflowIds: undefined,
    });
    return;
  }

  function handleSelectWorkflows({ selectedItems }: MultiSelectItems<WorkflowSummary>) {
    const workflowIds = selectedItems.length > 0 ? selectedItems.map((worflow) => worflow.id) : undefined;
    updateHistorySearch({
      ...queryString.parse(location.search, queryStringOptions),
      workflowIds: workflowIds,
    });
    return;
  }

  function handleSelectStatuses({ selectedItems }: MultiSelectItems) {
    //@ts-ignore next-line
    const statuses = selectedItems.length > 0 ? selectedItems.map((status) => status.value) : undefined;
    updateHistorySearch({ ...queryString.parse(location.search, queryStringOptions), statuses: statuses });
    return;
  }

  function handleSetActiveSchedule(schedule: ScheduleUnion) {
    const workflowFindPredicate = (workflow: WorkflowSummary) => {
      return workflow.id === schedule.workflowId;
    };
    let workflow: WorkflowSummary | undefined;
    for (let team of teams) {
      if (!workflow) {
        const foundWorkflow = team.workflows.find(workflowFindPredicate);
        if (foundWorkflow) {
          workflow = foundWorkflow;
          break;
        }
      }
    }

    if (!workflow) {
      workflow = userWorkflows.workflows.find(workflowFindPredicate);
    }

    if (!workflow) {
      workflow = systemWorkflowsQuery.data?.find(workflowFindPredicate);
    }

    setActiveSchedule({ ...schedule, workflow });
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

    const selectedTeams =
      teams && teams.filter((team: FlowTeam) => selectedTeamIds?.find((id: string) => id === team.id));

    const workflowOptions = getWorkflowOptions({
      isSystemWorkflowsEnabled,
      scopes,
      teams,
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
              <HeaderTitle className={styles.headerTitle}>Schedules</HeaderTitle>
              <HeaderSubtitle>Manange all of your Schedules</HeaderSubtitle>
            </>
          }
          actions={
            <section aria-label="Schedule filters" className={styles.dataFiltersContainer}>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="schedules-scopes-select"
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
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  disabled={disableTeamsDropdown}
                  key={disableTeamsDropdown ? "teams-disabled" : "teams-enabeld"}
                  id="schedules-teams-select"
                  label="Choose team(s)"
                  placeholder="Choose team(s)"
                  invalid={false}
                  onChange={handleSelectTeams}
                  items={teams}
                  itemToString={(team: FlowTeam) => (team ? team.name : "")}
                  initialSelectedItems={selectedTeams}
                  titleText="Filter by Team"
                />
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="schedules-workflows-select"
                  label="Choose workflow(s)"
                  placeholder="Choose workflow(s)"
                  invalid={false}
                  onChange={handleSelectWorkflows}
                  items={workflowOptions}
                  itemToString={(workflow: WorkflowSummary) => {
                    if (workflow.scope === "team") {
                      const team = workflow
                        ? teams.find((team: FlowTeam) => team.id === workflow.flowTeamId)
                        : undefined;
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
              </div>
              <div className={styles.dataFilter}>
                <MultiSelect
                  light
                  id="schedules-statuses-select"
                  label="Choose status(es)"
                  placeholder="Choose status(es)"
                  invalid={false}
                  onChange={handleSelectStatuses}
                  items={scheduleStatusOptions}
                  itemToString={(item: MultiSelectItem) => (item ? item.label : "")}
                  initialSelectedItems={scheduleStatusOptions.filter((option) =>
                    Boolean(selectedStatuses?.find((status) => status === option.value))
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
              getCalendarUrl={getCalendarUrl}
              getSchedulesUrl={getSchedulesUrl}
              includeStatusFilter={false}
              schedulesQuery={schedulesQuery}
              setActiveSchedule={handleSetActiveSchedule}
              setIsCreatorOpen={setIsCreatorOpen}
              setIsEditorOpen={setIsEditorOpen}
            />
            <CalendarView
              handleDateRangeChange={handleDateRangeChange}
              hasScheduleData={hasScheduleData}
              getCalendarUrl={getCalendarUrl}
              schedules={schedulesQuery.data}
              setActiveSchedule={handleSetActiveSchedule}
              setIsCreatorOpen={setIsCreatorOpen}
              setIsEditorOpen={setIsEditorOpen}
              setIsPanelOpen={setIsPanelOpen}
              setNewSchedule={setNewSchedule}
              updateHistorySearch={updateHistorySearch}
            />
            <SchedulePanelDetail
              className={styles.panelContainer}
              event={activeSchedule}
              isOpen={isPanelOpen}
              setIsOpen={setIsPanelOpen}
              setIsEditorOpen={setIsEditorOpen}
            />
            <ScheduleCreator
              getCalendarUrl={getCalendarUrl}
              getSchedulesUrl={getSchedulesUrl}
              includeWorkflowDropdown={true}
              isModalOpen={isCreatorOpen}
              onCloseModal={() => setIsCreatorOpen(false)}
              schedule={newSchedule}
              workflowOptions={workflowOptions}
            />
            <ScheduleEditor
              getCalendarUrl={getCalendarUrl}
              getSchedulesUrl={getSchedulesUrl}
              includeWorkflowDropdown={true}
              isModalOpen={isEditorOpen}
              onCloseModal={() => setIsEditorOpen(false)}
              schedule={activeSchedule}
              workflowOptions={workflowOptions}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface CalendarViewProps {
  getCalendarUrl: string;
  handleDateRangeChange: (dateInfo: CalendarDateRange) => void;
  hasScheduleData: boolean;
  schedules?: Array<ScheduleUnion>;
  setActiveSchedule: (schedule: ScheduleUnion) => void;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewSchedule: React.Dispatch<React.SetStateAction<Pick<ScheduleDate, "dateSchedule" | "type"> | undefined>>;
  updateHistorySearch: (props: any) => void;
}

function CalendarView(props: CalendarViewProps) {
  const calendarQuery = useQuery<Array<CalendarEntry>, string>({
    queryKey: props.getCalendarUrl,
    queryFn: resolver.query(props.getCalendarUrl),
    enabled: props.hasScheduleData,
  });

  const calendarEvents: Array<CalendarEvent> = [];
  if (calendarQuery.data && props.schedules) {
    for (let calendarEntry of calendarQuery.data) {
      const matchingSchedule: ScheduleUnion | undefined = props.schedules.find(
        (schedule: ScheduleUnion) => schedule.id === calendarEntry.scheduleId
      );
      if (matchingSchedule) {
        for (const date of calendarEntry.dates) {
          const newEntry = {
            resource: matchingSchedule,
            start: moment.tz(date, matchingSchedule.timezone).toDate(),
            end: moment.tz(date, matchingSchedule.timezone).toDate(),
            title: matchingSchedule.name,
          };
          calendarEvents.push(newEntry);
        }
      }
    }
  }

  return (
    <section className={styles.calendarContainer} data-is-loading={calendarQuery.isLoading}>
      <Calendar
        heightOffset={220}
        //@ts-ignore
        onSelectEvent={(data: CalendarEvent) => {
          props.setIsPanelOpen(true);
          props.setActiveSchedule({ ...data.resource, nextScheduleDate: new Date(data.start).toISOString() });
        }}
        onRangeChange={props.handleDateRangeChange}
        onSelectSlot={(slot: SlotInfo) => {
          const selectedDate = moment(slot.start);
          const isCurrentDay = selectedDate.isSame(new Date(), "day");
          if (selectedDate.isAfter() || isCurrentDay) {
            const dateSchedule = isCurrentDay ? moment().toISOString() : selectedDate.toISOString();
            props.setNewSchedule({ dateSchedule, type: "runOnce" });
            props.setIsCreatorOpen(true);
          }
        }}
        //@ts-ignore
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
    </section>
  );
}

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

