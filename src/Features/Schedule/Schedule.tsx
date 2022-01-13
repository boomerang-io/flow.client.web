import React from "react";
import { useAppContext } from "Hooks";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  ConfirmModal,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tag,
  Tile,
  TooltipHover,
  ToastNotification,
  notify,
  ErrorDragon,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  MultiSelect as Select,
} from "@boomerang-io/carbon-addons-boomerang-react";
import Calendar from "Components/Calendar";
import { sortByProp } from "@boomerang-io/utils";
import cronstrue from "cronstrue";
import matchSorter from "match-sorter";
import moment from "moment";
import queryString from "query-string";
import { allowedUserRoles, WorkflowScope } from "Constants";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { queryStringOptions } from "Config/appConfig";
import { CircleFilled16, RadioButton16, Repeat16, RepeatOne16 } from "@carbon/icons-react";
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

  // if (schedulesQuery.isLoading) {
  //   return <Loading />;
  // }

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

    const disableTeamsDropdown = scopes && !scopes.includes(WorkflowScope.Team);

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
                  //@ts-ignore next-line
                  itemToString={(workflow) => {
                    //@ts-ignore next-line
                    const team = workflow ? teamsData.find((team) => team.id === workflow.flowTeamId) : undefined;
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
            <ScheduleList schedules={schedulesQuery.data} getSchedulesUrl={getSchedulesUrl} />
            <section className={styles.calendarContainer}>
              <CalendarView schedules={schedulesQuery.data} updateHistorySearch={updateHistorySearch} />
            </section>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface CalendarViewProps {
  schedules: Array<ScheduleUnion> | undefined;
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

  return <Calendar events={calendarEvents} heightOffset={210} onRangeChange={handleDateRangeChange} />;
}

interface ScheduleListProps {
  schedules?: Array<ScheduleUnion>;
  getSchedulesUrl: string;
}

function ScheduleList(props: ScheduleListProps) {
  const [filterQuery, setFilterQuery] = React.useState("");

  let filteredSchedules: Array<ScheduleUnion> = [];
  if (props.schedules) {
    filteredSchedules = Boolean(filterQuery)
      ? matchSorter(props.schedules ?? [], filterQuery, {
          keys: ["name", "description", "type", "status"],
        })
      : props.schedules;
  }

  function renderLists() {
    if (props.schedules) {
      if (props.schedules.length === 0) {
        return <div>No schedules found</div>;
      }

      if (filteredSchedules.length === 0) {
        return <div>No matching schedules found</div>;
      }

      const sortedSchedules = filteredSchedules.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      return sortedSchedules.map((schedule) => (
        <ScheduledListItem key={schedule.id} schedule={schedule} getSchedulesUrl={props.getSchedulesUrl} />
      ));
    }

    return null;
  }

  if (!props.schedules) {
    return <section className={styles.listContainer}>Loading</section>;
  }

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{`Existing Schedules (${props.schedules.length})`}</h2>
      </div>
      <Search
        light
        id="schedules-filter"
        labelText="Filter schedules"
        placeHolderText="Search schedules"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
      />
      <ul>{renderLists()}</ul>
    </section>
  );
}

interface ScheduledListItemProps {
  schedule: ScheduleUnion;
  getSchedulesUrl: string;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";
  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag style={{ marginLeft: 0 }} type="teal">
        {entry.key}:{entry.value}
      </Tag>
    );
  }
  const nextScheduledText = "Scheduled";
  const nextScheduleData = moment(props.schedule.nextScheduleDate).format("MMMM DD, YYYY HH:mm");

  /**
   * Delete schedule
   */

  const [deleteScheduleMutator, deleteScheduleMutation] = useMutation(resolver.deleteSchedule, {});

  const handleDeleteSchedule = async () => {
    try {
      await deleteScheduleMutator({ scheduleId: props.schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Duplicate ${props.schedule.name}`}
          subtitle={`Successfully duplicated ${props.schedule.name}`}
        />
      );
      queryCache.invalidateQueries(props.getSchedulesUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to duplicate ${props.schedule.name} failed`}
        />
      );
      return;
    }
  };

  /**
   * Disable schedule
   */
  const [toggleScheduleStatusMutator, toggleScheduleStatusMutation] = useMutation(resolver.patchSchedule, {});

  const handleToggleStatus = async () => {
    const body = { ...props.schedule, status: isActive ? "inactive" : "active" };
    try {
      await toggleScheduleStatusMutator({ scheduleId: props.schedule.id, body });
      notify(
        <ToastNotification
          kind="success"
          title={`${isActive ? "Disable" : "Enable"} Schedule`}
          subtitle={`Successfully ${isActive ? "disabled" : "enabled"} schedule ${props.schedule.name} `}
        />
      );
      queryCache.invalidateQueries(props.getSchedulesUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to ${isActive ? "disable" : "enable"} schedule ${props.schedule.name} failed`}
        />
      );
      return;
    }
  };

  // Set up the Oveflow menu options
  let menuOptions = [
    // {
    //   itemText: "View Activity",
    //   onClick: () => history.push(appLink.workflowActivity({ workflowId: props.workflowId })),
    // },
    {
      itemText: isActive ? "Disable" : "Enable",
      onClick: () => setIsToggleStatusModalOpen(true),
    },
    {
      hasDivider: true,
      itemText: "Delete",
      isDelete: true,
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  return (
    <li>
      <Tile className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <h3 title={props.schedule.name}>{props.schedule.name}</h3>
          <TooltipHover direction="top" tooltipText={props.schedule.type === "runOnce" ? "Single" : "Recurring"}>
            {props.schedule.type === "runOnce" ? <RepeatOne16 /> : <Repeat16 />}
          </TooltipHover>
          <TooltipHover direction="top" tooltipText={statusLabelMap[props.schedule.status]}>
            {props.schedule.status === "inactive" ? (
              <RadioButton16 className={styles.statusCircle} data-status={props.schedule.status} />
            ) : (
              <CircleFilled16 className={styles.statusCircle} data-status={props.schedule.status} />
            )}
          </TooltipHover>
        </div>
        <p className={styles.listItemDescription}>{props.schedule?.description ?? "---"}</p>
        <dl style={{ display: "flex" }}>
          <div style={{ width: "50%" }}>
            <dt>{nextScheduledText}</dt>
            <dd>{nextScheduleData}</dd>
          </div>
          <div style={{ width: "50%" }}>
            <dt>Time Zone</dt>
            <dd>{props.schedule.timezone}</dd>
          </div>
        </dl>
        <dl style={{ display: "flex" }}>
          <div>
            <dt>Frequency </dt>
            <dd>{props.schedule.type === "runOnce" ? "Once" : cronstrue.toString(props.schedule.cronSchedule)}</dd>
          </div>
        </dl>
        <dl>
          <dt>Labels</dt>
          <dd>{labels.length > 0 ? labels : "---"}</dd>
        </dl>
        <OverflowMenu
          flipped
          ariaLabel="Schedule card menu"
          iconDescription="Schedule menu icon"
          style={{ position: "absolute", right: "0", top: "0" }}
        >
          {menuOptions.map(({ onClick, itemText, ...rest }, index) => (
            <OverflowMenuItem onClick={onClick} itemText={itemText} key={`${itemText}-${index}`} {...rest} />
          ))}
        </OverflowMenu>
      </Tile>
      {isToggleStatusModalOpen && (
        <ConfirmModal
          affirmativeAction={handleToggleStatus}
          affirmativeButtonProps={{ kind: "danger", disabled: toggleScheduleStatusMutation.isLoading }}
          affirmativeText={isActive ? "Disable" : "Enable"}
          isOpen={isToggleStatusModalOpen}
          negativeAction={() => {
            setIsToggleStatusModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsToggleStatusModalOpen(false);
          }}
          title={`${isActive ? "Disable" : "Enable"} Schedule?`}
        >
          {`Are you sure you want to ${isActive ? "disable" : "enable"} schedule ${
            props.schedule.name
          }? Don't worry, you can change it in the future.`}
        </ConfirmModal>
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          affirmativeAction={handleDeleteSchedule}
          affirmativeButtonProps={{ kind: "danger", disabled: deleteScheduleMutation.isLoading }}
          affirmativeText="Delete"
          isOpen={isDeleteModalOpen}
          negativeAction={() => {
            setIsDeleteModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsDeleteModalOpen(false);
          }}
          title={`Delete Schedule?`}
        >
          {`Are you sure you want to delete schedule ${props.schedule.name}? There's no going back from this decision.`}
        </ConfirmModal>
      )}
    </li>
  );
}

export default Schedule;
