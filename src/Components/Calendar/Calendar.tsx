import React from "react";
import { Calendar, momentLocalizer, EventProps, Event } from "react-big-calendar";
import { TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import moment from "moment";
import { statusLabelMap } from "Features/Schedule";
import { CircleFilled16, RadioButton16 } from "@carbon/icons-react";
import { CalendarEvent } from "Types";
import styles from "./Calendar.module.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./big-calendar.scss";

const localizer = momentLocalizer(moment);

interface MyCalendarProps {
  heightOffset?: number;
  events: Array<CalendarEvent>;
  [key: string]: any;
}
const MyCalendar = (props: MyCalendarProps) => {
  const { heightOffset = 260 } = props;
  const [height, setHeight] = React.useState(window.innerHeight - heightOffset); //meh

  React.useLayoutEffect(() => {
    function updateSize() {
      setHeight(window.innerHeight - heightOffset);
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  });

  return (
    <Calendar
      popup
      selectable
      components={{ event: CustomEvent }}
      drilldownView="agenda"
      localizer={localizer}
      messages={{ noEventsInRange: "" }}
      style={{ height }}
      views={["month", "agenda"]}
      eventPropGetter={(args: any) => ({
        className: styles.event,
      })}
      {...props}
    />
  );
};

interface LocalEventProps extends EventProps<Event> {
  event: CalendarEvent;
}

function CustomEvent(props: LocalEventProps) {
  const { event } = props;
  const schedule = event.resource;
  const hour = moment(event.start).format("h:mm a");
  return (
    <button className={styles.eventContentContainer} data-status={schedule.status} onClick={event.onClick}>
      <TooltipHover direction="top" tooltipText={statusLabelMap[schedule.status] ?? "---"}>
        {schedule.status === "inactive" ? (
          <RadioButton16 className={styles.statusCircle} data-status={schedule.status} />
        ) : (
          <CircleFilled16 className={styles.statusCircle} data-status={schedule.status} />
        )}
      </TooltipHover>
      <span>
        <b>{event.title}</b>
      </span>
      <span>{hour}</span>
    </button>
  );
}

export default MyCalendar;
