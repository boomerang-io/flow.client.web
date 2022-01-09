import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import capitalize from "lodash/capitalize";
import moment from "moment";
import { CalendarEvent } from "Types";
import { CircleFilled16 } from "@carbon/icons-react";
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
  const { heightOffset = 250 } = props;
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
      components={{ event: renderEventContent }}
      localizer={localizer}
      style={{ height }}
      views={["month", "agenda"]}
      eventPropGetter={(args: any) => ({
        className: styles.event,
      })}
      {...props}
    />
  );
};

function renderEventContent(eventContent: any) {
  const event = eventContent.event;
  const schedule = event.resource;
  const hour = moment(event.start).format("h:mm a");
  return (
    <div className={styles.eventContentContainer} data-status={schedule.status}>
      <TooltipHover direction="top" tooltipText={capitalize(schedule.status.split("_").join(" "))}>
        <CircleFilled16 className={styles.statusCircle} data-status={schedule.status} />
      </TooltipHover>
      <span>
        <b>{event.title}</b>
      </span>
      <span>{hour}</span>
    </div>
  );
}

export default MyCalendar;
