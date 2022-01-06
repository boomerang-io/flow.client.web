/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useHistory } from "react-router";
import {
  Button,
  ConfirmModal,
  Error,
  Loading,
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
import { Add16, CircleFilled16 } from "@carbon/icons-react";
import { useQuery, useMutation, queryCache } from "react-query";
import CronJobConfig from "./CronJobConfig";
import Calendar from "Components/Calendar";
import capitalize from "lodash/capitalize";
import matchSorter from "match-sorter";
import moment from "moment";
import SlidingPane from "react-sliding-pane";
import queryString from "query-string";
import { appLink, queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { EventContentArg } from "@fullcalendar/react";
import { WorkflowSummary } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

interface WorkflowScheduleCalendar {
  scheduleId: string;
  dates: Array<string>;
}

interface WorkflowSchedule {
  id: string;
  name: string;
  description?: string;
  labels?: Array<{ key: string; value: string }>;
  parameters?: { [k: string]: string };
  status: "active" | "inactive" | "deleted" | "trigger_disabled";
  type: "runOnce" | "cron" | "advancedCron";
}

interface WorkflowScheduleDate extends WorkflowSchedule {
  dateSchedule: string;
}

interface WorkflowScheduleCron extends WorkflowSchedule {
  cronSchedule: string;
}

interface CalendarEvent extends WorkflowSchedule {
  start: string;
  title: string;
}

type WorkflowScheduleUnion = WorkflowScheduleDate | WorkflowScheduleCron;

export default function Schedule(props: ScheduleProps) {
  const [fromDate, setFromDate] = React.useState(moment().startOf("month").unix());
  const [toDate, setToDate] = React.useState(moment().endOf("month").unix());
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveSchedule] = React.useState<WorkflowScheduleUnion | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);

  /**
   * Get the schedules for the workflow
   * A schedule is an object that defines the events
   */

  const workflowScheduleUrl = serviceUrl.getWorkflowSchedules({ workflowId: props.summaryData.id });

  const workflowSchedulesQuery = useQuery<Array<WorkflowScheduleUnion>, string>({
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

  const workflowCalendarQuery = useQuery<Array<WorkflowScheduleCalendar>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  /**
   * Start rendering
   */

  if (!workflowCalendarQuery.data || !workflowSchedulesQuery.data) {
    return <Loading />;
  }

  if (workflowCalendarQuery.error || workflowSchedulesQuery.error) {
    return <Error />;
  }

  const calendarEvents: Array<CalendarEvent> = [];
  for (let calendarEntry of workflowCalendarQuery.data) {
    const matchingSchedule: WorkflowScheduleUnion | undefined = workflowSchedulesQuery.data.find(
      (schedule: WorkflowScheduleUnion) => schedule.id === calendarEntry.scheduleId
    );
    if (matchingSchedule) {
      for (const date of calendarEntry.dates) {
        const newEntry = { ...matchingSchedule, start: date, title: matchingSchedule.name };
        calendarEvents.push(newEntry);
      }
    }
  }

  const schedules = workflowSchedulesQuery.data;

  function findAndSetActiveEvent(eventContent: EventContentArg) {
    if (workflowSchedulesQuery.data) {
      const foundEvent = workflowSchedulesQuery.data.find(
        (calendarEvent) => calendarEvent.id === eventContent.event.id
      );
      setActiveSchedule(foundEvent || null);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <ScheduleList
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          schedules={schedules}
          workflowId={props.summaryData.id}
          workflowScheduleUrl={workflowScheduleUrl}
        />
        <CalendarView
          events={calendarEvents}
          findAndSetActiveEvent={findAndSetActiveEvent}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
        />
      </div>
      <EditorPanel event={activeEvent} isOpen={isEditorOpen} setIsOpen={setIsEditorOpen} />
      <CreatorPanel event={activeEvent} isOpen={isCreatorOpen} setIsOpen={setIsCreatorOpen} />
    </>
  );
}

interface CalendarViewProps {
  events: Array<CalendarEvent>;
  setFromDate: (unixDate: number) => void;
  setToDate: (unixDate: number) => void;
  setIsCreatorOpen: (isOpen: boolean) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  findAndSetActiveEvent: (event: EventContentArg) => void;
}

function CalendarView(props: CalendarViewProps) {
  const handleDateRangeChange = (dateInfo: any) => {
    const toDate = moment(dateInfo.endStr).unix();
    const fromDate = moment(dateInfo.startStr).unix();
    props.setToDate(toDate);
    props.setFromDate(fromDate);
  };

  return (
    <section className={styles.calendarContainer}>
      <Calendar
        eventClick={(data: any) => {
          props.setIsEditorOpen(true);
          props.findAndSetActiveEvent(data);
        }}
        datesSet={handleDateRangeChange}
        dateClick={() => props.setIsCreatorOpen(true)}
        events={props.events}
      />
    </section>
  );
}

interface ScheduleListProps {
  schedules: Array<WorkflowScheduleUnion>;
  setActiveSchedule: (event: WorkflowScheduleUnion) => void;
  setIsCreatorOpen: (isOpen: boolean) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowScheduleUrl: string;
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

    return filteredSchedules.map((schedule) => (
      <ScheduledListItem
        schedule={schedule}
        setActiveSchedule={props.setActiveSchedule}
        setIsEditorOpen={props.setIsEditorOpen}
        workflowId={props.workflowId}
        workflowScheduleUrl={props.workflowScheduleUrl}
      />
    ));
  }

  return (
    <section className={styles.listContainer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>{`Existing Schedules (${props.schedules.length})`}</h2>
        <Button size="field" renderIcon={Add16} onClick={props.setIsCreatorOpen} disabled>
          Create a Schedule
        </Button>
      </div>
      <Search
        light
        id="Search"
        placeHolderText="Filter schedules"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
      />
      <ul>{renderLists()}</ul>
    </section>
  );
}

interface ScheduledListItemProps {
  schedule: WorkflowScheduleUnion;
  setActiveSchedule: (event: WorkflowScheduleUnion) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowScheduleUrl: string;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const history = useHistory();
  const [isDisableModalOpen, setIsDisableModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  /**
   * Delete schedule
   */

  const [deleteScheduleMutator, { isLoading: isDeletingWorkflowSchedule }] = useMutation(resolver.deleteSchedule, {});

  const handleDeleteWorkflowSchedule = async (workflow: WorkflowSummary) => {
    try {
      await deleteScheduleMutator({ workflowId: props.workflowId, scheduleId: props.schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Duplicate ${props.schedule.name}`}
          subtitle={`Successfully duplicated ${props.schedule.name}`}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
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
  const [disableWorkflowScheduleMutator, { isLoading: isDisablingWorkflowSchedule }] = useMutation(
    resolver.deleteSchedule,
    {}
  );

  const handleDisableWorkflowSchedule = async (workflow: WorkflowSummary) => {
    try {
      await disableWorkflowScheduleMutator({ workflowId: props.workflowId, scheduleId: props.schedule.id });
      notify(
        <ToastNotification
          kind="success"
          title={`Disable ${props.schedule.name}`}
          subtitle={`Successfully disabled ${props.schedule.name}`}
        />
      );
      queryCache.invalidateQueries(props.workflowScheduleUrl);
    } catch (e) {
      notify(
        <ToastNotification
          kind="error"
          title="Something's Wrong"
          subtitle={`Request to disabled ${props.schedule.name} failed`}
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
        props.setIsEditorOpen(true);
        props.setActiveSchedule(props.schedule);
      },
    },
    {
      itemText: "View Activity",
      onClick: () => history.push(appLink.workflowActivity({ workflowId: props.schedule.id })),
    },
    {
      itemText: "Disable",
      onClick: () => setIsDisableModalOpen(true),
    },
    {
      hasDivider: true,
      itemText: "Delete",
      isDelete: true,
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  const labels = [];
  for (const entry of props.schedule?.labels || []) {
    labels.push(
      <Tag>
        {entry.key}:{entry.value}
      </Tag>
    );
  }

  return (
    <li>
      <Tile className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <h3 title={props.schedule.name}>{props.schedule.name}</h3>
          <TooltipHover direction="top" tooltipText={capitalize(props.schedule.status)}>
            <CircleFilled16 className={styles.statusCircle} data-status={props.schedule.status} />
          </TooltipHover>
        </div>
        <p className={styles.listItemDescription}>{props.schedule?.description ?? "---"}</p>
        <div>
          <dt>Frequency:</dt>
          <dd>{props.schedule.type === "runOnce" ? "Once" : "Repeated"}</dd>
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
      {isDisableModalOpen && (
        <ConfirmModal
          affirmativeAction={() => {}}
          affirmativeButtonProps={{ kind: "danger" }}
          affirmativeText="Delete"
          isOpen={isDisableModalOpen}
          negativeAction={() => {
            setIsDisableModalOpen(false);
          }}
          negativeText="Cancel"
          onCloseModal={() => {
            setIsDisableModalOpen(false);
          }}
          title={`Disable Schedule?`}
        >
          {`Are you sure you want to disable schedule ${props.schedule.name}? Don't worry, you can re-enable it in the future.`}
        </ConfirmModal>
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          affirmativeAction={() => console.log(props.schedule)}
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

interface PanelProps {
  event: WorkflowScheduleUnion | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function EditorPanel(props: PanelProps) {
  return (
    <SlidingPane
      hideHeader
      className={styles.editorContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      <div className={styles.detailsSection}>
        <section>
          <h2>Details</h2>
          <dl>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <dt style={{ display: "inline-block" }}>Type:</dt>
              <dd style={{ display: "inline-block" }}>{props.event?.type ?? "---"}</dd>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <dt style={{ display: "inline-block" }}>Title:</dt>
              <dd style={{ display: "inline-block" }}>{props.event?.name ?? "---"}</dd>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <dt style={{ display: "inline-block" }}>Description:</dt>
              <dd style={{ display: "inline-block" }}>{props.event?.description ?? "---"}</dd>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <dt style={{ display: "inline-block" }}>Time:</dt>
              {/* <dd style={{ display: "inline-block" }}>
                {props?.event?.start ? moment(props.event.start).format("YYYY-MM-DD hh:mm A") : "---"}
              </dd> */}
            </div>
          </dl>
        </section>
        <hr />
        <section>
          <CronJobConfig {...props.event} advancedCron={props.event?.type === "advancedCron"} />
        </section>
        <hr />
        <section>
          <h2>Workflow parameters</h2>
          <p>Provide parameter values for your workflow</p>
        </section>
        <hr />
        <footer>
          <Button kind="secondary" onClick={() => props.setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Save</Button>
        </footer>
      </div>
    </SlidingPane>
  );
}

function CreatorPanel(props: PanelProps) {
  return (
    <SlidingPane
      hideHeader
      className={styles.editorContainer}
      onRequestClose={() => props.setIsOpen(false)}
      isOpen={props.isOpen}
      width="32rem"
    >
      <div className={styles.detailsSection}>
        <section>
          <h2>Create a Schedule</h2>
          <TextInput id="name" labelText="Name" placeholder="e.g. Daily reporting" />
          <TextArea id="description" labelText="Description" placeholder="e.g. Gather and submit daily reports" />
        </section>
        <section>
          <h2>Change schedule</h2>
          <CronJobConfig />
        </section>
        <hr />
        <section>
          <h2>Workflow parameters</h2>
          <p>Provide parameter values for your workflow</p>
        </section>
        <footer>
          <Button kind="secondary" onClick={() => props.setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Save</Button>
        </footer>
      </div>
    </SlidingPane>
  );
}

// function renderEventContent(eventContent: EventContentArg) {
//   console.log(eventContent);
//   return (
//     <div className={styles.eventContentContainer}>
//       <b>{eventContent.timeText}</b>
//       <i>{eventContent.event.title}</i>
//     </div>
//   );
// }
