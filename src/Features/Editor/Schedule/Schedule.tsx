import React from "react";
import {
  Button,
  CheckboxList,
  ComboBox,
  DatePicker,
  DatePickerInput,
  InlineLoading,
  OverflowMenu,
  OverflowMenuItem,
  TextInput,
  Tile,
  Toggle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CronJobConfig from "./CronJobConfig";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SlidingPane from "react-sliding-pane";
import moment from "moment";
import queryString from "query-string";
import { WorkflowSummary } from "Types";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  summaryData: WorkflowSummary;
}

interface Event {
  id: string;
  title: string;
  start: string;
}

const events = [
  { id: "2", title: "Trigger", start: "2021-12-07T12:00:00" },
  { id: "1", title: "Daily event", start: "2021-12-08T15:00:00" },
];

export default function Schedule(props: ScheduleProps) {
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [activeEvent, setActiveEvent] = React.useState<Event | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);
  const [activeDate, setActiveDate] = React.useState(null);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.listContainer}>
            <h2>{`Existing Schedules (${events.length})`}</h2>
            <div>
              <DatePicker
                id="schedule-date-picker"
                dateFormat="m/d/Y"
                datePickerType="range"
                style={{ marginTop: "1rem" }}
              >
                <DatePickerInput
                  autoComplete="off"
                  id="schedule-date-picker-start"
                  labelText="Start date"
                  placeholder="mm/dd/yyyy"
                />
                <DatePickerInput
                  autoComplete="off"
                  id="schedule-date-picker-end"
                  labelText="End date"
                  placeholder="mm/dd/yyyy"
                />
              </DatePicker>
            </div>
            <ul>
              {events.map((event) => {
                return (
                  <li>
                    <Tile className={styles.listItem}>
                      <h3>{event.title}</h3>
                      <p>{event.start}</p>
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
                <dt>Title:</dt>
                <dd>{activeEvent?.title}</dd>
                <dt>Time:</dt>
                <dd>{activeEvent?.start.toString()}</dd>
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
