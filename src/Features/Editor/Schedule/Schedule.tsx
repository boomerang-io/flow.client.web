/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useHistory } from "react-router";
import {
  Button,
  ConfirmModal,
  MultiSelect,
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
import RunOnceConfig from "./RunOnceConfig";
import Calendar from "Components/Calendar";
import capitalize from "lodash/capitalize";
import matchSorter from "match-sorter";
import moment from "moment";
import SlidingPane from "react-sliding-pane";
import queryString from "query-string";
import { queryStringOptions } from "Config/appConfig";
import { scheduleStatusOptions } from "Features/Schedule";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { EventContentArg } from "@fullcalendar/react";
import { CalendarEvent, ScheduleCalendar, ScheduleUnion, WorkflowSummary } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

export default function ScheduleView(props: ScheduleProps) {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveSchedule] = React.useState<ScheduleUnion | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);

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
   * Start rendering
   */

  if (!workflowSchedulesQuery.data) {
    return <Loading />;
  }

  if (workflowSchedulesQuery.error) {
    return <Error />;
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
          findAndSetActiveEvent={findAndSetActiveEvent}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          workflowId={props.summaryData.id}
          workflowSchedules={workflowSchedulesQuery.data}
        />
      </div>
      <EditorPanel event={activeEvent} isOpen={isEditorOpen} setIsOpen={setIsEditorOpen} />
      <CreatorPanel event={activeEvent} isOpen={isCreatorOpen} setIsOpen={setIsCreatorOpen} />
    </>
  );
}

interface CalendarViewProps {
  findAndSetActiveEvent: (event: EventContentArg) => void;
  setIsCreatorOpen: (isOpen: boolean) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowSchedules: Array<ScheduleUnion>;
}

function CalendarView(props: CalendarViewProps) {
  const [fromDate, setFromDate] = React.useState(moment().startOf("month").unix());
  const [toDate, setToDate] = React.useState(moment().endOf("month").unix());
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
    workflowId: props.workflowId,
    query: workflowCalendarUrlQuery,
  });

  const workflowCalendarQuery = useQuery<Array<ScheduleCalendar>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  const handleDateRangeChange = (dateInfo: any) => {
    const toDate = moment(dateInfo.endStr).unix();
    const fromDate = moment(dateInfo.startStr).unix();
    setToDate(toDate);
    setFromDate(fromDate);
  };

  const calendarEvents: Array<CalendarEvent> = [];
  if (workflowCalendarQuery.data && props.workflowSchedules) {
    for (let calendarEntry of workflowCalendarQuery.data) {
      const matchingSchedule: ScheduleUnion | undefined = props.workflowSchedules.find(
        (schedule: ScheduleUnion) => schedule.id === calendarEntry.scheduleId
      );
      if (matchingSchedule) {
        for (const date of calendarEntry.dates) {
          const newEntry = { ...matchingSchedule, start: date, title: matchingSchedule.name };
          calendarEvents.push(newEntry);
        }
      }
    }
  }

  return (
    <section className={styles.calendarContainer}>
      <Calendar
        eventClick={(data: any) => {
          props.setIsEditorOpen(true);
          props.findAndSetActiveEvent(data);
        }}
        datesSet={handleDateRangeChange}
        dateClick={() => props.setIsCreatorOpen(true)}
        events={calendarEvents}
      />
    </section>
  );
}

interface ScheduleListProps {
  schedules: Array<ScheduleUnion>;
  setActiveSchedule: (event: ScheduleUnion) => void;
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

    const sortedSchedules = filteredSchedules.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return sortedSchedules.map((schedule) => (
      <ScheduledListItem
        key={schedule.id}
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
            // onChange={handleSelectStatuses}
            items={scheduleStatusOptions}
            // itemToString={(item) => (item ? item.label : "")}
            // initialSelectedItems={scheduleStatusOptions.filter((option) =>
            //   Boolean(selectedStatuses.find((status) => status === option.value))
            // )}
            titleText="Filter by status"
          />
        </div>
      </div>
      <ul>{renderLists()}</ul>
    </section>
  );
}

interface ScheduledListItemProps {
  schedule: ScheduleUnion;
  setActiveSchedule: (event: ScheduleUnion) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  workflowId: string;
  workflowScheduleUrl: string;
}

function ScheduledListItem(props: ScheduledListItemProps) {
  const history = useHistory();
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Determine some things for rendering
  const isActive = props.schedule.status === "active";

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
      queryCache.invalidateQueries(props.workflowScheduleUrl);
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
        props.setIsEditorOpen(true);
        props.setActiveSchedule(props.schedule);
      },
    },
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
          <TooltipHover direction="top" tooltipText={capitalize(props.schedule.status)}>
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

interface PanelProps {
  event: ScheduleUnion | null;
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
        {props.event && (
          <>
            <section>
              {props?.event?.type === "advancedCron" || props?.event?.type === "cron" ? (
                <CronJobConfig
                  {...props.event}
                  advancedCron={props.event?.type === "advancedCron"}
                  handleOnChange={(event: any) => console.log(event)}
                />
              ) : (
                <RunOnceConfig event={props.event} />
              )}
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
          </>
        )}
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
          {
            //<CronJobConfig />
          }
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
