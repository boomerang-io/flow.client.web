import React from "react";
import FullCalendar from "@fullcalendar/react";
import { EventContentArg } from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/common";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { TooltipHover } from "@boomerang-io/carbon-addons-boomerang-react";
import { CircleFilled16 } from "@carbon/icons-react";
import capitalize from "lodash/capitalize";
import styles from "./Calender.module.scss";

export default function Calendar(props: CalendarOptions) {
  const height = window.innerHeight - 300; //meh
  return (
    <div className={styles.container}>
      <FullCalendar
        contentHeight={height}
        dayMaxEvents={3}
        weekNumberContent={<div>hello</div>}
        eventContent={renderEventContent}
        eventMaxStack={2}
        initialView="dayGridMonth"
        nowIndicator={true}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth,listWeek",
        }}
        {...props}
      />
    </div>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  const schedule = eventContent.event.extendedProps;
  return (
    <div className={styles.eventContentContainer} data-status={schedule.status}>
      <TooltipHover direction="top" tooltipText={capitalize(schedule.status)}>
        <CircleFilled16 className={styles.statusCircle} data-status={schedule.status} />
      </TooltipHover>
      <b>{eventContent.timeText}</b>
      <span>{eventContent.event.title}</span>
    </div>
  );
}
