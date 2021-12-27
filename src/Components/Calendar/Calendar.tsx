import React from "react";
import FullCalendar from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/common";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./Calender.module.scss";

export default function Calendar(props: CalendarOptions) {
  return (
    <div className={styles.container}>
      <FullCalendar
        aspectRatio={2}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        {...props}
      />
    </div>
  );
}
