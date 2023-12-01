import React from "react";
import { useQuery, UseQueryResult } from "react-query";
import { Loading } from "@boomerang-io/carbon-addons-boomerang-react";
import ErrorDragon from "Components/ErrorDragon";
import ScheduleCalendar from "Components/ScheduleCalendar";
import ScheduleCreator from "Components/ScheduleCreator";
import ScheduleEditor from "Components/ScheduleEditor";
import SchedulePanelDetail from "Components/SchedulePanelDetail";
import SchedulePanelList from "Components/SchedulePanelList";
import isArray from "lodash/isArray";
import moment from "moment-timezone";
import queryString from "query-string";
import { queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import type { SlotInfo } from "react-big-calendar";
import type {
  CalendarDateRange,
  CalendarEvent,
  CalendarEntry,
  ScheduleDate,
  ScheduleUnion,
  WorkflowSummary,
} from "Types";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
  canEditWorkflow: boolean;
}

export default function ScheduleView(props: ScheduleProps) {
  const [activeSchedule, setActiveSchedule] = React.useState<ScheduleUnion | undefined>();
  const [newSchedule, setNewSchedule] = React.useState<Pick<ScheduleDate, "dateSchedule" | "type"> | undefined>();
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

  const workflowCalendarQuery = useQuery<Array<CalendarEntry>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  const handleDateRangeChange = (dateRange: CalendarDateRange) => {
    if (!isArray(dateRange)) {
      const fromDate = moment(dateRange.start).unix();
      const toDate = moment(dateRange.end).unix();
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
    return <ErrorDragon />;
  }

  return (
    <>
      <div className={styles.container}>
        <SchedulePanelList
          includeStatusFilter
          getCalendarUrl={workflowCalendarUrl}
          getSchedulesUrl={workflowScheduleUrl}
          schedulesQuery={workflowSchedulesQuery}
          setActiveSchedule={setActiveSchedule}
          setIsEditorOpen={setIsEditorOpen}
          setIsCreatorOpen={setIsCreatorOpen}
          canEditWorkflow={props.canEditWorkflow}
        />
        <CalendarView
          onDateRangeChange={handleDateRangeChange}
          setActiveSchedule={setActiveSchedule}
          setIsCreatorOpen={setIsCreatorOpen}
          setIsEditorOpen={setIsEditorOpen}
          setIsPanelOpen={setIsPanelOpen}
          setNewSchedule={setNewSchedule}
          workflowSchedules={workflowSchedulesQuery.data}
          workflowCalendarQuery={workflowCalendarQuery}
        />
      </div>
      <SchedulePanelDetail
        className={styles.panelContainer}
        event={activeSchedule}
        isOpen={isPanelOpen}
        setIsOpen={setIsPanelOpen}
        setIsEditorOpen={setIsEditorOpen}
      />
      {props.canEditWorkflow && (
        <ScheduleCreator
          getCalendarUrl={workflowCalendarUrl}
          getSchedulesUrl={workflowScheduleUrl}
          isModalOpen={isCreatorOpen}
          onCloseModal={() => setIsCreatorOpen(false)}
          schedule={newSchedule}
          workflow={props.summaryData}
        />
      )}
      <ScheduleEditor
        getCalendarUrl={workflowCalendarUrl}
        getSchedulesUrl={workflowScheduleUrl}
        isModalOpen={isEditorOpen}
        onCloseModal={() => setIsEditorOpen(false)}
        schedule={activeSchedule}
        workflow={props.summaryData}
      />
    </>
  );
}

interface CalendarViewProps {
  onDateRangeChange: (dateRange: CalendarDateRange) => void;
  setActiveSchedule: React.Dispatch<React.SetStateAction<ScheduleUnion | undefined>>;
  setIsCreatorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewSchedule: React.Dispatch<React.SetStateAction<Pick<ScheduleDate, "dateSchedule" | "type"> | undefined>>;
  workflowCalendarQuery: UseQueryResult<Array<CalendarEntry>, any>;
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
            start: moment.tz(date, matchingSchedule.timezone).toDate(),
            end: moment.tz(date, matchingSchedule.timezone).toDate(),
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
      <ScheduleCalendar
        //@ts-ignore
        onSelectEvent={(data: CalendarEvent) => {
          props.setIsPanelOpen(true);
          props.setActiveSchedule({ ...data.resource, nextScheduleDate: new Date(data.start).toISOString() });
        }}
        onRangeChange={props.onDateRangeChange}
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
