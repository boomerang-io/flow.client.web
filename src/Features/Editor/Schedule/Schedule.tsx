import React from "react";
import { Button, OverflowMenu, OverflowMenuItem, Tile } from "@boomerang-io/carbon-addons-boomerang-react";
import CronJobConfig from "./CronJobConfig";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SlidingPane from "react-sliding-pane";
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

const events: Array<ScheduledEventUnion> = [
  {
    dateSchedule: "2021-12-07T12:00:00",
    description: "This triggers things",
    id: "2",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Trigger",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "runOnce",
  },
  {
    cronSchedule: "2021-12-08T15:00:00",
    description: "This does stuff daily",
    id: "1",
    labels: { maintenance: "hello", daily: "yes" },
    name: "Daily event",
    parameters: { name: "Tyson", word: "this" },
    status: "active",
    type: "cron",
  },
];

export default function Schedule(props: ScheduleProps) {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveEvent] = React.useState<ScheduledEventUnion | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const [activeDate, setActiveDate] = React.useState(null);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.listContainer}>
            <h2>{`Existing Schedules (${events.length})`}</h2>
            <ul>
              {events.map((event) => {
                const labelMap = new Map<string, string>(Object.entries(event?.labels ?? {}));
                const labels = [];
                for (const [key, value] of labelMap) {
                  labels.push(
                    <>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </>
                  );
                }
                return (
                  <li>
                    <Tile className={styles.listItem}>
                      <h3>{event.name}</h3>
                      <dl>{labels}</dl>
                      <p>{event?.description ?? "---"}</p>
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
            <FullCalendar
              aspectRatio={2}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              eventClick={(data: any) => {
                setIsEditorOpen(true);
                setActiveEvent(data.event);
              }}
              dateClick={() => setIsCreatorOpen(true)}
              //eventContent={renderEventContent}
              events={events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
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
      </main>
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
