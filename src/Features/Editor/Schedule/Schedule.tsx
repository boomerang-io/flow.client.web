//@ts-nocheck
import React from "react";
import {
  Button,
  Error,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tile,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { useQuery } from "react-query";
import CronJobConfig from "./CronJobConfig";
import Calendar from "Components/Calendar";
import matchSorter from "match-sorter";
import moment from "moment";
import SlidingPane from "react-sliding-pane";
import queryString, { StringifyOptions } from "query-string";
import { AppPath, appLink, queryStringOptions } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { WorkflowSummary } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

interface ScheduledEvent {
  id: string;
  name: string;
  description?: string;
  labels?: { [k: string]: string };
  parameters?: { [k: string]: string };
  status: "active" | "inactive" | "deleted";
  type: "runOnce" | "cron" | "advancedCron";
}

interface ScheduledDateEvent extends ScheduledEvent {
  dateSchedule: string;
}

interface ScheduledCronEvent extends ScheduledEvent {
  cronSchedule: string;
}

type ScheduledEventUnion = ScheduledDateEvent | ScheduledCronEvent;

export default function Schedule(props: ScheduleProps) {
  const [fromDate, setFromDate] = React.useState(moment().startOf("month"));
  const [toDate, setToDate] = React.useState(moment().startOf("month"));
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveEvent] = React.useState<ScheduledEventUnion | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState("");

  /**
   * Get the schedule for the workflow
   * A schedule is an object that defines the events
   */

  const workflowScheduleUrl = serviceUrl.getWorkflowSchedules({
    workflowId: props.summaryData.id,
  });

  const workflowSchedulesQuery = useQuery<Array<ScheduledEventUnion>, string>({
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
      fromDate,
      toDate,
    },
    queryStringOptions
  );

  const workflowCalendarUrl = serviceUrl.getWorkflowCalendar({
    workflowId: props.summaryData.id,
    query: workflowCalendarUrlQuery,
  });

  const workflowCalendarQuery = useQuery<Array<ScheduledEventUnion>, string>({
    queryKey: workflowCalendarUrl,
    queryFn: resolver.query(workflowCalendarUrl),
  });

  if (!workflowCalendarQuery.data || !workflowSchedulesQuery.data) {
    return <Loading />;
  }

  if (workflowCalendarQuery.error || workflowSchedulesQuery.error) {
    return <Error />;
  }

  const calendarEvents = workflowCalendarQuery.data.map((entry: ScheduledEventUnion) => {
    let newEntry = { ...entry };
    if (entry.dateSchedule) {
      newEntry["start"] = entry.dateSchedule;
    } else {
      newEntry["start"] = entry.cronSchedule;
    }
    return newEntry;
  });

  const schedules = workflowSchedulesQuery.data;
  const filteredSchedules = Boolean(filterQuery)
    ? matchSorter(schedules, filterQuery, {
        keys: ["name", "description", "type", "status"],
      })
    : schedules;

  return (
    <>
      <div className={styles.container}>
        <section className={styles.listContainer}>
          <h2>{`Existing Schedules (${schedules.length})`}</h2>
          <Search
            light
            id="Search"
            placeHolderText="Filter schedules"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
          />
          <ul>
            {filteredSchedules.map((schedule) => {
              const labelMap = new Map<string, string>(Object.entries(schedule?.labels ?? {}));
              const labels = [];
              for (const [key, value] of labelMap) {
                labels.push(
                  <div>
                    <dt style={{ display: "inline-block" }}>{key}</dt>
                    <dd style={{ display: "inline-block" }}>{value}</dd>
                  </div>
                );
              }
              return (
                <li>
                  <Tile className={styles.listItem}>
                    <h3>{schedule.name}</h3>
                    <p>{schedule?.description ?? "---"}</p>
                    <dl>{labels}</dl>
                    <OverflowMenu
                      flipped
                      ariaLabel="Schedule card menu"
                      iconDescription="Schedule menu icon"
                      style={{ position: "absolute", right: "0", top: "0" }}
                    >
                      <OverflowMenuItem itemText={"Edit"} key={"Edit"} />
                      <OverflowMenuItem itemText={"View Activity"} key={"Activity"} />
                      <OverflowMenuItem itemText={"Duplicate"} key={"Duplicate"} />
                      <OverflowMenuItem itemText={"Delete"} key={"Delete"} />
                    </OverflowMenu>
                  </Tile>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.calendarContainer}>
          <Calendar
            eventClick={(data: any) => {
              setIsEditorOpen(true);
              setActiveEvent(data.event);
            }}
            datesSet={(dateinfo) => console.log(dateinfo)}
            dateClick={() => setIsCreatorOpen(true)}
            //eventContent={renderEventContent}
            events={calendarEvents}
          />
        </section>
      </div>
      <SlidingPane
        hideHeader
        className={styles.editorContainer}
        onRequestClose={() => setIsEditorOpen(false)}
        isOpen={isEditorOpen}
        width="32rem"
      >
        <div className={styles.detailsSection}>
          <section>
            <h2>Details</h2>
            <dl>
              <div>
                <dt style={{ display: "inline-block" }}>Title:</dt>
                <dd style={{ display: "inline-block" }}>{activeEvent?.name}</dd>
              </div>
              <div>
                <dt style={{ display: "inline-block" }}>Time:</dt>
                {/* <dd style={{ display: "inline-block" }}>{moment(activeEvent.).format("YYYY-MM-DD hh:mm A")}</dd> */}
              </div>
            </dl>
          </section>
          <hr />
          <section>
            <h2>Change schedule</h2>
            <CronJobConfig />
          </section>
          <hr />
          <section>
            <h2>Workflow parameters</h2>
            <p>Provide parameter values for your workflow</p>
          </section>
          <hr />
          <footer>
            <Button kind="secondary">Cancel</Button>
            <Button>Save</Button>
          </footer>
        </div>
      </SlidingPane>
      <SlidingPane
        hideHeader
        className={styles.editorContainer}
        onRequestClose={() => setIsCreatorOpen(false)}
        isOpen={isCreatorOpen}
        width="32rem"
      >
        <h2>Create</h2>
      </SlidingPane>
    </>
  );
}

// function renderEventContent(eventInfo: any) {
//   return (
//     <div className={styles.eventContentContainer}>
//       <p>{eventInfo.event.title}</p>
//       {/* <OverflowMenu
//         flipped
//         ariaLabel="Schedule card menu"
//         iconDescription="Schedule menu icon"
//         style={{ position: "absolute", right: "0" }}
//       >
//         <OverflowMenuItem itemText={"Edit"} key={"Edit"} />
//         <OverflowMenuItem itemText={"View Activity"} key={"Activity"} />
//         <OverflowMenuItem itemText={"Duplicate"} key={"Duplicate"} />
//         <OverflowMenuItem itemText={"Delete"} key={"Delete"} />
//       </OverflowMenu> */}
//     </div>
//   );
// }
