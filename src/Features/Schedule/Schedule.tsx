/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import React from "react";
import { useQuery, useMutation, queryCache } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import Calendar from "Components/Calendar";
import { useAppContext } from "Hooks";
import {
  ErrorMessage,
  ErrorDragon,
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
  Loading,
  MultiSelect as Select,
  SkeletonPlaceholder,
} from "@boomerang-io/carbon-addons-boomerang-react";
import {
  Button,
  ConfirmModal,
  Error,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tag,
  TextArea,
  TextInput,
  Tile,
  TooltipHover,
  ToastNotification,
  notify,
} from "@boomerang-io/carbon-addons-boomerang-react";
import HeaderWidget from "Components/HeaderWidget";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { queryStringOptions } from "Config/appConfig";
import { sortByProp } from "@boomerang-io/utils";
import capitalize from "lodash/capitalize";
import matchSorter from "match-sorter";
import moment from "moment";
import queryString from "query-string";
import { allowedUserRoles, WorkflowScope } from "Constants";
import { Add16, ArrowUpRight32, CircleFilled16 } from "@carbon/icons-react";
import { CalendarEvent, ScheduleStatus, ScheduleUnion, WorkflowSummary } from "Types";
import styles from "./Schedule.module.scss";

const MultiSelect = Select.Filterable;

export const scheduleStatusOptions = [
  { label: "Enabled", value: "active" },
  { label: "Disabled", value: "inactive" },
  { label: "Workflow Disabled", value: "trigger_disabled" },
];

export const statusLabelMap: Record<ScheduleStatus, string> = {
  active: "Enabled",
  inactive: "Disabled",
  trigger_disabled: "Trigger Disabled",
};
const defaultStatusArray = scheduleStatusOptions.map((statusObj) => statusObj.value);

const defaultFromDate = moment().startOf("month").unix();
const defaultToDate = moment().endOf("month").unix();

const systemUrl = serviceUrl.getSystemWorkflows();
const userWorkflowsUrl = serviceUrl.getUserWorkflows();

function Schedule() {
  const history = useHistory();
  const location = useLocation();
  const { teams, user } = useAppContext();

  let userTeamIds: Array<string> = [];
  const isSystemWorkflowsEnabled = allowedUserRoles.includes(user.type);

  /**
   * Get worfklow data for calendar and schedule queries
   */
  const systemWorkflowsQuery = useQuery({
    queryKey: systemUrl,
    queryFn: resolver.query(systemUrl),
    config: { enabled: isSystemWorkflowsEnabled },
  });

  const userWorkflowsQuery = useQuery({
    queryKey: userWorkflowsUrl,
    queryFn: resolver.query(userWorkflowsUrl),
  });

  /** Get schedule and calendar data */
  const hasWorkflowsData = Boolean(systemWorkflowsQuery.data) && Boolean(userWorkflowsQuery.data);

  let userWorkflowIds = [];
  if (hasWorkflowsData) {
    for (const workflow of userWorkflowsQuery.data.workflows) {
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
  function getWorkflowFilter({ teamsData, selectedTeams, systemWorkflowsData = [], userWorkflowsData = [] }) {
    let workflowsList = [];
    if (!scopes || scopes?.includes(WorkflowScope.Team)) {
      if (!selectedTeams.length && teamsData) {
        //@ts-ignore next-line
        workflowsList = teamsData.reduce((acc, team) => {
          acc.push(...team.workflows);
          return acc;
        }, []);
      } else if (selectedTeams) {
        //@ts-ignore next-line
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

  if (teams || systemWorkflowsQuery.data || userWorkflowsQuery.data) {
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
      userWorkflowsData: userWorkflowsQuery?.data?.workflows,
    });
    const maxDate = moment().format("MM/DD/YYYY");

    const workflowScopeOptions = [
      { label: "User", value: WorkflowScope.User },
      { label: "Team", value: WorkflowScope.Team },
    ];

    if (isSystemWorkflowsEnabled) {
      workflowScopeOptions.push({ label: "System", value: WorkflowScope.System });
    }

    return (
      <div className={styles.container}>
        <Header
          className={styles.header}
          includeBorder={false}
          header={
            <>
              <HeaderTitle className={styles.headerTitle}>Schedule</HeaderTitle>
              <HeaderSubtitle>View your workflow schedules.</HeaderSubtitle>
            </>
          }
          actions={
            <section className={styles.headerSummary}>
              {/* {isActionsLoading ? (
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
              )} */}
            </section>
          }
        />
        <div className={styles.content}>
          <section aria-label="Actions">
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
                    //@ts-ignore next-line
                    itemToString={(scope) => (scope ? scope.label : "")}
                    initialSelectedItems={workflowScopeOptions.filter((option) =>
                      //@ts-ignore next-line
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
                      //@ts-ignore next-line
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
              </div>
            </div>
          </section>
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

  return (
    <Calendar
      // onSelectEvent={(data: CalendarEvent) => {
      //   props.setIsEditorOpen(true);
      //   props.setActiveSchedule(data.resource);
      // }}
      onRangeChange={handleDateRangeChange}
      events={calendarEvents}
      heightOffset={280}
    />
  );
}

interface ScheduleListProps {
  schedules: Array<ScheduleUnion>;
  workflowId: string;
  getSchedulesUrl: string;
}

function ScheduleList(props: ScheduleListProps) {
  const [filterQuery, setFilterQuery] = React.useState("");

  const filteredSchedules = Boolean(filterQuery)
    ? matchSorter(props.schedules, filterQuery, {
        keys: ["name", "description", "type", "status"],
      })
    : props.schedules;

  function renderLists() {
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
      <ScheduledListItem
        key={schedule.id}
        schedule={schedule}
        workflowId={props.workflowId}
        getSchedulesUrl={props.getSchedulesUrl}
      />
    ));
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
  workflowId: string;
  getSchedulesUrl: string;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const history = useHistory();
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";
  const isTriggerDisabled = props.schedule.status === "trigger_disabled";

  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag>
        {entry.key}:{entry.value}
      </Tag>
    );
  }

  const nextScheduledText = props.schedule.type === "runOnce" ? "Scheduled" : "Next Execution";
  const nextScheduleData =
    props.schedule.type === "runOnce"
      ? moment(props.schedule.dateSchedule).format("MMMM DD, YYYY HH:mm")
      : moment(props.schedule.nextScheduleDate).format("MMMM DD, YYYY HH:mm");

  /**
   * Delete schedule
   */

  const [deleteScheduleMutator, { isLoading: isDeletingSchedule }] = useMutation(resolver.deleteSchedule, {});

  const handleDeleteSchedule = async (workflow: WorkflowSummary) => {
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
  const [toggleScheduleStatusMutator, ...disableScheduleMutation] = useMutation(resolver.patchSchedule, {});

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
          <TooltipHover direction="top" tooltipText={statusLabelMap[props.schedule.status] ?? "---"}>
            <CircleFilled16 className={styles.statusCircle} data-status={props.schedule.status} />
          </TooltipHover>
        </div>
        <p className={styles.listItemDescription}>{props.schedule?.description ?? "---"}</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div>
            <dt>Executes</dt>
            <dd>{props.schedule.type === "runOnce" ? "Once" : "Repeatedly"}</dd>
          </div>
          <div>
            <dt>{nextScheduledText}</dt>
            <dd>{nextScheduleData}</dd>
          </div>
        </div>
        <div className={styles.listItemLabels}>{labels}</div>
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
          affirmativeButtonProps={{ kind: "danger" }}
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
