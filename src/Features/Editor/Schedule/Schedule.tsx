import React from "react";
import { useQuery, useMutation, queryCache, QueryResult } from "react-query";
import {
  Button,
  ConfirmModal,
  CodeSnippet,
  MultiSelect,
  Error,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tag,
  Tile,
  TooltipHover,
  ToastNotification,
  notify,
} from "@boomerang-io/carbon-addons-boomerang-react";
import ScheduleCreator from "Components/ScheduleCreator";
import ScheduleEditor from "Components/ScheduleEditor";
import SlidingPane from "react-sliding-pane";
import queryString from "query-string";
import Calendar from "Components/Calendar";
import cronstrue from "cronstrue";
import matchSorter from "match-sorter";
import moment from "moment-timezone";
import { DATETIME_LOCAL_DISPLAY_FORMAT } from "Utils/dateHelper";
import { scheduleStatusOptions, statusLabelMap, typeLabelMap } from "Features/Schedule";
import { queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Add16, CircleFilled16, SettingsAdjust16, RadioButton16, Repeat16, RepeatOne16 } from "@carbon/icons-react";
import { CalendarEvent, ScheduleCalendar, ScheduleUnion, WorkflowSummary } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

export default function ScheduleView(props: ScheduleProps) {
  const [activeSchedule, setActiveSchedule] = React.useState<ScheduleUnion | undefined>();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(moment().startOf("month").unix());
  const [toDate, setToDate] = React.useState(moment().endOf("month").unix());

  /**
   * Get the schedules for the workflow
   * A schedule is an object that defines the events
   */

  const workflowScheduleUrl = serviceUrl.getWorkflowSchedules({ workflowId: props.summaryData.id });

  const workflowSchedulesQuery = useQuery<Array<ScheduleUnion>, string>({
    queryKey: workflowScheduleUrl,
    queryFn: resolver.query(workflowScheduleUrl),
  });

  /**
   * Get the calendar for the workflow
   * A "calendar" is the scheduled events that are well scheduled to occur
   * in a given time frame. We default to fetching the calendar for the current month
   */
  const workflowCalendarUrlQuery = queryString.stringify(
    {
      fromDate: fromDate,
      toDate: toDate,
    },
    { ...queryStringOptions, encode: false }
  );

  const workflowCalendarUrl = serviceUrl.getWorkflowSchedulesCalendar({
    workflowId: props.summaryData.id,
    query: workflowCalendarUrlQuery,
  });

  const workflowCalendarQuery = useQuery<Array<ScheduleCalendar>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  const handleDateRangeChange = (dateInfo: any) => {
    if (dateInfo) {
      const fromDate = moment(dateInfo.start).unix();
      const toDate = moment(dateInfo.end).unix();
      setFromDate(fromDate);
      setToDate(toDate);
    }
  };

  /**
   * Start rendering
   */

  if (!workflowSchedulesQuery.data) {
    return <Loading />;
  }

  if (workflowSchedulesQuery.error) {
    return <Error />;
  }

  const schedules = workflowSchedulesQuery.data;

  return (
    <>
      <div className={styles.container}>
        <ScheduleList
          schedules={schedules}
          setActiveSchedule={setActiveSchedule}
          setIsEditorOpen={setIsEditorOpen}
          setIsCreatorOpen={setIsCreatorOpen}
          workflow={props.summaryData}
          workflowCalendarUrl={workflowCalendarUrl}
          workflowScheduleUrl={workflowScheduleUrl}
        />
        <CalendarView
          onDateRangeChange={handleDateRangeChange}
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          setIsPanelOpen={setIsPanelOpen}
          workflowSchedules={workflowSchedulesQuery.data}
          workflowCalendarQuery={workflowCalendarQuery}
        />
      </div>
      <EditorPanel
        event={activeSchedule}
        isOpen={isPanelOpen}
        setIsOpen={setIsPanelOpen}
        setIsEditorOpen={setIsEditorOpen}
      />
      <ScheduleCreator
        isModalOpen={isCreatorOpen}
        onCloseModal={() => setIsCreatorOpen(false)}
        schedule={activeSchedule}
        workflow={props.summaryData}
        workflowScheduleUrl={workflowScheduleUrl}
        workflowCalendarUrl={workflowCalendarUrl}
      />
      <ScheduleEditor
        isModalOpen={isEditorOpen}
        onCloseModal={() => setIsEditorOpen(false)}
        schedule={activeSchedule}
        workflowScheduleUrl={workflowScheduleUrl}
        workflowCalendarUrl={workflowCalendarUrl}
        workflow={props.summaryData}
      />
    </>
  );
}

interface CalendarViewProps {
  onDateRangeChange: (dateInfo: any) => void;
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workflowCalendarQuery: QueryResult<ScheduleCalendar[], Error>;
  workflowSchedules: Array<ScheduleUnion>;
}

function CalendarView(props: CalendarViewProps) {
  const calendarEvents: Array<CalendarEvent> = [];
  if (props.workflowCalendarQuery.data && props.workflowSchedules) {
    for (let calendarEntry of props.workflowCalendarQuery.data) {
      const matchingSchedule: ScheduleUnion | undefined = props.workflowSchedules.find(
        (schedule: ScheduleUnion) => schedule.id === calendarEntry.scheduleId
      );
      if (matchingSchedule) {
        for (const date of calendarEntry.dates) {
          const newEntry = {
            resource: matchingSchedule,
            start: new Date(date),
            end: new Date(date),
            title: matchingSchedule.name,
            onClick: () => {
              props.setActiveSchedule(matchingSchedule);
              props.setIsPanelOpen(true);
            },
          };
          calendarEvents.push(newEntry);
        }
      }
    }
  }

  return (
    <section className={styles.calendarContainer} data-is-loading={props.workflowCalendarQuery.isLoading}>
      <Calendar
        onSelectEvent={(data: CalendarEvent) => {
          props.setIsPanelOpen(true);
          props.setActiveSchedule({ ...data.resource, nextScheduleDate: new Date(data.start).toISOString() });
        }}
        onRangeChange={props.onDateRangeChange}
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
    </section>
  );
}

interface ScheduleListProps {
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedules: Array<ScheduleUnion>;
  workflow: WorkflowSummary;
  workflowCalendarUrl: string;
  workflowScheduleUrl: string;
}

function ScheduleList(props: ScheduleListProps) {
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<Array<string>>([]);

  function renderLists() {
    if (props.schedules.length === 0) {
      return <div>No schedules found</div>;
    }

    const filteredSchedules = Boolean(filterQuery)
      ? matchSorter(props.schedules, filterQuery, {
          keys: ["name", "description", "type", "status"],
        })
      : props.schedules;

    const sortedSchedules = filteredSchedules.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    let selectedSchedules = sortedSchedules;
    if (selectedStatuses.length) {
      selectedSchedules = sortedSchedules.filter((schedule) => {
        return selectedStatuses.includes(schedule.status);
      });
    }

    if (selectedSchedules.length === 0) {
      return <div>No matching schedules found</div>;
    }

    return selectedSchedules.map((schedule) => (
      <ScheduledListItem
        key={schedule.id}
        schedule={schedule}
        setActiveSchedule={props.setActiveSchedule}
        setIsEditorOpen={props.setIsEditorOpen}
        workflow={props.workflow}
        workflowCalendarUrl={props.workflowCalendarUrl}
        workflowScheduleUrl={props.workflowScheduleUrl}
      />
    ));
  }

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{`Existing Schedules (${props.schedules.length})`}</h2>
        <Button size="field" renderIcon={Add16} onClick={() => props.setIsCreatorOpen(true)} kind="ghost">
          Create a Schedule
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: "0.5rem", width: "100%" }}>
        <div style={{ width: "50%" }}>
          <Search
            light
            id="schedules-filter"
            labelText="Filter schedules"
            placeHolderText="Search schedules"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
          />
        </div>
        <div style={{ width: "50%" }}>
          <MultiSelect
            light
            id="actions-statuses-select"
            label="Choose status(es)"
            placeholder="Choose status(es)"
            invalid={false}
            onChange={({ selectedItems }: any) => setSelectedStatuses(selectedItems.map((item: any) => item.value))}
            items={scheduleStatusOptions}
            selectedItem={selectedStatuses}
            titleText="Filter by status"
          />
        </div>
      </div>
      <ul>{renderLists()}</ul>
    </section>
  );
}

interface ScheduledListItemProps {
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schedule: ScheduleUnion;
  workflowScheduleUrl: string;
  workflowCalendarUrl: string;
  workflow: WorkflowSummary;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";
  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag key={entry.key} style={{ marginLeft: 0 }} type="teal">
        {entry.key}:{entry.value}
      </Tag>
    );
  }
  const nextScheduledText = props.schedule.type === "runOnce" ? "Scheduled" : "Next Execution";
  const nextScheduleData = moment(props.schedule.nextScheduleDate).format(DATETIME_LOCAL_DISPLAY_FORMAT);

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
          title={`Delete Schedule`}
          subtitle={`Successfully deleted schedule ${props.schedule.name}`}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to delete schedule ${props.schedule.name} failed`}
        />
      );
      return;
    }
  };

  /**
   * Disable schedule
   */
  const [toggleScheduleStatusMutator, toggleStatusMutation] = useMutation(resolver.patchSchedule, {});

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
      queryCache.invalidateQueries(props.workflowScheduleUrl);
      queryCache.invalidateQueries(props.workflowCalendarUrl);
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
    {
      itemText: "Edit",
      onClick: () => {
        props.setActiveSchedule(props.schedule);
        props.setIsEditorOpen(true);
      },
    },
    {
      itemText: props.schedule.status === "inactive" ? "Enable" : "Disable",
      disabled: props.schedule.status === "trigger_disabled",
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
    <li key={props.schedule.id}>
      <Tile className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <h3 title={props.schedule.name}>{props.schedule.name}</h3>
          <TooltipHover direction="top" tooltipText={typeLabelMap[props.schedule.type] ?? "---"}>
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
          affirmativeButtonProps={{ disabled: toggleStatusMutation.isLoading }}
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

interface PanelProps {
  event?: ScheduleUnion;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditorPanel(props: PanelProps) {
  const schedule = props.event;

  function renderSchedule() {
    if (!schedule || !props.isOpen) {
      return null;
    }

    const nextScheduleData = moment(schedule.nextScheduleDate).format(DATETIME_LOCAL_DISPLAY_FORMAT);
    const labels = [];
    for (const entry of schedule?.labels || []) {
      labels.push(
        <Tag key={entry.key} style={{ marginLeft: 0 }} type="teal">
          {entry.key}:{entry.value}
        </Tag>
      );
    }

    return (
      <>
        <div className={styles.detailsSection}>
          <section className={styles.detailsInfo}>
            <div className={styles.detailsTitle}>
              <h2 title={schedule.name}>{schedule.name}</h2>
              <Button
                size="sm"
                kind="ghost"
                onClick={props.setIsEditorOpen}
                renderIcon={SettingsAdjust16}
                style={{ marginLeft: "auto" }}
              >
                Edit Schedule
              </Button>
            </div>
            <p className={styles.listItemDescription}>{schedule?.description ?? "---"}</p>
            <dl>
              <dt>Type</dt>
              <dd style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {typeLabelMap[schedule.type]}
                {schedule.type === "runOnce" ? <RepeatOne16 /> : <Repeat16 />}
              </dd>
            </dl>
            <dl>
              <dt>Status</dt>
              <dd style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                {statusLabelMap[schedule.status]}
                {schedule.status === "inactive" ? (
                  <RadioButton16 className={styles.statusCircle} data-status={schedule.status} />
                ) : (
                  <CircleFilled16 className={styles.statusCircle} data-status={schedule.status} />
                )}
              </dd>
            </dl>
            <dl>
              <dt>Scheduled</dt>
              <dd>{nextScheduleData}</dd>
            </dl>
            <dl>
              <dt>Time Zone </dt>
              <dd>{schedule.timezone}</dd>
            </dl>
            <dl>
              <dt>Frequency </dt>
              <dd>{schedule.type === "runOnce" ? "Once" : cronstrue.toString(schedule.cronSchedule)}</dd>
            </dl>
            <dl>
              <dt>Labels</dt>
              <dd>{labels.length > 0 ? labels : "---"}</dd>
            </dl>
          </section>
          <section>
            <h2>Workflow Parameters</h2>
            <p style={{ marginBottom: "1rem" }}>Values for your workflow</p>
            <CodeSnippet light hideCopyButton type="multi">
              {JSON.stringify(schedule?.parameters)}
            </CodeSnippet>
          </section>
          <hr />
        </div>
      </>
    );
  }
  return (
    <SlidingPane
      hideHeader
      className={styles.panelContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      {renderSchedule()}
    </SlidingPane>
  );
}
